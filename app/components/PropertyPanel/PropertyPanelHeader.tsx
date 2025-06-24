'use client';

import React from 'react';
import { Node } from 'reactflow';
import { DiagramNodeData } from '../DiagramEditor';
import { PropertyPanelState } from './PropertyPanel';
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
  onClose,
}) => {
  // Get the selected node type for display
  const getSelectedNodeType = () => {
    if (state.selectedItems.length === 0) return null;
    
    const firstItem = state.selectedItems[0];
    if ('source' in firstItem) {
      // It's an edge
      return 'Edge';
    } else {
      // It's a node
      const node = firstItem as Node<DiagramNodeData>;
      const nodeType = node.data?.nodeType || node.type || 'Node';
      // Capitalize first letter and format
      return nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
    }
  };

  const selectedNodeType = getSelectedNodeType();

  return (
    <div className={styles.headerMinimal}>
      {selectedNodeType && (
        <div className={styles.headerNodeType}>
          <span className={styles.nodeTypeIcon}>
            {selectedNodeType === 'Edge' ? '→' : '⬢'}
          </span>
          <span className={styles.nodeTypeText}>{selectedNodeType}</span>
          {state.selectedItems.length > 1 && (
            <span className={styles.selectionCount}>({state.selectedItems.length})</span>
          )}
        </div>
      )}
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
  );
};
