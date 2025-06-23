'use client';

import React from 'react';
import { TabType, SelectionType, DeviceType } from './PropertyPanel';
import styles from './PropertyPanel.module.css';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectionType: SelectionType;
  isCompactMode: boolean;
  deviceType: DeviceType;
}

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  showForSelection: SelectionType[];
  alwaysShow?: boolean;
}

const TAB_CONFIGS: TabConfig[] = [
  {
    id: 'properties',
    label: 'Properties',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
      </svg>
    ),
    showForSelection: ['single', 'multiple'],
  },
  {
    id: 'style',
    label: 'Style',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
      </svg>
    ),
    showForSelection: ['single', 'multiple'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    ),
    showForSelection: ['single', 'multiple'],
  },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  selectionType,
  isCompactMode,
  deviceType,
}) => {
  const visibleTabs = TAB_CONFIGS.filter(tab => 
    tab.alwaysShow || tab.showForSelection.includes(selectionType)
  );

  const handleTabClick = (tabId: TabType, event: React.MouseEvent) => {
    event.preventDefault();
    onTabChange(tabId);
  };

  return (
    <div className={`
      ${styles.tabNavigation}
      ${isCompactMode ? styles.compact : ''}
      ${styles[deviceType]}
    `}>
      {deviceType === 'mobile' ? (
        // Mobile: Horizontal scrollable tabs
        <div className={styles.mobileTabContainer}>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                ${styles.tab}
                ${styles.mobileTab}
                ${activeTab === tab.id ? styles.active : ''}
              `}
              onClick={(e) => handleTabClick(tab.id, e)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {!isCompactMode && (
                <span className={styles.tabLabel}>{tab.label}</span>
              )}
            </button>
          ))}
        </div>
      ) : (
        // Desktop/Tablet: Standard tabs
        <div className={styles.tabContainer} role="tablist">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                ${styles.tab}
                ${activeTab === tab.id ? styles.active : ''}
              `}
              onClick={(e) => handleTabClick(tab.id, e)}
              aria-selected={activeTab === tab.id}
              role="tab"
              title={tab.label}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {(!isCompactMode || deviceType === 'desktop') && (
                <span className={styles.tabLabel}>{tab.label}</span>
              )}
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <span className={styles.activeIndicator} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
