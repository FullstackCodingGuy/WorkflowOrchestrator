import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
import styles from '../PropertyPanel.module.css';

interface SettingsTabProps {
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

export const SettingsTab: React.FC<SettingsTabProps> = ({
  selectedItems,
  formData,
  onFieldUpdate,
}) => {
  const hasSelection = selectedItems.length > 0;

  return (
    <div className={`${styles.tabContent} ${styles.settingsTab} ${styles.scrollablePanel}`}>
      {/* Element Behavior */}
      <div className={styles.inlineFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.draggable as boolean) ?? true}
              onChange={(e) => onFieldUpdate('draggable', e.target.checked)}
              disabled={!hasSelection}
            />
            Draggable
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.selectable as boolean) ?? true}
              onChange={(e) => onFieldUpdate('selectable', e.target.checked)}
              disabled={!hasSelection}
            />
            Selectable
          </label>
        </div>
      </div>
      <div className={styles.inlineFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.deletable as boolean) ?? true}
              onChange={(e) => onFieldUpdate('deletable', e.target.checked)}
              disabled={!hasSelection}
            />
            Deletable
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Z-Index</label>
          <input
            type="number"
            className={styles.formInput}
            value={(formData.zIndex as number) || 0}
            onChange={(e) => onFieldUpdate('zIndex', parseInt(e.target.value))}
            disabled={!hasSelection}
            min={0}
            max={1000}
          />
        </div>
      </div>
      
      {/* Grid & Alignment */}
      <div className={styles.inlineFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.snapToGrid as boolean) ?? false}
              onChange={(e) => onFieldUpdate('snapToGrid', e.target.checked)}
            />
            Snap to Grid
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Grid Size</label>
          <input
            type="number"
            className={styles.formInput}
            value={(formData.gridSize as number) || 20}
            onChange={(e) => onFieldUpdate('gridSize', parseInt(e.target.value))}
            min={10}
            max={100}
            step={5}
          />
        </div>
      </div>
      
      {/* Display Options */}
      <div className={styles.inlineFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.showMinimap as boolean) ?? true}
              onChange={(e) => onFieldUpdate('showMinimap', e.target.checked)}
            />
            Show Minimap
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              className={styles.formCheckbox}
              checked={(formData.showControls as boolean) ?? true}
              onChange={(e) => onFieldUpdate('showControls', e.target.checked)}
            />
            Show Controls
          </label>
        </div>
      </div>
    </div>
  );
};
