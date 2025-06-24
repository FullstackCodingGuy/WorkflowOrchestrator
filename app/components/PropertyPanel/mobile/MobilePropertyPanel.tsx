'use client';

import React, { useRef, useEffect } from 'react';
import { PropertyPanelState } from '../PropertyPanel';
import { TouchGestures } from './TouchGestures';
import styles from '../PropertyPanel.module.css';

interface MobilePropertyPanelProps {
  state: PropertyPanelState;
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export const MobilePropertyPanel: React.FC<MobilePropertyPanelProps> = ({
  state,
  onStateUpdate, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClose,
  className = '',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isOpen, onClose]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={styles.backdrop}
        onClick={handleBackdropClick}
      />
      
      {/* Mobile panel */}
      <div
        data-property-panel
        ref={panelRef}
        className={`
          ${styles.propertyPanel}
          ${styles.mobile}
          ${state.isOpen ? styles.open : ''}
          ${state.isCompactMode ? styles.compact : ''}
          ${className}
        `}
      >
        <TouchGestures
          onSwipeDown={onClose}
          onTap={() => {}}
          threshold={50}
        >
          {/* Drag handle */}
          <div className={styles.dragHandle}>
            <div className={styles.dragIndicator} />
          </div>
          
          {/* Panel content */}
          <div className={styles.panelContent}>
            {children}
          </div>
        </TouchGestures>
      </div>
    </>
  );
};
