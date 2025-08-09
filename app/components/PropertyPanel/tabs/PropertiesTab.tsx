'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { PropertyPanelState } from '../PropertyPanel';
import { EdgeValuesInput } from '../controls/EdgeValuesInput';
import { KeyValueInput } from '../controls/KeyValueInput';
import { NumberInput } from '../controls/NumberInput';
import styles from '../PropertyPanel.module.css';

interface PropertiesTabProps {
  state: PropertyPanelState;
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
  onNodePositionUpdate: (nodeId: string, position: { x: number; y: number }) => void;
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
  state,
  onItemUpdate,
  onNodePositionUpdate,
}) => {
  const { selectedItems } = state;
  const hasSelection = selectedItems.length > 0;
  
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

  const item = selectedItems[0];
  const isNode = 'position' in item;
  const isEdge = 'source' in item;
  const data = item.data as DiagramNodeData | DiagramEdgeData;

  const handleFieldUpdate = (field: string, value: unknown) => {
    onItemUpdate(item.id, { [field]: value });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (isNode) {
      const node = item as Node<DiagramNodeData>;
      const newPosition = { ...node.position, [axis]: value };
      onNodePositionUpdate(node.id, newPosition);
    }
  };

  return (
    <div className={`${styles.tabContent} ${styles.propertiesTab} ${styles.scrollablePanel}`}> 
      <div className={styles.sectionHeader}>
        <span className={styles.sectionType}>{isNode ? (item as Node).type : 'Edge'}</span>
        <span className={styles.sectionId}>ID: {item.id}</span>
        {selectedItems.length > 1 && (
          <span className={styles.bulkEditBadge}>Bulk Edit ({selectedItems.length})</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Label</label>
        <input
          type="text"
          className={styles.formInput}
          value={data.label || ''}
          onChange={(e) => handleFieldUpdate('label', e.target.value)}
          placeholder={`Enter ${isNode ? 'node' : 'edge'} label`}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Description</label>
        <textarea
          className={styles.formTextarea}
          value={data.description || ''}
          onChange={(e) => handleFieldUpdate('description', e.target.value)}
          placeholder={`Describe this ${isNode ? 'node' : 'edge'}...`}
          rows={3}
        />
      </div>
      {isNode && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Icon</label>
            <input
              type="text"
              className={styles.formInput}
              value={(data as DiagramNodeData).icon || ''}
              onChange={(e) => handleFieldUpdate('icon', e.target.value)}
              placeholder="🚀"
              maxLength={2}
            />
            <span className={styles.helpText}>Emoji or single character</span>
          </div>
          <div className={styles.inlineFields}>
            <NumberInput
              label="X"
              value={(item as Node).position.x}
              onChange={(value) => handlePositionChange('x', value)}
              step={1}
            />
            <NumberInput
              label="Y"
              value={(item as Node).position.y}
              onChange={(value) => handlePositionChange('y', value)}
              step={1}
            />
          </div>
          <KeyValueInput
            label="Custom Properties"
            properties={(data as DiagramNodeData).properties || {}}
            onChange={(properties) => handleFieldUpdate('properties', properties)}
            placeholder={{ key: 'Property name...', value: 'Property value...' }}
          />
        </>
      )}
      {isEdge && (
        <>
          <div className={styles.connectionInfoRow}>
            <div className={styles.connectionItem}><span>Source:</span> <span>{String((item as Edge).source)}</span></div>
            <div className={styles.connectionItem}><span>Target:</span> <span>{String((item as Edge).target)}</span></div>
          </div>
          <EdgeValuesInput
            label="Custom Values"
            values={(data as DiagramEdgeData).values || []}
            onChange={(vals) => handleFieldUpdate('values', vals)}
            placeholder="Add value for edge..."
          />
          <TagInput
            tags={(data as DiagramEdgeData).tags || []}
            onChange={(tags) => handleFieldUpdate('tags', tags)}
            placeholder="Add tag for edge..."
          />
        </>
      )}
    </div>
  );
};
