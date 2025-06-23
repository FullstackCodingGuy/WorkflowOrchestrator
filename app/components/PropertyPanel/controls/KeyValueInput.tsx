'use client';

import React from 'react';
import styles from '../PropertyPanel.module.css';

interface KeyValueInputProps {
  label: string;
  properties: Record<string, unknown>;
  onChange: (properties: Record<string, unknown>) => void;
  placeholder?: { key: string; value: string };
}

export const KeyValueInput: React.FC<KeyValueInputProps> = ({
  label,
  properties,
  onChange,
  placeholder = { key: 'Enter property name...', value: 'Enter property value...' }
}) => {
  const [newKey, setNewKey] = React.useState('');
  const [newValue, setNewValue] = React.useState('');

  const handleAdd = () => {
    const trimmedKey = newKey.trim();
    const trimmedValue = newValue.trim();
    
    if (trimmedKey && trimmedValue && !(trimmedKey in properties)) {
      const updatedProperties = { ...properties, [trimmedKey]: trimmedValue };
      onChange(updatedProperties);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleUpdate = (key: string, value: string) => {
    const updatedProperties = { ...properties, [key]: value };
    onChange(updatedProperties);
  };

  const handleRemove = (key: string) => {
    const updatedProperties = { ...properties };
    delete updatedProperties[key];
    onChange(updatedProperties);
  };

  const handleKeyUpdate = (oldKey: string, newKey: string) => {
    if (newKey.trim() === oldKey || !newKey.trim()) return;
    
    const updatedProperties = { ...properties };
    const value = updatedProperties[oldKey];
    delete updatedProperties[oldKey];
    updatedProperties[newKey.trim()] = value;
    onChange(updatedProperties);
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      
      {/* Existing Properties */}
      {Object.entries(properties).length > 0 && (
        <div className={styles.keyValueList}>
          {Object.entries(properties).map(([key, value]) => (
            <div key={key} className={styles.keyValueItem}>
              <input
                type="text"
                className={styles.keyInput}
                value={key}
                onChange={(e) => handleKeyUpdate(key, e.target.value)}
                onBlur={(e) => {
                  const newKey = e.target.value.trim();
                  if (newKey !== key && newKey) {
                    handleKeyUpdate(key, newKey);
                  }
                }}
                placeholder="Key"
              />
              <input
                type="text"
                className={styles.valueInput}
                value={String(value)}
                onChange={(e) => handleUpdate(key, e.target.value)}
                placeholder="Value"
              />
              <button
                type="button"
                className={styles.removeValueBtn}
                onClick={() => handleRemove(key)}
                aria-label={`Remove ${key}`}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Property */}
      <div className={styles.keyValueInputRow}>
        <input
          type="text"
          className={styles.keyInput}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder={placeholder.key}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newKey.trim() && newValue.trim()) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <input
          type="text"
          className={styles.valueInput}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder.value}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newKey.trim() && newValue.trim()) {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className={styles.addValueBtn}
          onClick={handleAdd}
          disabled={!newKey.trim() || !newValue.trim()}
        >Add</button>
      </div>
    </div>
  );
};
