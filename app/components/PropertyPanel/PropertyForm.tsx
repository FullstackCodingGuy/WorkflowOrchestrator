'use client';

import React from 'react';
import { PropertyPanelState, TabType } from './PropertyPanel';
import { OverviewTab } from './tabs/OverviewTab';
import { PropertiesTab } from './tabs/PropertiesTab';
import { StyleTab } from './tabs/StyleTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { DiagramTab } from './tabs/DiagramTab';
import styles from './PropertyPanel.module.css';

interface PropertyFormProps {
  state: PropertyPanelState;
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void;
  onNodePositionUpdate: (nodeId: string, position: { x: number; y: number }) => void;
  onStateUpdate: (updates: Partial<PropertyPanelState>) => void;
}

const renderTabContent = (
  activeTab: TabType,
  state: PropertyPanelState,
  onItemUpdate: (itemId: string, updates: Record<string, unknown>) => void,
  onNodePositionUpdate: (nodeId: string, position: { x: number; y: number }) => void
) => {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab state={state} />;
    case 'properties':
      return <PropertiesTab state={state} onItemUpdate={onItemUpdate} onNodePositionUpdate={onNodePositionUpdate} />;
    case 'style':
      return <StyleTab state={state} onItemUpdate={onItemUpdate} />;
    case 'advanced':
      return <AdvancedTab state={state} />;
    case 'diagram':
      return <DiagramTab state={state} />;
    default:
      return null;
  }
};

export const PropertyForm: React.FC<PropertyFormProps> = ({
  state,
  onItemUpdate,
  onNodePositionUpdate,
}) => {
  return (
    <div className={`${styles.propertyForm} ${state.isCompactMode ? styles.compact : ''}`}>
      <div className={styles.formContent}>
        {renderTabContent(state.activeTab, state, onItemUpdate, onNodePositionUpdate)}
      </div>
    </div>
  );
};
