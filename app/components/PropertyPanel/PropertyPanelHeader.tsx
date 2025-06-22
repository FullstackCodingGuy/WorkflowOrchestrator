'use client';

import React, { useState } from 'react';
import { PropertyPanelState } from './PropertyPanel';
import { PropertySearch } from './features/PropertySearch';
import styles from './PropertyPanel.module.css';

interface PropertyPanelHeaderProps {
  state: PropertyPanelState;
  onCollapseToggle: () => void;
  onClose: () => void;
  onSearch: (query: string) => void;
  onCompactModeToggle: () => void;
}

export const PropertyPanelHeader: React.FC<PropertyPanelHeaderProps> = ({
  state,
  onCollapseToggle,
  onClose,
  onSearch,
  onCompactModeToggle,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const getHeaderTitle = () => {
    if (state.selectionType === 'multiple') {
      return `${state.selectedItems.length} items selected`;
    }
    
    if (state.selectionType === 'single') {
      const item = state.selectedItems[0];
      if ('source' in item) {
        return `Edge: ${item.id}`;
      } else {
        return `${item.data?.label || item.type || 'Node'}: ${item.id}`;
      }
    }
    
    return 'Diagram Properties';
  };

  const getHeaderIcon = () => {
    if (state.selectionType === 'multiple') {
      return (
        <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5h12v2H3V5zm0 4h12v2H3V9zm0 4h8v2H3v-2z"/>
        </svg>
      );
    }
    
    if (state.selectionType === 'single') {
      const item = state.selectedItems[0];
      if ('source' in item) {
        return (
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      } else {
        return (
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
          </svg>
        );
      }
    }
    
    return (
      <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    );
  };

  return (
    <div className={`${styles.header} ${state.isCompactMode ? styles.compact : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerInfo}>
          {getHeaderIcon()}
          <div className={styles.headerText}>
            <h3 className={styles.headerTitle}>{getHeaderTitle()}</h3>
            {state.selectionType === 'single' && (
              <span className={styles.headerSubtitle}>
                {(state.selectedItems[0].data as Record<string, unknown>)?.description as string || 'No description'}
              </span>
            )}
          </div>
        </div>

        <div className={styles.headerActions}>
          {/* Search toggle */}
          <button
            className={`${styles.headerButton} ${showSearch ? styles.active : ''}`}
            onClick={() => setShowSearch(!showSearch)}
            title="Search properties"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>

          {/* Compact mode toggle */}
          <button
            className={`${styles.headerButton} ${state.isCompactMode ? styles.active : ''}`}
            onClick={onCompactModeToggle}
            title="Toggle compact mode"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {/* Collapse toggle */}
          <button
            className={`${styles.headerButton} ${state.isCollapsed ? styles.active : ''}`}
            onClick={onCollapseToggle}
            title={state.isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{ 
                transform: state.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </button>

          {/* Close button */}
          <button
            className={styles.headerButton}
            onClick={onClose}
            title="Close panel"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className={styles.searchContainer}>
          <PropertySearch
            query={state.searchQuery}
            onSearch={onSearch}
            placeholder="Search properties..."
            className={styles.headerSearch}
          />
        </div>
      )}
    </div>
  );
};
