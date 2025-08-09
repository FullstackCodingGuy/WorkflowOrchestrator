'use client';

import React from 'react';
import { PropertyPanelState } from '../PropertyPanel';
import styles from '../PropertyPanel.module.css';

interface AdvancedTabProps {
  state: PropertyPanelState;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ state }) => {
  return (
    <div className={styles.tabContent}>
      <h4>Advanced</h4>
      <p>Advanced settings for {state.selectedItems.length} items.</p>
    </div>
  );
};
