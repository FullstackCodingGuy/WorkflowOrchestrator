'use client';

import React from 'react';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { PropertyPanelState } from '../PropertyPanel';
import { ColorPicker } from '../controls/ColorPicker';
import { NumberInput } from '../controls/NumberInput';
import styles from '../PropertyPanel.module.css';

interface StyleTabProps {
  state: PropertyPanelState;
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
}

export const StyleTab: React.FC<StyleTabProps> = ({
  state,
  onItemUpdate,
}) => {
  const { selectedItems } = state;
  const hasSelection = selectedItems.length > 0;
  const isNode = hasSelection && 'position' in selectedItems[0];
  const isEdge = hasSelection && 'source' in selectedItems[0];
  const item = selectedItems[0];
  const data = item?.data as DiagramNodeData | DiagramEdgeData;

  const handleFieldUpdate = (field: string, value: unknown) => {
    onItemUpdate(item.id, { [field]: value });
  };

  if (!hasSelection) {
    return (
      <div className={`${styles.tabContent} ${styles.styleTab} ${styles.emptyStateContainer}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h3 className={styles.emptyStateTitle}>No Selection</h3>
          <p className={styles.emptyStateMessage}>
            Select a node or edge to view and edit its style properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tabContent} ${styles.styleTab} ${styles.scrollablePanel}`}> 
      {/* Color Controls */}
      <div className={styles.formGroup}>
        <ColorPicker
          label={isEdge ? 'Edge Color' : 'Primary Color'}
          value={(data.color as string) || '#6366f1'}
          onChange={(color: string) => handleFieldUpdate('color', color)}
        />
      </div>
      {isNode && (
        <>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Background"
              value={(data as DiagramNodeData).backgroundColor || '#f8fafc'}
              onChange={(color: string) => handleFieldUpdate('backgroundColor', color)}
            />
          </div>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Border"
              value={(data as DiagramNodeData).borderColor || '#e2e8f0'}
              onChange={(color: string) => handleFieldUpdate('borderColor', color)}
            />
          </div>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Text Color"
              value={(data as DiagramNodeData).textColor || '#334155'}
              onChange={(color: string) => handleFieldUpdate('textColor', color)}
            />
          </div>
          <NumberInput
            label="Max Width"
            value={(data as DiagramNodeData).maxWidth || 200}
            onChange={(value) => handleFieldUpdate('maxWidth', value)}
            min={50}
            max={1000}
            unit="px"
          />
        </>
      )}
      {isEdge && (
        <div className={styles.inlineFields}>
          <NumberInput
            label="Width"
            value={(data as DiagramEdgeData).strokeWidth || 2}
            onChange={(value) => handleFieldUpdate('strokeWidth', value)}
            min={1}
            max={10}
          />
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Style</label>
            <select
              className={styles.formInput}
              value={(data as DiagramEdgeData).strokeStyle || 'solid'}
              onChange={(e) => handleFieldUpdate('strokeStyle', e.target.value)}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Typography Controls */}
      <div className={styles.inlineFields}>
        <NumberInput
          label="Font Size"
          value={data.fontSize || 14}
          onChange={(value) => handleFieldUpdate('fontSize', value)}
          min={8}
          max={72}
          unit="px"
        />
        <NumberInput
          label="Line Height"
          value={(data as DiagramNodeData).lineHeight || 1.5}
          onChange={(value) => handleFieldUpdate('lineHeight', value)}
          min={0.8}
          max={3}
          step={0.1}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Font Family</label>
        <select
          className={styles.formInput}
          value={data.fontFamily || 'Arial, sans-serif'}
          onChange={(e) => handleFieldUpdate('fontFamily', e.target.value)}
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>
      </div>
      <div className={styles.inlineFields}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Weight</label>
          <select
            className={styles.formInput}
            value={data.fontWeight || 'normal'}
            onChange={(e) => handleFieldUpdate('fontWeight', e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="bolder">Bolder</option>
            <option value="100">100</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="900">900</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Align</label>
          <select
            className={styles.formInput}
            value={data.textAlign || 'left'}
            onChange={(e) => handleFieldUpdate('textAlign', e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
          </select>
        </div>
      </div>
    </div>
  );
};
