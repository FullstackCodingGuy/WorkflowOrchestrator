'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { LabelInput } from '../controls/LabelInput';
import { PropertyGroup } from '../controls/PropertyGroup';
import styles from '../PropertyPanel.module.css';

interface OverviewTabProps {
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  formData: Record<string, unknown>;
  errors: Record<string, ValidationError | undefined>;
  isCompactMode: boolean;
  searchQuery: string;
  onFieldUpdate: (field: string, value: unknown) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  selectedItems,
  formData,
  errors,
  isCompactMode,
  searchQuery,
  onFieldUpdate,
}) => {
  const renderSingleItem = (item: Node<DiagramNodeData> | Edge<DiagramEdgeData>) => {
    const isEdge = 'source' in item;
    
    return (
      <div key={item.id} className={styles.itemSection}>
        <PropertyGroup
          title={isEdge ? 'Edge Properties' : 'Node Properties'}
          isCompact={isCompactMode}
          defaultExpanded={true}
        >
          {/* ID (read-only) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>ID</label>
            <input
              type="text"
              value={item.id}
              readOnly
              className={`${styles.formInput} ${styles.readonly}`}
            />
          </div>

          {/* Type (read-only) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Type</label>
            <input
              type="text"
              value={item.type || 'default'}
              readOnly
              className={`${styles.formInput} ${styles.readonly}`}
            />
          </div>

          {/* Label */}
          <div className={styles.formGroup}>
            <LabelInput
              label="Label"
              value={(formData.label as string) || ''}
              error={errors.label}
              onChange={(value: string) => onFieldUpdate('label', value)}
              placeholder={isEdge ? 'Edge label' : 'Node label'}
              isCompact={isCompactMode}
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formInput}
              value={(formData.description as string) || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder={isEdge ? 'Edge description' : 'Node description'}
              rows={isCompactMode ? 2 : 3}
            />
          </div>

          {/* Edge-specific properties */}
          {isEdge && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Source</label>
                <input
                  type="text"
                  value={item.source}
                  readOnly
                  className={`${styles.formInput} ${styles.readonly}`}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target</label>
                <input
                  type="text"
                  value={item.target}
                  readOnly
                  className={`${styles.formInput} ${styles.readonly}`}
                />
              </div>

              {item.sourceHandle && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Source Handle</label>
                  <input
                    type="text"
                    value={item.sourceHandle}
                    readOnly
                    className={`${styles.formInput} ${styles.readonly}`}
                  />
                </div>
              )}

              {item.targetHandle && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Target Handle</label>
                  <input
                    type="text"
                    value={item.targetHandle}
                    readOnly
                    className={`${styles.formInput} ${styles.readonly}`}
                  />
                </div>
              )}
            </>
          )}

          {/* Node-specific properties */}
          {!isEdge && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Position</label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    value={Math.round(item.position?.x || 0)}
                    onChange={(e) => onFieldUpdate('position', { 
                      ...item.position, 
                      x: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="X"
                    className={styles.formInput}
                  />
                  <input
                    type="number"
                    value={Math.round(item.position?.y || 0)}
                    onChange={(e) => onFieldUpdate('position', { 
                      ...item.position, 
                      y: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="Y"
                    className={styles.formInput}
                  />
                </div>
              </div>

              {(item.width || item.height) && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Size</label>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      value={Math.round(item.width || 0)}
                      onChange={(e) => onFieldUpdate('width', parseFloat(e.target.value) || 0)}
                      placeholder="Width"
                      className={styles.formInput}
                      min="0"
                    />
                    <input
                      type="number"
                      value={Math.round(item.height || 0)}
                      onChange={(e) => onFieldUpdate('height', parseFloat(e.target.value) || 0)}
                      placeholder="Height"
                      className={styles.formInput}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </PropertyGroup>
      </div>
    );
  };

  const renderMultipleItems = () => {
    const nodeCount = selectedItems.filter(item => !('source' in item)).length;
    const edgeCount = selectedItems.filter(item => 'source' in item).length;

    return (
      <div className={styles.multiSelection}>
        <PropertyGroup
          title="Multi-Selection Overview"
          isCompact={isCompactMode}
          defaultExpanded={true}
        >
          <div className={styles.selectionSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Items:</span>
              <span className={styles.summaryValue}>{selectedItems.length}</span>
            </div>
            
            {nodeCount > 0 && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Nodes:</span>
                <span className={styles.summaryValue}>{nodeCount}</span>
              </div>
            )}
            
            {edgeCount > 0 && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Edges:</span>
                <span className={styles.summaryValue}>{edgeCount}</span>
              </div>
            )}
          </div>

          {/* Common properties for multi-selection */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Bulk Label Update
              <span className={styles.fieldHint}>
                (Will apply to all selected items)
              </span>
            </label>
            <LabelInput
              value={(formData.label as string) || ''}
              error={errors.label}
              onChange={(value: string) => onFieldUpdate('label', value)}
              placeholder="Enter new label for all items"
              isCompact={isCompactMode}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Bulk Description Update
              <span className={styles.fieldHint}>
                (Will apply to all selected items)
              </span>
            </label>
            <textarea
              className={styles.formInput}
              value={(formData.description as string) || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder="Enter new description for all items"
              rows={isCompactMode ? 2 : 3}
            />
          </div>
        </PropertyGroup>

        {/* Show individual items list */}
        <PropertyGroup
          title="Selected Items"
          isCompact={isCompactMode}
          defaultExpanded={false}
        >
          <div className={styles.itemsList}>
            {selectedItems.map(item => (
              <div key={item.id} className={styles.itemSummary}>
                <div className={styles.itemIcon}>
                  {'source' in item ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="4" y="4" width="16" height="16" rx="2"/>
                    </svg>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>
                    {(item.data as Record<string, unknown>)?.label as string || item.id}
                  </span>
                  <span className={styles.itemType}>
                    {item.type || ('source' in item ? 'edge' : 'node')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PropertyGroup>
      </div>
    );
  };

  // Filter by search query if provided
  const shouldShow = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Don't show if filtered out by search
  if (searchQuery && !shouldShow('overview label description')) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <div className={styles.emptyStateTitle}>No matching properties</div>
        <div className={styles.emptyStateDescription}>
          Try adjusting your search terms
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tabContent} ${styles.overviewTab}`}>
      {selectedItems.length === 1 
        ? renderSingleItem(selectedItems[0])
        : renderMultipleItems()
      }
    </div>
  );
};
