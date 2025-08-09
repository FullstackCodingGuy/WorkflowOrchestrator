'use client';

import React from 'react';
import { Node } from 'reactflow';
import { DiagramNodeData } from '../DiagramEditor';
import { PropertyPanelState } from './PropertyPanel';
import styles from './PropertyPanel.module.css';
import { XIcon, ChevronDownIcon, ChevronUpIcon, CompressIcon } from '../Icons';

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
  const getSelectedNodeType = () => {
    if (state.selectedItems.length === 0) return 'Diagram';
    
    const firstItem = state.selectedItems[0];
    if ('source' in firstItem) {
      return 'Edge';
    } else {
      const node = firstItem as Node<DiagramNodeData>;
      const nodeType = node.type || 'Node';
      return nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
    }
  };

  const selectedNodeType = getSelectedNodeType();
  const title = state.selectedItems.length > 0 
    ? `${selectedNodeType} Properties` 
    : 'Global Diagram Properties';
  
  const subTitle = state.selectedItems.length > 1 
    ? `${state.selectedItems.length} items selected`
    : state.selectedItems.length === 1
    ? `ID: ${state.selectedItems[0].id}`
    : 'No selection';

  return (
    <div className={`${styles.header} ${state.isCompactMode ? styles.compact : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerInfo}>
          <div className={styles.headerText}>
            <h3 className={styles.headerTitle}>{title}</h3>
            <p className={styles.headerSubtitle}>{subTitle}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.headerButton} ${state.isCompactMode ? styles.active : ''}`}
            onClick={onCompactModeToggle}
            title={state.isCompactMode ? 'Disable compact mode' : 'Enable compact mode'}
          >
            <CompressIcon />
          </button>
          <button
            className={styles.headerButton}
            onClick={onCollapseToggle}
            title={state.isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {state.isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
          <button
            className={styles.headerButton}
            onClick={onClose}
            title="Close panel"
          >
            <XIcon />
          </button>
        </div>
      </div>
      {!state.isCollapsed && (
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <div className={styles.searchIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              className={styles.searchField}
              value={state.searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
            {state.searchQuery && (
              <button onClick={() => onSearch('')} className={styles.clearButton}>
                <XIcon />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
