'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ValidationError } from '../hooks/usePropertyForm';
import styles from '../PropertyPanel.module.css';

interface LabelInputProps {
  label?: string;
  value: string;
  error?: ValidationError | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  isCompact?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

export const LabelInput: React.FC<LabelInputProps> = ({
  label,
  value,
  error,
  onChange,
  placeholder = 'Enter label...',
  isCompact = false,
  disabled = false,
  required = false,
  maxLength = 100,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update local value when prop changes
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  // Handle input change with debounced update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounced update to prevent focus loss
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  // Handle immediate update on blur
  const handleBlur = () => {
    setIsFocused(false);
    
    // Clear timeout and update immediately
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    onChange(localValue);
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue(value);
      inputRef.current?.blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`${styles.formGroup} ${isCompact ? styles.compact : ''}`}>
      {label && (
        <label className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            ${styles.formInput}
            ${error ? styles.error : ''}
            ${isFocused ? styles.focused : ''}
            ${disabled ? styles.disabled : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        
        {maxLength && (
          <div className={styles.charCount}>
            <span className={localValue.length > maxLength * 0.8 ? styles.warning : ''}>
              {localValue.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div 
          id={`${label}-error`}
          className={styles.formError}
          role="alert"
        >
          {error.message}
        </div>
      )}
    </div>
  );
};
