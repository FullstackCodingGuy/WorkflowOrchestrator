'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PropertyPanelState } from './PropertyPanel';
import { MobilePropertyPanel } from './mobile/MobilePropertyPanel';
import { TabletPropertyPanel } from './mobile/TabletPropertyPanel';
import styles from './PropertyPanel.module.css';

interface ResponsivePropertyPanelProps {
  state: PropertyPanelState;
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
  onClose: () => void;
  onResize: (width: number) => void;
  className?: string;
  children: React.ReactNode;
}

export const ResponsivePropertyPanel: React.FC<ResponsivePropertyPanelProps> = ({
  state,
  onStateUpdate,
  onClose,
  onResize,
  className = '',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (state.deviceType !== 'desktop') return;
    
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(state.width);
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
  };

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX;
      const newWidth = Math.max(280, Math.min(600, startWidth + deltaX));
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, onResize]);

  // Mobile/Tablet specific rendering
  if (state.deviceType === 'mobile') {
    return (
      <MobilePropertyPanel
        state={state}
        onStateUpdate={onStateUpdate}
        onClose={onClose}
        className={className}
      >
        {children}
      </MobilePropertyPanel>
    );
  }

  if (state.deviceType === 'tablet') {
    return (
      <TabletPropertyPanel
        state={state}
        onStateUpdate={onStateUpdate}
        onClose={onClose}
        className={className}
      >
        {children}
      </TabletPropertyPanel>
    );
  }

  // Desktop rendering
  return (
    <div
      ref={panelRef}
      data-property-panel
      className={`
        ${styles.propertyPanelContentWrapper}
        ${styles.propertyPanel}
        ${state.isCollapsed ? styles.collapsed : ''}
        ${state.isCompactMode ? styles.compact : ''}
        ${isResizing ? styles.resizing : ''}
        ${className}
      `}
      style={{
        width: state.width,
        transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className={styles.resizeHandle}
        onMouseDown={handleResizeStart}
      />
      {/* Panel content */}
      <div className={styles.panelContent}>
        {children}
      </div>
    </div>
  );
};
