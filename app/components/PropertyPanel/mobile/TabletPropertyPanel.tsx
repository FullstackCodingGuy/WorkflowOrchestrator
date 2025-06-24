'use client';

import React, { useRef, useEffect } from 'react';
import { PropertyPanelState } from '../PropertyPanel';
import styles from '../PropertyPanel.module.css';

interface TabletPropertyPanelProps {
  state: PropertyPanelState;
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

export const TabletPropertyPanel: React.FC<TabletPropertyPanelProps> = ({
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
      
      {/* Tablet panel */}
      <div
        data-property-panel
        ref={panelRef}
        className={`
          ${styles.propertyPanel}
          ${styles.tablet}
          ${state.isOpen ? styles.open : ''}
          ${state.isCompactMode ? styles.compact : ''}
          ${className}
        `}
      >
        {/* Panel content */}
        <div className={styles.panelContent}>
          {children}
        </div>
      </div>
    </>
  );
};
