import React, { useState } from 'react';
import { BackgroundVariant } from 'reactflow';
import { 
  IconFolderOpen, 
  IconDeviceFloppy, 
  IconPlus, 
  IconFocus2, 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconRefresh, 
  IconBug, 
  IconPresentation, 
  IconDotsVertical,
  IconLayoutSidebar,
  IconGridDots,
  IconGrid3x3,
  IconSquare,
  IconKeyboard
} from '@tabler/icons-react';
import { MegaFileMenu } from './MegaFileMenu';
import { EnhancedExportShareMenu } from './EnhancedExportShareMenu';
import { ExportOptions } from './ExportManager';
import { COMMON_TOOLBAR_SETTINGS } from '../config/appConfig';
import { CommonSettingsSection } from './CommonSettingsSection';

interface DiagramToolbarProps {
  onAddNode: () => void;
  onFitView: () => void;
  onNew: () => void;
  onNewTemplate: (templateId: string) => void;
  onSave: () => void;
  onLoad: () => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  showMiniMap: boolean;
  onMiniMapToggle: (show: boolean) => void;
  
  // Workflow controls
  showWorkflowControls?: boolean;
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
  onSave,
  onLoad,
  backgroundVariant,
  onBackgroundVariantChange,
  showMiniMap,
  onMiniMapToggle,
  showWorkflowControls = false,
  onPlayWorkflow,
  onPauseWorkflow,
  onRestartWorkflow,
  onDebugWorkflow,
  workflowState,
  showLeftSidebar,
  onToggleLeftSidebar,
  showRightSidebar,
  onToggleRightSidebar,
  snapToGrid = COMMON_TOOLBAR_SETTINGS.snapToGrid.defaultValue,
  onSnapToGridToggle,
  gridSize = COMMON_TOOLBAR_SETTINGS.gridSize.defaultValue,
  onGridSizeChange,
  showControls = COMMON_TOOLBAR_SETTINGS.showControls.defaultValue,
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
          />
          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onLoad}
            className="btn btn-xs btn-outline"
            title="Open Workflow (Ctrl+O)"
          >
            <IconFolderOpen size={16} />
          </button>

          <button
            onClick={onSave}
            className="btn btn-xs btn-outline"
            title="Save Workflow (Ctrl+S)"
          >
            <IconDeviceFloppy size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onAddNode}
            className="btn btn-xs btn-outline"
            title="Add Node (Ctrl+N)"
          >
            <IconPlus size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          <button
            onClick={onFitView}
            className="btn btn-xs btn-outline"
            title="Fit View (Ctrl+F)"
          >
            <IconFocus2 size={16} />
          </button>

        </div>

        {/* Center Section - Conditional Workflow Controls */}
        <div className="flex-1 flex justify-center">
          {showWorkflowControls && (
            <div className="flex items-center space-x-1 bg-card border border-border rounded-lg px-2 py-1">
              <button
                onClick={onPlayWorkflow}
                disabled={workflowState === 'playing'}
                className={`btn btn-xs ${workflowState === 'playing' ? 'btn-success' : 'btn-outline'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Play Workflow"
              >
                {workflowState === 'playing' ? (
                  <IconRefresh size={14} className="animate-spin" />
                ) : (
                  <IconPlayerPlay size={14} />
                )}
              </button>

              <button
                onClick={onPauseWorkflow}
                disabled={workflowState !== 'playing'}
                className={`btn btn-xs ${workflowState === 'paused' ? 'btn-warning' : 'btn-outline'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Pause Workflow"
              >
                <IconPlayerPause size={14} />
              </button>

              <button
                onClick={onRestartWorkflow}
                className="btn btn-xs btn-outline"
                title="Restart Workflow"
              >
                <IconRefresh size={14} />
              </button>

              <button
                onClick={onDebugWorkflow}
                className={`btn btn-xs ${workflowState === 'debugging' ? 'btn-accent' : 'btn-outline'
                  }`}
                title="Debug Workflow"
              >
                <IconBug size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Always Visible Presentation & Export Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenPresentationView}
            className="btn btn-xs btn-primary"
            title="Open Presentation View (Ctrl+P)"
          >
            <IconPresentation size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="btn btn-xs btn-outline"
              title="Export & Share"
            >
              <IconDotsVertical size={16} />
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
            <IconLayoutSidebar size={12} />
          </button>

          <div className="w-px h-4 bg-border" />          {/* Background Variant Buttons */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Dots)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Dots ? 'bg-neutral-200' : ''
                }`}
              title="Dots Background"
            >
              <IconGridDots size={12} />
            </button>
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Lines)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Lines ? 'bg-neutral-200' : ''
                }`}
              title="Grid Background"
            >
              <IconGrid3x3 size={12} />
            </button>
            <button
              onClick={() => onBackgroundVariantChange(BackgroundVariant.Cross)}
              className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Cross ? 'bg-neutral-200' : ''
                }`}
              title="No Background (Transparent)"
            >
              <IconSquare size={12} />
            </button>
          </div>
          
        </div>

        {/* Right Section - Settings + MiniMap Toggle + Right Sidebar Toggle */}
        <div className="flex items-center space-x-2">
          {/* Common Settings Controls */}
          <CommonSettingsSection
            snapToGrid={snapToGrid}
            onSnapToGridToggle={onSnapToGridToggle}
            gridSize={gridSize}
            onGridSizeChange={onGridSizeChange}
            showControls={showControls}
            onShowControlsToggle={onShowControlsToggle}
            showMiniMap={showMiniMap}
            onMiniMapToggle={onMiniMapToggle}
            compact={true}
          />

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
            <IconLayoutSidebar size={12} />
          </button>

          <div className="w-px h-4 bg-border" />

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={onShowKeyboardShortcuts}
            className="btn btn-xs btn-ghost text-muted hover:text-foreground"
            title="Show Keyboard Shortcuts (?)"
          >
            <IconKeyboard size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
