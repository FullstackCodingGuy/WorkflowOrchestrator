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

  return (
    <div className={styles.headerMinimal}>
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
