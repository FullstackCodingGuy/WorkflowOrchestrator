'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType, PropertyPanelState } from '../PropertyPanel';
import { PropertyGroup } from '../controls/PropertyGroup';
import styles from '../PropertyPanel.module.css';

interface DiagramTabProps {
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
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
}

export const DiagramTab: React.FC<DiagramTabProps> = ({
  formData,
  isCompactMode,
  onFieldUpdate,
  onStateUpdate,
}) => {
  return (
    <div className={`${styles.tabContent} ${styles.diagramTab}`}>
      <PropertyGroup
        title="Diagram Settings"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Diagram Title</label>
          <input
            type="text"
            className={styles.formInput}
            value={(formData.diagramTitle as string) || ''}
            onChange={(e) => onFieldUpdate('diagramTitle', e.target.value)}
            placeholder="Enter diagram title"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Diagram Description</label>
          <textarea
            className={styles.formInput}
            value={(formData.diagramDescription as string) || ''}
            onChange={(e) => onFieldUpdate('diagramDescription', e.target.value)}
            placeholder="Enter diagram description"
            rows={isCompactMode ? 3 : 4}
          />
        </div>
      </PropertyGroup>
      
      <PropertyGroup
        title="Display Options"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={(formData.showGrid as boolean) || false}
              onChange={(e) => onFieldUpdate('showGrid', e.target.checked)}
            />
            <span>Show Grid</span>
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={(formData.showMinimap as boolean) || false}
              onChange={(e) => onFieldUpdate('showMinimap', e.target.checked)}
            />
            <span>Show Minimap</span>
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={(formData.snapToGrid as boolean) || false}
              onChange={(e) => onFieldUpdate('snapToGrid', e.target.checked)}
            />
            <span>Snap to Grid</span>
          </label>
        </div>
      </PropertyGroup>
      
      <PropertyGroup
        title="Panel Settings"
        isCompact={isCompactMode}
        defaultExpanded={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={!isCompactMode}
              onChange={(e) => onStateUpdate({ isCompactMode: !e.target.checked })}
            />
            <span>Extended Mode</span>
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Panel Width</label>
          <input
            type="range"
            min="320"
            max="600"
            value={(formData.panelWidth as number) || 384}
            onChange={(e) => onStateUpdate({ width: parseInt(e.target.value) })}
            className={styles.rangeInput}
          />
          <span className={styles.rangeValue}>{(formData.panelWidth as number) || 384}px</span>
        </div>
      </PropertyGroup>
    </div>
  );
};
