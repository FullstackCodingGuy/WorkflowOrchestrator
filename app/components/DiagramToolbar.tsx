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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Node</span>
          </button>

          <button
            onClick={onDeleteNode}
            disabled={!selectedNode}
            className="btn btn-sm btn-destructive disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Selected Node (Delete)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onFitView}
            className="btn btn-sm btn-secondary"
            title="Fit View (Ctrl+F)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Fit View</span>
          </button>

          <button
            onClick={onClear}
            className="btn btn-sm btn-warning"
            title="Clear All"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
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
              {isAnimationEnabled ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                </svg>
              )}
              <span>{isAnimationEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {/* Right Section - File Operations & Properties */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onLoad}
            className="btn btn-sm btn-accent"
            title="Load Diagram (Ctrl+O)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Load</span>
          </button>

          <button
            onClick={onSave}
            className="btn btn-sm btn-success"
            title="Save Diagram (Ctrl+S)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Properties</span>
          </button>
        </div>
      </div>

      {/* Footer Toolbar */}
      <div className="h-7 bg-sidebar border-t border-border flex items-center justify-end px-3">
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1.5 text-xs text-muted cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={showMiniMap}
              onChange={(e) => onMiniMapToggle(e.target.checked)}
              className="checkbox w-3 h-3"
            />
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Show MiniMap</span>
          </label>
        </div>
      </div>
    </div>
  );
}
