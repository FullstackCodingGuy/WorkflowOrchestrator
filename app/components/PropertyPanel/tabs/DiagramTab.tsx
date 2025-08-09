'use client';

import React from 'react';
import { PropertyPanelState } from '../PropertyPanel';
import styles from '../PropertyPanel.module.css';

interface DiagramTabProps {
  state: PropertyPanelState;
}

export const DiagramTab: React.FC<DiagramTabProps> = ({ state }) => {
  return (
    <div className={styles.tabContent}>
      <h4>Diagram</h4>
      <p>Diagram-wide settings. {state.selectedItems.length} items selected.</p>
    </div>
  );
};
