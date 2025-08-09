'use client';

import React from 'react';
import { TabType, SelectionType, DeviceType } from './PropertyPanel';
import styles from './PropertyPanel.module.css';
import { SettingsIcon, CogIcon, VisualEditorIcon, MenuIcon } from '../Icons';

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
    id: 'overview',
    label: 'Overview',
    icon: <MenuIcon />,
    showForSelection: ['single', 'multiple'],
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: <SettingsIcon />,
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
    id: 'advanced',
    label: 'Advanced',
    icon: <CogIcon />,
    showForSelection: ['single', 'multiple'],
  },
  {
    id: 'diagram',
    label: 'Diagram',
    icon: <VisualEditorIcon />,
    showForSelection: ['none'],
    alwaysShow: true,
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
