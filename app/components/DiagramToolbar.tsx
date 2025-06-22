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
  // Workflow controls
  onPlayWorkflow: () => void;
  onPauseWorkflow: () => void;
  onRestartWorkflow: () => void;
  onDebugWorkflow: () => void;
  workflowState: 'idle' | 'playing' | 'paused' | 'debugging';
  // Sidebar controls
  showLeftSidebar: boolean;
  onToggleLeftSidebar: () => void;
  showRightSidebar: boolean;
  onToggleRightSidebar: () => void;
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
  onPlayWorkflow,
  onPauseWorkflow,
  onRestartWorkflow,
  onDebugWorkflow,
  workflowState,
  showLeftSidebar,
  onToggleLeftSidebar,
  showRightSidebar,
  onToggleRightSidebar,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-col">
      {/* Main Toolbar */}
      <div id="main-toolbar" className="h-12 bg-header border-b border-border flex items-center px-3 shadow-soft">
        {/* Left Section - Main Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onAddNode}
            className="btn btn-sm btn-outline"
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
            className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="btn btn-sm btn-outline"
            title="Fit View (Ctrl+F)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Fit View</span>
          </button>

          <button
            onClick={onClear}
            className="btn btn-sm btn-outline"
            title="Clear All"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear</span>
          </button>
        </div>

        {/* Center Section - Workflow Controls */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-1 bg-card border border-border rounded-lg px-2 py-1">
            <button
              onClick={onPlayWorkflow}
              disabled={workflowState === 'playing'}
              className={`btn btn-sm ${
                workflowState === 'playing' ? 'btn-success' : 'btn-outline'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Play Workflow"
            >
              {workflowState === 'playing' ? (
                <div className="w-4 h-4 animate-spin">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={onPauseWorkflow}
              disabled={workflowState !== 'playing'}
              className={`btn btn-sm ${
                workflowState === 'paused' ? 'btn-warning' : 'btn-outline'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Pause Workflow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            </button>

            <button
              onClick={onRestartWorkflow}
              className="btn btn-sm btn-outline"
              title="Restart Workflow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={onDebugWorkflow}
              className={`btn btn-sm ${
                workflowState === 'debugging' ? 'btn-accent' : 'btn-outline'
              }`}
              title="Debug Workflow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section - File Operations & Properties */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onLoad}
            className="btn btn-sm btn-outline"
            title="Load Diagram (Ctrl+O)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Load</span>
          </button>

          <button
            onClick={onSave}
            className="btn btn-sm btn-outline"
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
      <div id="sub-toolbar" className="h-7 bg-sidebar border-t border-border flex items-center justify-between px-3">
        {/* Left Section - Left Sidebar Toggle + Background & Animation Controls */}
        <div className="flex items-center space-x-2">
          {/* Left Sidebar Toggle */}
          <button
            onClick={onToggleLeftSidebar}
            className={`btn btn-xs ${
              showLeftSidebar
                ? 'btn-primary'
                : 'btn-outline'
            }`}
            title={`${showLeftSidebar ? 'Hide' : 'Show'} left sidebar`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <div className="w-px h-4 bg-border" />

          {/* Background Variant Buttons */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Dots)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${
                backgroundVariant === BackgroundVariant.Dots ? 'bg-accent' : ''
              }`}
              title="Dots Background"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="6" cy="6" r="1" fill="currentColor" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
                <circle cx="6" cy="18" r="1" fill="currentColor" />
                <circle cx="18" cy="18" r="1" fill="currentColor" />
              </svg>
            </button>
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Lines)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${
                backgroundVariant === BackgroundVariant.Lines ? 'bg-accent' : ''
              }`}
              title="Lines Background"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Cross)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${
                backgroundVariant === BackgroundVariant.Cross ? 'bg-accent' : ''
              }`}
              title="Cross Background"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18M3 12h18" />
              </svg>
            </button>
          </div>

          {/* Animation Toggle */}
          <button
            onClick={() => onAnimationToggle(!isAnimationEnabled)}
            className={`btn btn-xs ${
              isAnimationEnabled
                ? 'btn-success'
                : 'btn-outline'
            }`}
            title={`${isAnimationEnabled ? 'Disable' : 'Enable'} edge animations`}
          >
            {isAnimationEnabled ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            )}
          </button>
        </div>

        {/* Right Section - MiniMap Toggle + Right Sidebar Toggle */}
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

          <div className="w-px h-4 bg-border" />

          {/* Right Sidebar Toggle */}
          <button
            onClick={onToggleRightSidebar}
            className={`btn btn-xs ${
              showRightSidebar
                ? 'btn-primary'
                : 'btn-outline'
            }`}
            title={`${showRightSidebar ? 'Hide' : 'Show'} right sidebar`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6H4M20 12H4m16 6H11" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
