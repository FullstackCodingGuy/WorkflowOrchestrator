import React, { useState } from 'react';
import { BackgroundVariant } from 'reactflow';
import { MegaFileMenu } from './MegaFileMenu';

import { EnhancedExportShareMenu } from './EnhancedExportShareMenu';
import { ExportOptions } from './ExportManager';

interface DiagramToolbarProps {
  onAddNode: () => void;
  onFitView: () => void;
  onNew: () => void;
  onNewTemplate: (templateId: string) => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
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
  
  // Export handlers
  onExportSVG: (options: ExportOptions) => void;
  onExportImage: (format: 'png' | 'jpeg', options: ExportOptions) => void;
  onExportPDF: (options: ExportOptions) => void;
  onExportGIF: (options: ExportOptions) => void;
  onShareToClipboard: () => Promise<void>;
  onGenerateSocialMediaLinks: () => { twitter: string; linkedin: string; facebook: string; email: string };
  onExportWorkflowData: () => void;
}

export function DiagramToolbar({
  onAddNode,
  onFitView,
  onNew,
  onNewTemplate,
  onClear,
  onSave,
  onLoad,
  backgroundVariant,
  onBackgroundVariantChange,
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
  onShowKeyboardShortcuts,
  onExportSVG,
  onExportImage,
  onExportPDF,
  onExportGIF,
  onShareToClipboard,
  onGenerateSocialMediaLinks,
  onExportWorkflowData,
}: DiagramToolbarProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Main Toolbar */}
      <div id="main-toolbar" className="h-12 bg-header border-b border-border flex items-center px-3 shadow-soft">
        {/* Left Section - File Menu + Main Actions */}
        <div className="flex items-center space-x-1.5">
          <MegaFileMenu
            onNew={onNew}
            onNewTemplate={onNewTemplate}
            onLoad={onLoad}
            onSave={onSave}
            onClear={onClear}
            onOpenPresentationView={onOpenPresentationView}
          />
          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onLoad}
            className="btn btn-sm btn-outline"
            title="Open Workflow (Ctrl+O)"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Open</span>
          </button>

          <button
            onClick={onSave}
            className="btn btn-sm btn-outline"
            title="Save Workflow (Ctrl+S)"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save</span>
          </button>

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
              className={`btn btn-sm ${workflowState === 'playing' ? 'btn-success' : 'btn-outline'
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
              className={`btn btn-sm ${workflowState === 'paused' ? 'btn-warning' : 'btn-outline'
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
              className={`btn btn-sm ${workflowState === 'debugging' ? 'btn-accent' : 'btn-outline'
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
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="btn btn-sm btn-outline"
              title="Export & Share"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              </svg>
              <span>Export</span>
            </button>
            {isExportMenuOpen && (
              <EnhancedExportShareMenu
                onExportSVG={onExportSVG}
                onExportImage={onExportImage}
                onExportPDF={onExportPDF}
                onExportGIF={onExportGIF}
                onShareToClipboard={onShareToClipboard}
                onGenerateSocialMediaLinks={onGenerateSocialMediaLinks}
                onExportWorkflowData={onExportWorkflowData}
                onClose={() => setIsExportMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Toolbar */}
      <div id="sub-toolbar" className="h-7 bg-sidebar border-t border-border flex items-center justify-between px-3">
        {/* Left Section - Left Sidebar Toggle + Background & Animation Controls */}
        <div className="flex items-center space-x-2">
          {/* Left Sidebar Toggle */}
          <button
            onClick={onToggleLeftSidebar}
            className={`btn btn-xs ${showLeftSidebar
                ? 'btn-primary'
                : 'btn-outline'
              }`}
            title={`${showLeftSidebar ? 'Hide' : 'Show'} left sidebar`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <div className="w-px h-4 bg-border" />          {/* Background Variant Buttons */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Dots)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Dots ? 'bg-neutral-200' : ''
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
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Lines ? 'bg-neutral-200' : ''
                }`}
              title="Grid Background"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
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
            className={`btn btn-xs ${showRightSidebar
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
