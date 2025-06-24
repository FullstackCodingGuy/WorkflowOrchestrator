import React, { useState } from 'react';
import styles from '../PropertyPanel.module.css';

interface EdgeValuesInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const EdgeValuesInput: React.FC<EdgeValuesInputProps> = ({
  label = 'Edge Values',
  values,
  onChange,
  placeholder = 'Add value...',
  disabled = false,
}) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInput('');
    }
  };

  const handleRemove = (idx: number) => {
    const newValues = values.filter((_, i) => i !== idx);
    onChange(newValues);
  };

  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.formLabel}>{label}</label>}
      <div className={styles.edgeValuesList}>
        {values.map((val, idx) => (
          <span key={val + idx} className={styles.edgeValueItem}>
            {val}
            {!disabled && (
              <button
                type="button"
                className={styles.removeValueBtn}
                onClick={() => handleRemove(idx)}
                aria-label={`Remove ${val}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      <div className={styles.edgeValueInputRow}>
        <input
          type="text"
          className={styles.formInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className={styles.addValueBtn}
          onClick={handleAdd}
          disabled={disabled || !input.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
};
