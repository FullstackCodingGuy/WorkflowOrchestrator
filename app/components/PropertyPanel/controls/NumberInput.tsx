'use client';

import React from 'react';
import styles from '../PropertyPanel.module.css';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  icon,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      <div className={styles.inputContainer}>
        {icon && <div className={styles.inputIcon}>{icon}</div>}
        <input
          type="number"
          className={styles.formInput}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
        />
        {unit && <div className={styles.inputUnit}>{unit}</div>}
      </div>
    </div>
  );
};
