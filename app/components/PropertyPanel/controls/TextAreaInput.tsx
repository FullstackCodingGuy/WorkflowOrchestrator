'use client';

import React from 'react';
import styles from '../PropertyPanel.module.css';

interface TextAreaInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  value,
  onChange,
  rows = 3,
  disabled = false,
  placeholder = 'Enter text...',
  maxLength,
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.formLabel}>{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${styles.formInput} ${disabled ? styles.disabled : ''}`}
      />
      {maxLength && (
        <div className={styles.charCount}>
          <span className={value.length > maxLength * 0.8 ? styles.warning : ''}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};
