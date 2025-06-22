'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
import { PropertyGroup } from '../controls/PropertyGroup';
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

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  formData,
  isCompactMode,
  onFieldUpdate,
}) => {
  return (
    <div className={`${styles.tabContent} ${styles.propertiesTab}`}>
      <PropertyGroup
        title="Custom Properties"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Custom Data</label>
          <textarea
            className={styles.formInput}
            value={JSON.stringify(formData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onFieldUpdate('customData', parsed);
              } catch {
                // Invalid JSON, keep as string for now
              }
            }}
            rows={isCompactMode ? 8 : 12}
            placeholder="Enter custom properties as JSON..."
          />
        </div>
      </PropertyGroup>
    </div>
  );
};
