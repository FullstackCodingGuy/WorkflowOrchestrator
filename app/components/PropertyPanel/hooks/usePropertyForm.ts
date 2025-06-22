'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';

interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'range' | 'custom';
}

export type { ValidationError };

interface PropertyFormState {
  localData: Record<string, unknown>;
  originalData: Record<string, unknown>;
  isDirty: boolean;
  isValidating: boolean;
  errors: Record<string, ValidationError | undefined>;
  pendingUpdates: Record<string, unknown>;
}

interface UsePropertyFormProps {
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
}

const DEFAULT_STATE: PropertyFormState = {
  localData: {},
  originalData: {},
  isDirty: false,
  isValidating: false,
  errors: {},
  pendingUpdates: {},
};

export const usePropertyForm = ({ selectedItems, onItemUpdate }: UsePropertyFormProps) => {
  const [formState, setFormState] = useState<PropertyFormState>(DEFAULT_STATE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize form data when selectedItems change
  useEffect(() => {
    if (selectedItems.length === 0) {
      setFormState(DEFAULT_STATE);
      return;
    }

    const newData: Record<string, unknown> = {};
    
    selectedItems.forEach(item => {
      if (item.data) {
        const itemData = item.data as Record<string, unknown>;
        Object.keys(itemData).forEach(key => {
          if (selectedItems.length === 1) {
            // Single selection - use exact values
            newData[key] = itemData[key];
          } else {
            // Multiple selection - handle mixed values
            if (newData[key] === undefined) {
              newData[key] = itemData[key];
            } else if (newData[key] !== itemData[key]) {
              newData[key] = ''; // Mixed values indicator
            }
          }
        });
      }
      
      // Add basic properties
      newData[`${item.id}_id`] = item.id;
      newData[`${item.id}_type`] = item.type;
      
      if ('source' in item) {
        // Edge properties
        newData[`${item.id}_source`] = item.source;
        newData[`${item.id}_target`] = item.target;
        newData[`${item.id}_sourceHandle`] = item.sourceHandle;
        newData[`${item.id}_targetHandle`] = item.targetHandle;
      } else {
        // Node properties
        newData[`${item.id}_position`] = item.position;
        newData[`${item.id}_width`] = item.width;
        newData[`${item.id}_height`] = item.height;
      }
    });

    setFormState(prev => ({
      ...prev,
      localData: newData,
      originalData: JSON.parse(JSON.stringify(newData)),
      isDirty: false,
      errors: {},
    }));
  }, [selectedItems]);

  // Update a single field
  const updateField = useCallback((field: string, value: unknown) => {
    setFormState(prev => {
      const newLocalData = { ...prev.localData, [field]: value };
      const isDirty = JSON.stringify(newLocalData) !== JSON.stringify(prev.originalData);
      
      return {
        ...prev,
        localData: newLocalData,
        isDirty,
        pendingUpdates: { ...prev.pendingUpdates, [field]: value },
      };
    });

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounced validation
    timeoutRef.current = setTimeout(() => {
      validateField(field, value);
    }, 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate a single field
  const validateField = useCallback((field: string, value: unknown) => {
    const errors: ValidationError[] = [];

    // Required field validation
    if (field.includes('label') && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push({
        field,
        message: 'Label is required',
        type: 'required',
      });
    }

    // Numeric validation
    if (field.includes('width') || field.includes('height')) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (value !== undefined && value !== '' && (typeof numValue !== 'number' || isNaN(numValue) || numValue < 0)) {
        errors.push({
          field,
          message: 'Must be a positive number',
          type: 'range',
        });
      }
    }

    // Color validation
    if (field.includes('color') || field.includes('Color')) {
      if (value && typeof value === 'string' && !isValidColor(value)) {
        errors.push({
          field,
          message: 'Invalid color format',
          type: 'invalid',
        });
      }
    }

    setFormState(prev => {
      const newErrors = { ...prev.errors };
      if (errors.length > 0) {
        newErrors[field] = errors[0];
      } else {
        delete newErrors[field];
      }
      
      return {
        ...prev,
        errors: newErrors,
      };
    });
  }, []);

  // Helper function to validate color
  const isValidColor = (color: string): boolean => {
    // Check hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return true;
    }
    
    // Check rgb/rgba colors
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color)) {
      return true;
    }
    
    // Check named colors (basic check)
    const namedColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white', 'gray', 'grey'];
    return namedColors.includes(color.toLowerCase());
  };

  // Apply changes to selected items
  const applyChanges = useCallback(() => {
    if (!formState.isDirty) return;

    selectedItems.forEach(item => {
      const updates: Record<string, unknown> = {};
      
      // Extract updates for this item
      Object.keys(formState.pendingUpdates).forEach(field => {
        if (field.startsWith(`${item.id}_`)) {
          const actualField = field.replace(`${item.id}_`, '');
          updates[actualField] = formState.pendingUpdates[field];
        } else if (selectedItems.length === 1) {
          // Single item - apply all non-prefixed updates to data
          if (!field.includes('_id') && !field.includes('_type')) {
            if (!updates.data) updates.data = {};
            (updates.data as Record<string, unknown>)[field] = formState.pendingUpdates[field];
          }
        }
      });

      if (Object.keys(updates).length > 0) {
        onItemUpdate(item.id, updates);
      }
    });

    // Reset form state
    setFormState(prev => ({
      ...prev,
      originalData: JSON.parse(JSON.stringify(prev.localData)),
      isDirty: false,
      pendingUpdates: {},
    }));
  }, [formState.isDirty, formState.pendingUpdates, selectedItems, onItemUpdate]);

  // Reset form to original values
  const resetForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      localData: JSON.parse(JSON.stringify(prev.originalData)),
      isDirty: false,
      errors: {},
      pendingUpdates: {},
    }));
  }, []);

  // Preview changes (without applying)
  const previewChanges = useCallback(() => {
    // This would trigger a preview mode in the diagram
    // For now, just console log the changes
    console.log('Preview changes:', formState.pendingUpdates);
  }, [formState.pendingUpdates]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    formData: formState.localData,
    originalData: formState.originalData,
    isDirty: formState.isDirty,
    isValidating: formState.isValidating,
    errors: formState.errors,
    pendingUpdates: formState.pendingUpdates,
    updateField,
    validateField,
    applyChanges,
    resetForm,
    previewChanges,
  };
};
