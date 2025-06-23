'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import { DiagramNodeData, DiagramEdgeData } from '../../DiagramEditor';
import { ValidationError } from '../hooks/usePropertyForm';
import { DeviceType } from '../PropertyPanel';
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
  selectedItems,
  formData,
  errors,
  onFieldUpdate,
}) => {
  const isNode = selectedItems.length > 0 && !('source' in selectedItems[0]);
  const isEdge = selectedItems.length > 0 && ('source' in selectedItems[0]);

  return (
    <div className={`${styles.tabContent} ${styles.styleTab} ${styles.scrollablePanel}`}> 
      {/* Color Controls */}
      <div className={styles.formGroup}>
        <ColorPicker
          label={isEdge ? 'Edge Color' : 'Primary Color'}
          value={(formData.color as string) || '#6366f1'}
          onChange={(color: string) => onFieldUpdate('color', color)}
          error={errors.color?.message}
        />
      </div>
      {isNode && (
        <>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Background"
              value={(formData.backgroundColor as string) || '#f8fafc'}
              onChange={(color: string) => onFieldUpdate('backgroundColor', color)}
              error={errors.backgroundColor?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Border"
              value={(formData.borderColor as string) || '#e2e8f0'}
              onChange={(color: string) => onFieldUpdate('borderColor', color)}
              error={errors.borderColor?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <ColorPicker
              label="Text Color"
              value={(formData.textColor as string) || '#334155'}
              onChange={(color: string) => onFieldUpdate('textColor', color)}
              error={errors.textColor?.message}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Max Width</label>
            <input
              type="number"
              className={styles.formInput}
              value={(formData.maxWidth as number) || 200}
              onChange={(e) => onFieldUpdate('maxWidth', parseInt(e.target.value))}
              min="50"
              max="1000"
              placeholder="Max width in pixels"
            />
            {errors.maxWidth && (
              <span className={styles.errorMessage}>{errors.maxWidth.message}</span>
            )}
          </div>
        </>
      )}
      {isEdge && (
        <div className={styles.inlineFields}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Width</label>
            <input
              type="number"
              className={styles.formInput}
              value={(formData.strokeWidth as number) || 2}
              onChange={(e) => onFieldUpdate('strokeWidth', parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Style</label>
            <select
              className={styles.formInput}
              value={(formData.strokeStyle as string) || 'solid'}
              onChange={(e) => onFieldUpdate('strokeStyle', e.target.value)}
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
          {errors.fontSize && (
            <span className={styles.errorMessage}>{errors.fontSize.message}</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Line Height</label>
          <input
            type="number"
            className={styles.formInput}
            value={(formData.lineHeight as number) || 1.5}
            onChange={(e) => onFieldUpdate('lineHeight', parseFloat(e.target.value))}
            min="0.8"
            max="3"
            step="0.1"
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Font Family</label>
        <select
          className={styles.formInput}
          value={(formData.fontFamily as string) || 'Arial, sans-serif'}
          onChange={(e) => onFieldUpdate('fontFamily', e.target.value)}
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
            value={(formData.fontWeight as string) || 'normal'}
            onChange={(e) => onFieldUpdate('fontWeight', e.target.value)}
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
            value={(formData.textAlign as string) || 'left'}
            onChange={(e) => onFieldUpdate('textAlign', e.target.value)}
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
