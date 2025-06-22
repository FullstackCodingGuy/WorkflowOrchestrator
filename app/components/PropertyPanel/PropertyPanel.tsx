/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Node, Edge } from 'reactflow';
import { ResponsivePropertyPanel } from './ResponsivePropertyPanel';
import { PropertyPanelHeader } from './PropertyPanelHeader';
import { TabNavigation } from './TabNavigation';
import { PropertyForm } from './PropertyForm';
import { useAutoPanel } from './hooks/useAutoPanel';
import { useResponsivePanel } from './hooks/useResponsivePanel';
import { usePanelPersistence } from './hooks/usePanelPersistence';
import { DiagramNodeData, DiagramEdgeData } from '../DiagramEditor';

export type TabType = 'overview' | 'properties' | 'style' | 'advanced' | 'diagram';
export type SelectionType = 'none' | 'single' | 'multiple';
export type PanelMode = 'sidebar' | 'modal' | 'bottomSheet';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface PropertyPanelState {
  isOpen: boolean;
  isCollapsed: boolean;
  width: number;
  activeTab: TabType;
  isCompactMode: boolean;
  selectedItems: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  selectionType: SelectionType;
  showGlobalProperties: boolean;
  searchQuery: string;
  filteredProperties: string[];
  bulkEditMode: boolean;
  previewMode: boolean;
  deviceType: DeviceType;
  panelMode: PanelMode;
}

export interface PropertyPanelProps {
  selectedNode?: Node<DiagramNodeData> | null;
  selectedEdge?: Edge<DiagramEdgeData> | null;
  selectedItems?: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[];
  onNodeUpdate?: (nodeId: string, updates: Partial<DiagramNodeData>) => void;
  onEdgeUpdate?: (edgeId: string, updates: Partial<DiagramEdgeData>) => void;
  onSelectionChange?: (items: (Node<DiagramNodeData> | Edge<DiagramEdgeData>)[]) => void;
  className?: string;
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

const DEFAULT_PANEL_STATE: PropertyPanelState = {
  isOpen: false,
  isCollapsed: false,
  width: 384,
  activeTab: 'overview',
  isCompactMode: false,
  selectedItems: [],
  selectionType: 'none',
  showGlobalProperties: false,
  searchQuery: '',
  filteredProperties: [],
  bulkEditMode: false,
  previewMode: false,
  deviceType: 'desktop',
  panelMode: 'sidebar',
};

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedEdge,
  selectedItems = [],
  onNodeUpdate,
  onEdgeUpdate,
  onSelectionChange,
  className = '',
  isVisible = false,
  onVisibilityChange,
}) => {
  // State management
  const [panelState, setPanelState] = useState<PropertyPanelState>(DEFAULT_PANEL_STATE);
  
  // Hooks
  const { deviceType, panelMode } = useResponsivePanel();
  const { saveState, loadState } = usePanelPersistence();
  const { handleClickOutside, handleEscapeKey } = useAutoPanel({
    isOpen: panelState.isOpen,
    onClose: () => handleVisibilityChange(false),
  });

  // Load persisted state on mount
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setPanelState(prev => ({
        ...prev,
        ...savedState,
        deviceType,
        panelMode,
      }));
    }
  }, [deviceType, panelMode, loadState]);

  // Save state changes
  useEffect(() => {
    saveState({
      width: panelState.width,
      activeTab: panelState.activeTab,
      isCompactMode: panelState.isCompactMode,
      isCollapsed: panelState.isCollapsed,
    });
  }, [panelState.width, panelState.activeTab, panelState.isCompactMode, panelState.isCollapsed, saveState]);

  // Memoize selected items to prevent infinite re-renders
  const currentSelectedItems = useMemo(() => {
    const items = [];
    if (selectedNode) items.push(selectedNode);
    if (selectedEdge) items.push(selectedEdge);
    if (selectedItems && selectedItems.length > 0) items.push(...selectedItems);
    return Array.from(new Set(items));
  }, [selectedNode, selectedEdge, selectedItems]);

  // Handle selection changes
  useEffect(() => {
    const uniqueItems = currentSelectedItems;
    
    // Only update if items actually changed
    setPanelState(prev => {
      const itemsChanged = JSON.stringify(prev.selectedItems.map(i => i.id)) !== JSON.stringify(uniqueItems.map(i => i.id));
      
      if (!itemsChanged) return prev;
      
      return {
        ...prev,
        selectedItems: uniqueItems,
        selectionType: uniqueItems.length === 0 ? 'none' : uniqueItems.length === 1 ? 'single' : 'multiple',
        showGlobalProperties: uniqueItems.length === 0,
        isOpen: uniqueItems.length > 0 || prev.showGlobalProperties,
      };
    });

    // Auto-open panel when items are selected
    if (uniqueItems.length > 0 && onVisibilityChange) {
      onVisibilityChange(true);
    }
  }, [currentSelectedItems, onVisibilityChange]);

  // Handle visibility changes
  const handleVisibilityChange = useCallback((visible: boolean) => {
    setPanelState(prev => ({ ...prev, isOpen: visible }));
    if (onVisibilityChange) {
      onVisibilityChange(visible);
    }
  }, [onVisibilityChange]);

  // Handle panel state updates
  const handleStateUpdate = useCallback((updates: Partial<PropertyPanelState>) => {
    setPanelState(prev => ({ ...prev, ...updates }));
  }, []);

  // Handle item updates
  const handleItemUpdate = useCallback((itemId: string, updates: any) => {
    const item = panelState.selectedItems.find(item => item.id === itemId);
    if (!item) return;

    if (item.type === 'custom' || 'source' in item === false) {
      // It's a node
      if (onNodeUpdate) {
        onNodeUpdate(itemId, updates);
      }
    } else {
      // It's an edge
      if (onEdgeUpdate) {
        onEdgeUpdate(itemId, updates);
      }
    }
  }, [panelState.selectedItems, onNodeUpdate, onEdgeUpdate]);

  // Handle tab changes
  const handleTabChange = useCallback((tab: TabType) => {
    setPanelState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Handle panel resize
  const handleResize = useCallback((width: number) => {
    setPanelState(prev => ({ ...prev, width }));
  }, []);

  // Handle collapse toggle
  const handleCollapseToggle = useCallback(() => {
    setPanelState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    handleVisibilityChange(false);
  }, [handleVisibilityChange]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setPanelState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  // Update device type and panel mode
  useEffect(() => {
    setPanelState(prev => ({
      ...prev,
      deviceType,
      panelMode,
    }));
  }, [deviceType, panelMode]);

  // Setup click outside and escape key handlers
  useEffect(() => {
    if (panelState.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [panelState.isOpen, handleClickOutside, handleEscapeKey]);

  // Don't render if not visible
  if (!panelState.isOpen && !isVisible) {
    return null;
  }

  return (
    <ResponsivePropertyPanel
      state={panelState}
      onStateUpdate={handleStateUpdate}
      onClose={handleClose}
      onResize={handleResize}
      className={className}
    >
      <PropertyPanelHeader
        state={panelState}
        onCollapseToggle={handleCollapseToggle}
        onClose={handleClose}
        onSearch={handleSearch}
        onCompactModeToggle={() => handleStateUpdate({ isCompactMode: !panelState.isCompactMode })}
      />
      
      {!panelState.isCollapsed && (
        <>
          <TabNavigation
            activeTab={panelState.activeTab}
            onTabChange={handleTabChange}
            selectionType={panelState.selectionType}
            isCompactMode={panelState.isCompactMode}
            deviceType={panelState.deviceType}
          />
          
          <PropertyForm
            state={panelState}
            selectedItems={panelState.selectedItems}
            onItemUpdate={handleItemUpdate}
            onStateUpdate={handleStateUpdate}
          />
        </>
      )}
    </ResponsivePropertyPanel>
  );
};

export default PropertyPanel;
