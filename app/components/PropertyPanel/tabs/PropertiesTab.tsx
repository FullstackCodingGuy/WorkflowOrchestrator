'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
import { EdgeValuesInput } from '../controls/EdgeValuesInput';
import { KeyValueInput } from '../controls/KeyValueInput';
import styles from '../PropertyPanel.module.css';

interface PropertiesTabProps {
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  formData: Record<string, unknown>;
  errors: Record<string, ValidationError | undefined>;
  isDirty: boolean;
  isCompactMode: boolean;
  deviceType: DeviceType;
  bulkEditMode: boolean;
  searchQuery: string;
  onFieldUpdate: (field: string, value: unknown) => void;
  onApplyChanges: () => void;
  onPreviewChanges: () => void;
  onResetForm: () => void;
}

// Custom Tag Configuration Control
const TagInput: React.FC<{
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}> = ({ tags, onChange, placeholder = 'Add tag...' }) => {
  const [input, setInput] = React.useState('');
  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };
  const handleRemove = (idx: number) => {
    const newTags = tags.filter((_, i) => i !== idx);
    onChange(newTags);
  };
  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Tags</label>
      <div className={styles.edgeValuesList}>
        {tags.map((tag, idx) => (
          <span key={tag + idx} className={styles.edgeValueItem}>
            {tag}
            <button
              type="button"
              className={styles.removeValueBtn}
              onClick={() => handleRemove(idx)}
              aria-label={`Remove ${tag}`}
            >×</button>
          </span>
        ))}
      </div>
      <div className={styles.edgeValueInputRow}>
        <input
          type="text"
          className={styles.formInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className={styles.addValueBtn}
          onClick={handleAdd}
          disabled={!input.trim()}
        >Add</button>
      </div>
    </div>
  );
};

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  selectedItems,
  formData,
  errors,
  isCompactMode,
  onFieldUpdate,
}) => {
  const hasSelection = selectedItems.length > 0;
  const isNode = hasSelection && !('source' in selectedItems[0]);
  const isEdge = hasSelection && ('source' in selectedItems[0]);

  if (!hasSelection) {
    return (
      <div className={`${styles.tabContent} ${styles.propertiesTab} ${styles.emptyStateContainer}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="15" y2="9"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 className={styles.emptyStateTitle}>No Selection</h3>
          <p className={styles.emptyStateMessage}>
            Select a node or edge to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tabContent} ${styles.propertiesTab} ${styles.scrollablePanel}`}> 
      <div className={styles.sectionHeader}>
        <span className={styles.sectionType}>{(formData.type as string) || 'Unknown'}</span>
        <span className={styles.sectionId}>ID: {formData.id as string}</span>
        {selectedItems.length > 1 && (
          <span className={styles.bulkEditBadge}>Bulk Edit ({selectedItems.length})</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Label</label>
        <input
          type="text"
          className={styles.formInput}
          value={(formData.label as string) || ''}
          onChange={(e) => onFieldUpdate('label', e.target.value)}
          placeholder={`Enter ${isNode ? 'node' : 'edge'} label`}
        />
        {errors.label && (
          <span className={styles.errorMessage}>{errors.label.message}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <textarea
          className={styles.formTextarea}
          value={(formData.description as string) || ''}
          onChange={(e) => onFieldUpdate('description', e.target.value)}
          placeholder={`Describe this ${isNode ? 'node' : 'edge'}...`}
          rows={3}
        />
        {errors.description && (
          <span className={styles.errorMessage}>{errors.description.message}</span>
        )}
      </div>
      {isNode && (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Icon</label>
          <input
            type="text"
            className={styles.formInput}
            value={(formData.icon as string) || ''}
            onChange={(e) => onFieldUpdate('icon', e.target.value)}
            placeholder="🚀"
            maxLength={2}
          />
          <span className={styles.helpText}>Emoji or single character</span>
        </div>
      )}
      {isNode && (
        <>
          <div className={styles.inlineFields}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>X</label>
              <input
                type="number"
                className={styles.formInput}
                value={(formData.positionX as number) || 0}
                onChange={(e) => onFieldUpdate('positionX', parseFloat(e.target.value))}
                step="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Y</label>
              <input
                type="number"
                className={styles.formInput}
                value={(formData.positionY as number) || 0}
                onChange={(e) => onFieldUpdate('positionY', parseFloat(e.target.value))}
                step="1"
              />
            </div>
          </div>
          <KeyValueInput
            label="Custom Properties"
            properties={
              typeof formData.properties === 'object' && formData.properties !== null
                ? (formData.properties as Record<string, unknown>)
                : {}
            }
            onChange={(properties) => onFieldUpdate('properties', properties)}
            placeholder={{ key: 'Property name...', value: 'Property value...' }}
          />
        </>
      )}
      {isEdge && (
        <>
          <div className={styles.connectionInfoRow}>
            <div className={styles.connectionItem}><span>Source:</span> <span>{String(formData.source)}</span></div>
            <div className={styles.connectionItem}><span>Target:</span> <span>{String(formData.target)}</span></div>
          </div>
          <EdgeValuesInput
            label="Custom Values"
            values={Array.isArray(formData.values) ? (formData.values as string[]) : []}
            onChange={(vals) => onFieldUpdate('values', vals)}
            placeholder="Add value for edge..."
          />
          <TagInput
            tags={Array.isArray(formData.tags) ? (formData.tags as string[]) : []}
            onChange={(tags) => onFieldUpdate('tags', tags)}
            placeholder="Add tag for edge..."
          />
        </>
      )}
    </div>
  );
};
