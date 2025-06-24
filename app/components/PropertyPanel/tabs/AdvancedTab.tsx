'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
import { PropertyGroup } from '../controls/PropertyGroup';
import styles from '../PropertyPanel.module.css';

interface AdvancedTabProps {
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

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  formData,
  isCompactMode,
  onFieldUpdate,
}) => {
  return (
    <div className={`${styles.tabContent} ${styles.advancedTab}`}>
      <PropertyGroup
        title="Position & Layout"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Z-Index</label>
          <input
            type="number"
            className={styles.formInput}
            value={(formData.zIndex as number) || 0}
            onChange={(e) => onFieldUpdate('zIndex', parseInt(e.target.value))}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Visibility</label>
          <select
            className={styles.formInput}
            value={formData.hidden ? 'hidden' : 'visible'}
            onChange={(e) => onFieldUpdate('hidden', e.target.value === 'hidden')}
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </PropertyGroup>
      
      <PropertyGroup
        title="Metadata"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tags</label>
          <input
            type="text"
            className={styles.formInput}
            value={(formData.tags as string) || ''}
            onChange={(e) => onFieldUpdate('tags', e.target.value)}
            placeholder="Enter tags separated by commas"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Created</label>
          <input
            type="text"
            className={`${styles.formInput} ${styles.readonly}`}
            value={(formData.createdAt as string) || 'N/A'}
            readOnly
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Modified</label>
          <input
            type="text"
            className={`${styles.formInput} ${styles.readonly}`}
            value={(formData.modifiedAt as string) || 'N/A'}
            readOnly
          />
        </div>
      </PropertyGroup>
    </div>
  );
};
