import React from 'react';
import { BackgroundVariant } from 'reactflow';

interface DiagramNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  selected?: boolean;
  data: {
    label: string;
    description?: string;
    color?: string;
    icon?: string;
    properties?: Record<string, unknown>;
  };
}

interface DiagramToolbarProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onFitView: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  selectedNode: DiagramNode | null;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  isAnimationEnabled: boolean;
  onAnimationToggle: (enabled: boolean) => void;
  onTogglePropertiesPanel: () => void;
  showPropertiesPanel: boolean;
  showMiniMap: boolean;
  onMiniMapToggle: (show: boolean) => void;
}

export function DiagramToolbar({
  onAddNode,
  onDeleteNode,
  onFitView,
  onClear,
  onSave,
  onLoad,
  selectedNode,
  backgroundVariant,
  onBackgroundVariantChange,
  isAnimationEnabled,
  onAnimationToggle,
  onTogglePropertiesPanel,
  showPropertiesPanel,
  showMiniMap,
  onMiniMapToggle,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-col">
      {/* Main Toolbar */}
      <div className="h-12 bg-header border-b border-border flex items-center justify-between px-3 shadow-soft">
        {/* Left Section - Main Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onAddNode}
            className="btn btn-sm btn-primary"
            title="Add Node (Ctrl+N)"
          >
            <span className="text-xs">➕</span>
            <span>Add Node</span>
          </button>

          <button
            onClick={onDeleteNode}
            disabled={!selectedNode}
            className="btn btn-sm btn-destructive disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Selected Node (Delete)"
          >
            <span className="text-xs">🗑️</span>
            <span>Delete</span>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onFitView}
            className="btn btn-sm btn-secondary"
            title="Fit View (Ctrl+F)"
          >
            <span className="text-xs">🎯</span>
            <span>Fit View</span>
          </button>

          <button
            onClick={onClear}
            className="btn btn-sm btn-warning"
            title="Clear All"
          >
            <span className="text-xs">🧹</span>
            <span>Clear</span>
          </button>
        </div>

        {/* Center Section - Background & Animation Controls */}
        <div className="flex items-center space-x-3">
          {/* Background Variant Selector */}
          <div className="flex items-center space-x-2">
            <label className="label text-xs text-muted">Background:</label>
            <select
              value={backgroundVariant}
              onChange={(e) => onBackgroundVariantChange(e.target.value as BackgroundVariant)}
              className="select h-8 min-w-0 w-20 px-2 text-xs"
            >
              <option value={BackgroundVariant.Dots}>Dots</option>
              <option value={BackgroundVariant.Lines}>Lines</option>
              <option value={BackgroundVariant.Cross}>Cross</option>
            </select>
          </div>

          {/* Animation Toggle */}
          <div className="flex items-center space-x-2">
            <label className="label text-xs text-muted">Animations:</label>
            <button
              onClick={() => onAnimationToggle(!isAnimationEnabled)}
              className={`btn btn-sm ${
                isAnimationEnabled
                  ? 'btn-success'
                  : 'btn-outline'
              }`}
              title={`${isAnimationEnabled ? 'Disable' : 'Enable'} edge animations`}
            >
              <span className="text-xs">{isAnimationEnabled ? '🎬' : '⏸️'}</span>
              <span>{isAnimationEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {/* Right Section - File Operations & Properties */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onLoad}
            className="btn btn-sm btn-success"
            title="Load Diagram (Ctrl+O)"
          >
            <span className="text-xs">📂</span>
            <span>Load</span>
          </button>

          <button
            onClick={onSave}
            className="btn btn-sm btn-accent"
            title="Save Diagram (Ctrl+S)"
          >
            <span className="text-xs">💾</span>
            <span>Save</span>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onTogglePropertiesPanel}
            className={`btn btn-sm ${
              showPropertiesPanel
                ? 'btn-primary'
                : 'btn-outline'
            }`}
            title="Toggle Properties Panel"
          >
            <span className="text-xs">⚙️</span>
            <span>Properties</span>
          </button>
        </div>
      </div>

      {/* Footer Toolbar */}
      <div className="h-7 bg-sidebar border-t border-border flex items-center justify-end px-3">
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1.5 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={showMiniMap}
              onChange={(e) => onMiniMapToggle(e.target.checked)}
              className="checkbox w-3 h-3"
            />
            <span>Show MiniMap</span>
          </label>
        </div>
      </div>
    </div>
  );
}
