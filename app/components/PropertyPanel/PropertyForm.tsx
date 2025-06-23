'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { PropertyPanelState } from './PropertyPanel';
import { PropertiesTab } from './tabs/PropertiesTab';
import { StyleTab } from './tabs/StyleTab';
import { SettingsTab } from './tabs/SettingsTab';
import { DiagramNodeData, DiagramEdgeData } from '../DiagramEditor';
import { usePropertyForm } from './hooks/usePropertyForm';
import styles from './PropertyPanel.module.css';

interface PropertyFormProps {
  state: PropertyPanelState;
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
  onNodePositionUpdate?: (nodeId: string, position: { x: number; y: number }) => void;
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  state,
  selectedItems,
  onItemUpdate,
  onNodePositionUpdate,
  onStateUpdate,
}) => {
  const {
    formData,
    isDirty,
    errors,
    autoSyncStatus,
    lastSyncTime,
    updateField,
    resetForm,
    applyChanges,
    previewChanges,
  } = usePropertyForm({
    selectedItems,
    onItemUpdate,
    onNodePositionUpdate,
  });

  const renderTabContent = () => {
    const commonProps = {
      selectedItems,
      formData,
      errors,
      isDirty,
      isCompactMode: state.isCompactMode,
      deviceType: state.deviceType,
      bulkEditMode: state.bulkEditMode,
      searchQuery: state.searchQuery,
      onFieldUpdate: updateField,
      onApplyChanges: applyChanges,
      onPreviewChanges: previewChanges,
      onResetForm: resetForm,
    };

    switch (state.activeTab) {
      case 'properties':
        return <PropertiesTab {...commonProps} />;
      
      case 'style':
        return <StyleTab {...commonProps} />;
      
      case 'settings':
        return <SettingsTab {...commonProps} />;
      
      default:
        return <PropertiesTab {...commonProps} />;
    }
  };

  return (
    <div className={`
      ${styles.propertyForm}
      ${state.isCompactMode ? styles.compact : ''}
      ${styles[state.deviceType]}
    `}>
      {/* Form content */}
      <div className={styles.formContent}>
        {renderTabContent()}
      </div>

      {/* Auto-sync status indicator */}
      {(autoSyncStatus !== 'idle' || isDirty) && (
        <div className={styles.syncStatus}>
          <div className={styles.syncIndicator}>
            {autoSyncStatus === 'syncing' && (
              <>
                <div className={styles.syncSpinner}></div>
                <span className={styles.syncText}>Auto-syncing...</span>
              </>
            )}
            {autoSyncStatus === 'synced' && (
              <>
                <div className={styles.syncCheck}>✓</div>
                <span className={styles.syncText}>Changes saved</span>
              </>
            )}
            {autoSyncStatus === 'idle' && isDirty && (
              <>
                <div className={styles.syncPending}>●</div>
                <span className={styles.syncText}>Changes pending</span>
              </>
            )}
          </div>
          {lastSyncTime && (
            <div className={styles.lastSync}>
              Last synced: {new Date(lastSyncTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Form actions */}
      {isDirty && state.deviceType !== 'mobile' && (
        <div className={styles.formActions}>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={resetForm}
            type="button"
          >
            Reset
          </button>
          
          <button
            className={`${styles.button} ${styles.primary}`}
            onClick={applyChanges}
            type="button"
          >
            Apply Changes
          </button>
        </div>
      )}

      {/* Mobile sticky actions */}
      {isDirty && state.deviceType === 'mobile' && (
        <div className={styles.stickyActions}>
          <button
            className={`${styles.button} ${styles.secondary} ${styles.small}`}
            onClick={resetForm}
            type="button"
          >
            Reset
          </button>
          
          <button
            className={`${styles.button} ${styles.primary} ${styles.small}`}
            onClick={applyChanges}
            type="button"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
