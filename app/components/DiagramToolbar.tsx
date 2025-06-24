import React from 'react';
import { BackgroundVariant } from 'reactflow';
import { FileMenu } from './FileMenu';
import { DIAGRAM_TYPES, DiagramType } from '../config/appConfig';

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
  onNew: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  selectedNode: DiagramNode | null;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  isAnimationEnabled: boolean;
  onAnimationToggle: (enabled: boolean) => void;
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
  // Settings controls (moved from settings tab)
  snapToGrid?: boolean;
  onSnapToGridToggle: (enabled: boolean) => void;
  gridSize?: number;
  onGridSizeChange: (size: number) => void;
  showControls?: boolean;
  onShowControlsToggle: (show: boolean) => void;
  // Presentation view controls
  onOpenPresentationView: () => void;
  // Keyboard shortcuts help
  onShowKeyboardShortcuts: () => void;
  // Diagram type controls
  currentDiagramType: DiagramType;
  onDiagramTypeChange: (diagramType: DiagramType) => void;
}

export function DiagramToolbar({
  onAddNode,
  onDeleteNode,
  onFitView,
  onNew,
  onClear,
  onSave,
  onLoad,
  selectedNode,
  backgroundVariant,
  onBackgroundVariantChange,
  isAnimationEnabled,
  onAnimationToggle,
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
  snapToGrid = false,
  onSnapToGridToggle,
  gridSize = 20,
  onGridSizeChange,
  showControls = true,
  onShowControlsToggle,
  onOpenPresentationView,
  currentDiagramType,
  onDiagramTypeChange,
  onShowKeyboardShortcuts,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-col">
      {/* Main Toolbar */}
      <div id="main-toolbar" className="h-12 bg-header border-b border-border flex items-center px-3 shadow-soft">
        {/* Left Section - File Menu + Main Actions */}
        <div className="flex items-center space-x-1.5">
          <FileMenu
            onNew={onNew}
            onLoad={onLoad}
            onSave={onSave}
            onClear={onClear}
            onOpenPresentationView={onOpenPresentationView}
          />

          <div className="w-px h-5 bg-border mx-1" />

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

          {/* <button
            onClick={onDeleteNode}
            disabled={!selectedNode}
            className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Selected Node (Delete)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button> */}

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

        {/* Right Section - Presentation & Future Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenPresentationView}
            className="btn btn-sm btn-primary"
            title="Open Presentation View (Ctrl+P)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0h8M5 8h14M5 12h14M5 16h14" />
            </svg>
            <span>Present</span>
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
                backgroundVariant === BackgroundVariant.Dots ? 'bg-neutral-200' : ''
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
                backgroundVariant === BackgroundVariant.Lines ? 'bg-neutral-200' : ''
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
                backgroundVariant === BackgroundVariant.Cross ? 'bg-neutral-200' : ''
              }`}
              title="Cross Background"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18M3 12h18" />
              </svg>
            </button>
          </div>

          {/* Animation Toggle */}
          {/* <button
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
          </button> */}

          <div className="w-px h-4 bg-border" />

          {/* Diagram Type Selector */}
          <div className="flex items-center space-x-1 text-xs text-muted">
            <label>Type:</label>
            <select
              value={currentDiagramType}
              onChange={(e) => onDiagramTypeChange(e.target.value as DiagramType)}
              className="px-1 py-0.5 text-xs border border-border rounded bg-background text-foreground min-w-0 max-w-48"
              title="Diagram Type"
            >
              {Object.values(DIAGRAM_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Section - Settings + MiniMap Toggle + Right Sidebar Toggle */}
        <div className="flex items-center space-x-2">
          {/* Settings Controls */}
          <label className="flex items-center space-x-1.5 text-xs text-muted cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => onSnapToGridToggle(e.target.checked)}
              className="checkbox w-3 h-3"
            />
            <span>Snap to Grid</span>
          </label>

          <div className="flex items-center space-x-1 text-xs text-muted">
            <label>Grid:</label>
            <input
              type="number"
              value={gridSize}
              onChange={(e) => onGridSizeChange(parseInt(e.target.value))}
              className="w-12 px-1 py-0.5 text-xs border border-border rounded bg-background text-foreground"
              min={10}
              max={100}
              step={5}
            />
          </div>

          <label className="flex items-center space-x-1.5 text-xs text-muted cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={showControls}
              onChange={(e) => onShowControlsToggle(e.target.checked)}
              className="checkbox w-3 h-3"
            />
            <span>Show Controls</span>
          </label>

          <div className="w-px h-4 bg-border" />

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

          <div className="w-px h-4 bg-border" />

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={onShowKeyboardShortcuts}
            className="btn btn-xs btn-ghost text-muted hover:text-foreground"
            title="Show Keyboard Shortcuts (?)"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
