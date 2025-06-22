'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
import { PropertyGroup } from '../controls/PropertyGroup';
import { ColorPicker } from '../controls/ColorPicker';
import styles from '../PropertyPanel.module.css';

interface StyleTabProps {
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

export const StyleTab: React.FC<StyleTabProps> = ({
  formData,
  isCompactMode,
  onFieldUpdate,
}) => {
  return (
    <div className={`${styles.tabContent} ${styles.styleTab}`}>
      <PropertyGroup
        title="Colors"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <ColorPicker
            label="Background Color"
            value={(formData.backgroundColor as string) || '#ffffff'}
            onChange={(color: string) => onFieldUpdate('backgroundColor', color)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <ColorPicker
            label="Border Color"
            value={(formData.borderColor as string) || '#cccccc'}
            onChange={(color: string) => onFieldUpdate('borderColor', color)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <ColorPicker
            label="Text Color"
            value={(formData.textColor as string) || '#000000'}
            onChange={(color: string) => onFieldUpdate('textColor', color)}
          />
        </div>
      </PropertyGroup>
      
      <PropertyGroup
        title="Typography"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Font Size</label>
          <input
            type="number"
            className={styles.formInput}
            value={(formData.fontSize as number) || 14}
            onChange={(e) => onFieldUpdate('fontSize', parseInt(e.target.value))}
            min="8"
            max="72"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Font Weight</label>
          <select
            className={styles.formInput}
            value={(formData.fontWeight as string) || 'normal'}
            onChange={(e) => onFieldUpdate('fontWeight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
          </select>
        </div>
      </PropertyGroup>
    </div>
  );
};
