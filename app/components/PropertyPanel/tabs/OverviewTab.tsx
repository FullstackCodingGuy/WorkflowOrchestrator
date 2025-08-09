'use client';

import React from 'react';
import { PropertyPanelState } from '../PropertyPanel';
import styles from '../PropertyPanel.module.css';

interface OverviewTabProps {
  state: PropertyPanelState;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ state }) => {
  return (
    <div className={styles.tabContent}>
      <h4>Overview</h4>
      <p>Selected Items: {state.selectedItems.length}</p>
    </div>
  );
};
