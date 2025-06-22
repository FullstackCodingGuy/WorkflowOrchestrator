'use client';

import React from 'react';
import styles from '../PropertyPanel.module.css';

interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select an option...',
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.formLabel}>{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${styles.formInput} ${disabled ? styles.disabled : ''}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
