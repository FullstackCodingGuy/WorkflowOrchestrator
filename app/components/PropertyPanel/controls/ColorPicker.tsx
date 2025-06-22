'use client';

import React, { useState } from 'react';
import styles from '../PropertyPanel.module.css';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd',
  '#6c757d', '#495057', '#343a40', '#212529', '#000000',
  '#ff6b6b', '#ee5a52', '#ff8787', '#ffa8a8', '#ffc9c9',
  '#51cf66', '#40c057', '#69db7c', '#8ce99a', '#b2f2bb',
  '#339af0', '#228be6', '#74c0fc', '#a5d8ff', '#d0ebff',
  '#ffd43b', '#fab005', '#fff3bf', '#ffec99', '#ffe066',
  '#9775fa', '#845ef7', '#b197fc', '#d0bfff', '#e5dbff',
  '#ff8cc8', '#d6336c', '#faa2c1', '#fcc2d7', '#f8f0fc',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  presets = DEFAULT_PRESETS,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [customValue, setCustomValue] = useState(value);

  const handleColorChange = (newColor: string) => {
    setCustomValue(newColor);
    onChange(newColor);
  };

  const handlePresetSelect = (color: string) => {
    handleColorChange(color);
    setShowPicker(false);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomValue(newColor);
    onChange(newColor);
  };

  return (
    <div className={`${styles.colorPicker} ${disabled ? styles.disabled : ''}`}>
      {label && (
        <label className={styles.formLabel}>{label}</label>
      )}
      
      <div className={styles.colorPickerContainer}>
        {/* Current color display */}
        <button
          type="button"
          className={styles.colorPreview}
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
          disabled={disabled}
          title={`Current color: ${value}`}
        />
        
        {/* Color input */}
        <input
          type="text"
          className={styles.colorInput}
          value={customValue}
          onChange={handleCustomInput}
          placeholder="#ffffff"
          disabled={disabled}
        />
        
        {/* Native color picker */}
        <input
          type="color"
          className={styles.nativeColorPicker}
          value={value}
          onChange={handleCustomInput}
          disabled={disabled}
        />
      </div>
      
      {/* Color presets */}
      {showPicker && (
        <div className={styles.colorPresets}>
          <div className={styles.presetGrid}>
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorPreset} ${value === color ? styles.selected : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handlePresetSelect(color)}
                title={color}
              />
            ))}
          </div>
          
          <div className={styles.colorPickerActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.small} ${styles.secondary}`}
              onClick={() => setShowPicker(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
