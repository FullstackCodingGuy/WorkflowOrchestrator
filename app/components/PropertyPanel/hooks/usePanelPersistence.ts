'use client';

import { useCallback } from 'react';
import { TabType } from '../PropertyPanel';

interface PanelPreferences {
  width: number;
  activeTab: TabType;
  isCompactMode: boolean;
  isCollapsed: boolean;
  collapsedGroups: string[];
}

const STORAGE_KEY = 'propertyPanel_preferences';

const DEFAULT_PREFERENCES: PanelPreferences = {
  width: 384,
  activeTab: 'overview',
  isCompactMode: false,
  isCollapsed: false,
  collapsedGroups: [],
};

export const usePanelPersistence = () => {
  const loadState = useCallback((): PanelPreferences | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load panel preferences:', error);
    }
    return null;
  }, []);

  const saveState = useCallback((preferences: Partial<PanelPreferences>) => {
    try {
      const currentPrefs = loadState() || DEFAULT_PREFERENCES;
      const newPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.warn('Failed to save panel preferences:', error);
    }
  }, [loadState]);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear panel preferences:', error);
    }
  }, []);

  const saveCollapsedGroups = useCallback((groupIds: string[]) => {
    saveState({ collapsedGroups: groupIds });
  }, [saveState]);

  return {
    saveState,
    loadState,
    clearState,
    saveCollapsedGroups,
  };
};
