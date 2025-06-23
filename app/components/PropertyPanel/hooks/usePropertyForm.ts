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
  autoSyncStatus: 'idle' | 'syncing' | 'synced';
  lastSyncTime: number | null;
}

interface UsePropertyFormProps {
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
  onNodePositionUpdate?: (nodeId: string, position: { x: number; y: number }) => void;
}

const DEFAULT_STATE: PropertyFormState = {
  localData: {},
  originalData: {},
  isDirty: false,
  isValidating: false,
  errors: {},
  pendingUpdates: {},
  autoSyncStatus: 'idle',
  lastSyncTime: null,
};

export const usePropertyForm = ({ selectedItems, onItemUpdate, onNodePositionUpdate }: UsePropertyFormProps) => {
  const [formState, setFormState] = useState<PropertyFormState>(DEFAULT_STATE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize form data when selectedItems change
  useEffect(() => {
    if (selectedItems.length === 0) {
      setFormState(DEFAULT_STATE);
      return;
    }

    const newData: Record<string, unknown> = {};
    
    if (selectedItems.length === 1) {
      // Single selection - extract all data properties
      const item = selectedItems[0];
      
      // Extract node/edge data properties with proper defaults
      if (item.data) {
        const itemData = item.data as Record<string, unknown>;
        Object.keys(itemData).forEach(key => {
          newData[key] = itemData[key];
        });
      }
      
      // Add core properties
      newData.id = item.id;
      newData.type = item.type;
      
      // Enhanced color and typography extraction with defaults
      newData.color = newData.color || '#6366f1';
      newData.backgroundColor = newData.backgroundColor || '#ffffff';
      newData.borderColor = newData.borderColor || '#cccccc';
      newData.textColor = newData.textColor || '#000000';
      newData.fontSize = newData.fontSize || 14;
      newData.fontFamily = newData.fontFamily || 'Arial, sans-serif';
      newData.fontWeight = newData.fontWeight || 'normal';
      newData.textAlign = newData.textAlign || 'left';
      newData.lineHeight = newData.lineHeight || 1.5;
      newData.maxWidth = newData.maxWidth || 200;
      
      if ('source' in item) {
        // Edge properties
        newData.source = item.source;
        newData.target = item.target;
        newData.sourceHandle = item.sourceHandle;
        newData.targetHandle = item.targetHandle;
      } else {
        // Node properties including position and settings
        const node = item as Node<DiagramNodeData>;
        newData.position = node.position;
        newData.positionX = node.position.x;
        newData.positionY = node.position.y;
        newData.width = node.width;
        newData.height = node.height;
        
        // Node-level properties (React Flow properties)
        newData.draggable = node.draggable ?? true;
        newData.selectable = node.selectable ?? true;
        newData.deletable = node.deletable ?? true;
        newData.zIndex = node.zIndex ?? 0;
        
        // Settings from data (stored for persistence)
        newData.snapToGrid = node.data?.snapToGrid ?? false;
        newData.gridSize = node.data?.gridSize ?? 20;
        newData.showMinimap = node.data?.showMinimap ?? true;
        newData.showControls = node.data?.showControls ?? true;
      }
    } else {
      // Multiple selection - handle common properties
      const commonProperties: Record<string, unknown> = {};
      
      selectedItems.forEach((item, index) => {
        if (item.data) {
          const itemData = item.data as Record<string, unknown>;
          Object.keys(itemData).forEach(key => {
            if (index === 0) {
              // First item - set initial values
              commonProperties[key] = itemData[key];
            } else {
              // Subsequent items - check for differences
              if (commonProperties[key] !== itemData[key]) {
                commonProperties[key] = ''; // Mixed values indicator
              }
            }
          });
        }
      });
      
      // Use common properties for bulk editing
      Object.assign(newData, commonProperties);
      newData.bulkEdit = true;
      newData.selectionCount = selectedItems.length;
    }

    setFormState(prev => ({
      ...prev,
      localData: newData,
      originalData: JSON.parse(JSON.stringify(newData)),
      isDirty: false,
      errors: {},
    }));
  }, [selectedItems]);

  // Update a single field with enhanced auto-sync
  const updateField = useCallback((field: string, value: unknown) => {
    setFormState(prev => {
      const newLocalData = { ...prev.localData, [field]: value };
      const isDirty = JSON.stringify(newLocalData) !== JSON.stringify(prev.originalData);
      
      return {
        ...prev,
        localData: newLocalData,
        isDirty,
        pendingUpdates: { ...prev.pendingUpdates, [field]: value },
        autoSyncStatus: 'syncing',
      };
    });

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Smart auto-sync with field-specific delays for better UX
    const getAutoSyncDelay = (fieldName: string): number => {
      // Immediate sync for visual properties (instant feedback)
      const instantFields = ['color', 'strokeWidth', 'opacity', 'visible', 'animated', 'strokeStyle'];
      if (instantFields.some(f => fieldName.toLowerCase().includes(f.toLowerCase()))) {
        return 0; // Immediate
      }
      
      // Fast sync for numeric properties
      const numericFields = ['width', 'height', 'fontSize', 'borderRadius', 'animationSpeed'];
      if (numericFields.some(f => fieldName.toLowerCase().includes(f.toLowerCase()))) {
        return 150; // Fast response
      }
      
      // Debounced for text fields (prevents excessive updates while typing)
      const textFields = ['label', 'description', 'title', 'notes', 'text'];
      if (textFields.some(f => fieldName.toLowerCase().includes(f.toLowerCase()))) {
        return 300; // Balanced for typing
      }
      
      // Default delay for other fields
      return 500;
    };

    const syncDelay = getAutoSyncDelay(field);
    
    // Enhanced auto-apply with smart delays
    timeoutRef.current = setTimeout(() => {
      // Auto-apply the changes after appropriate delay
      selectedItems.forEach(item => {
        const updates: Record<string, unknown> = {};
        
        // Skip system fields
        if (field === 'id' || field === 'type' || field === 'bulkEdit' || field === 'selectionCount') {
          return;
        }
        
        // Handle position updates separately
        if (field === 'positionX' || field === 'positionY') {
          if (onNodePositionUpdate && !('source' in item)) {
            const currentPos = (item as Node).position;
            const newPosition = {
              x: field === 'positionX' ? (value as number) : currentPos.x,
              y: field === 'positionY' ? (value as number) : currentPos.y,
            };
            onNodePositionUpdate(item.id, newPosition);
          }
          return;
        }
        
        // Skip core React Flow properties for data updates
        if (['source', 'target', 'sourceHandle', 'targetHandle'].includes(field)) {
          return;
        }
        
        // Only send data properties that are actually part of DiagramNodeData/DiagramEdgeData
        updates[field] = value;

        if (Object.keys(updates).length > 0) {
          onItemUpdate(item.id, updates);
        }
      });
      
      // Update sync status with proper cleanup
      setFormState(prev => ({
        ...prev,
        autoSyncStatus: 'synced',
        lastSyncTime: Date.now(),
        pendingUpdates: {}, // Clear pending updates immediately
        isDirty: false,     // Reset dirty flag
      }));
      
      // Reset to idle after brief display
      setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          autoSyncStatus: 'idle',
        }));
      }, 1500);
      
      // Also run validation
      validateField(field, value);
    }, syncDelay);
  }, [selectedItems, onItemUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (field.includes('width') || field.includes('height') || field === 'maxWidth' || field === 'fontSize' || field === 'lineHeight') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (value !== undefined && value !== '' && (typeof numValue !== 'number' || isNaN(numValue) || numValue < 0)) {
        errors.push({
          field,
          message: field === 'maxWidth' ? 'Max width must be a positive number' : 'Must be a positive number',
          type: 'range',
        });
      }
    }

    // Position validation
    if (field === 'positionX' || field === 'positionY') {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (value !== undefined && value !== '' && (typeof numValue !== 'number' || isNaN(numValue))) {
        errors.push({
          field,
          message: 'Position must be a valid number',
          type: 'invalid',
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

  // Apply changes to selected items with enhanced batching
  const applyChanges = useCallback(() => {
    if (!formState.isDirty) return;

    // Group updates by urgency for optimized processing
    const instantUpdates: Record<string, unknown> = {};
    const batchedUpdates: Record<string, unknown> = {};

    Object.keys(formState.pendingUpdates).forEach(field => {
      const value = formState.pendingUpdates[field];
      
      // Skip system fields
      if (field === 'id' || field === 'type' || field === 'bulkEdit' || field === 'selectionCount') {
        return;
      }
      
      // Handle position updates separately
      if (field === 'positionX' || field === 'positionY') {
        return; // Position handled separately
      }
      
      // Skip core React Flow properties for data updates
      if (['source', 'target', 'sourceHandle', 'targetHandle'].includes(field)) {
        return;
      }

      // Categorize updates for optimized processing
      const instantFields = ['color', 'strokeWidth', 'opacity', 'visible', 'animated', 'strokeStyle'];
      if (instantFields.some(f => field.toLowerCase().includes(f.toLowerCase()))) {
        instantUpdates[field] = value;
      } else {
        batchedUpdates[field] = value;
      }
    });

    selectedItems.forEach(item => {
      // Apply instant updates immediately
      if (Object.keys(instantUpdates).length > 0) {
        onItemUpdate(item.id, instantUpdates);
      }
      
      // Apply batched updates (if any)
      if (Object.keys(batchedUpdates).length > 0) {
        onItemUpdate(item.id, batchedUpdates);
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
    autoSyncStatus: formState.autoSyncStatus,
    lastSyncTime: formState.lastSyncTime,
    updateField,
    validateField,
    applyChanges,
    resetForm,
    previewChanges,
  };
};
