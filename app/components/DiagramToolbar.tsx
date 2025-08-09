import React, { useState } from 'react';
import { BackgroundVariant } from 'reactflow';
import { 
  IconFolderOpen, 
  IconDeviceFloppy, 
  IconPlus, 
  IconFocus2, 
  IconPresentation, 
  IconDotsVertical,
  IconLayoutSidebar,
  IconGridDots,
  IconGrid3x3,
  IconSquare,
  IconKeyboard,
  IconWand,
  IconHierarchy,
  IconCircle,
  IconNetwork,
  IconLayoutGrid,
  IconLayoutColumns
} from '@tabler/icons-react';
import { EnhancedExportShareMenu } from './EnhancedExportShareMenu';
import { ExportOptions } from './ExportManager';
import { CommonSettingsSection } from './CommonSettingsSection';
import { Tooltip } from './Tooltip';

interface DiagramToolbarProps {
  onAddNode: () => void;
  onFitView: () => void;
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  showMiniMap: boolean;
  onMiniMapToggle: (show: boolean) => void;
  
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
  
  // Smart arrange handlers
  onApplyLayout: (direction: "TB" | "LR") => void;
  onApplySmartLayout: (layoutType: "hierarchical" | "circular" | "force" | "grid") => void;
}

export function DiagramToolbar({
  onAddNode,
  onFitView,
  onNew,
  onSave,
  onLoad,
  backgroundVariant,
  onBackgroundVariantChange,
  showMiniMap,
  onMiniMapToggle,
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
  onApplyLayout,
  onApplySmartLayout,
}: DiagramToolbarProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Main Toolbar */}
      <div id="main-toolbar" className="h-12 bg-header border-b border-border flex items-center px-3 shadow-soft">
        {/* Left Section - File Menu + Main Actions */}
        <div className="flex items-center space-x-1.5">
          <Tooltip content="New Diagram (Ctrl+Shift+N)" position="bottom">
            <button
              onClick={onNew}
              className="btn btn-xs btn-outline"
            >
              <IconPlus size={16} />
            </button>
          </Tooltip>
          <div className="w-px h-5 bg-border mx-1" />

          <Tooltip content="Open Diagram (Ctrl+O)" position="bottom">
            <button
              onClick={onLoad}
              className="btn btn-xs btn-outline"
            >
              <IconFolderOpen size={16} />
            </button>
          </Tooltip>

          <Tooltip content="Save Diagram (Ctrl+S)" position="bottom">
            <button
              onClick={onSave}
              className="btn btn-xs btn-outline"
            >
              <IconDeviceFloppy size={16} />
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-border mx-1" />

          <Tooltip content="Add Node (Ctrl+N)" position="bottom">
            <button
              onClick={onAddNode}
              className="btn btn-xs btn-outline"
            >
              <IconPlus size={16} />
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-border mx-1" />

          <Tooltip content="Fit View (Ctrl+F)" position="bottom">
            <button
              onClick={onFitView}
              className="btn btn-xs btn-outline"
            >
              <IconFocus2 size={16} />
            </button>
          </Tooltip>

        </div>

        {/* Center Section - Empty */}
        <div className="flex-1 flex justify-center">
        </div>

        {/* Right Section - Always Visible Presentation & Export Actions */}
        <div className="flex items-center space-x-1.5">
          <Tooltip content="Open Presentation View (Ctrl+P)" position="bottom">
            <button
              onClick={onOpenPresentationView}
              className="btn btn-xs btn-primary"
            >
              <IconPresentation size={16} />
            </button>
          </Tooltip>
          <div className="relative">
            <Tooltip content="Export & Share" position="bottom">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="btn btn-xs btn-outline"
              >
                <IconDotsVertical size={16} />
              </button>
            </Tooltip>
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
          <Tooltip content={`${showLeftSidebar ? 'Hide' : 'Show'} left sidebar`} position="top">
            <button
              onClick={onToggleLeftSidebar}
              className={`btn btn-xs ${showLeftSidebar
                  ? 'btn-primary'
                  : 'btn-outline'
                }`}
            >
              <IconLayoutSidebar size={12} />
            </button>
          </Tooltip>

          <div className="w-px h-4 bg-border" />          {/* Background Variant Buttons */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <Tooltip content="Dots Background" position="top">
              <button
                onClick={() => onBackgroundVariantChange(BackgroundVariant.Dots)}
                className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Dots ? 'bg-neutral-200' : ''
                  }`}
              >
                <IconGridDots size={12} />
              </button>
            </Tooltip>
            <Tooltip content="Grid Background" position="top">
              <button
                onClick={() => onBackgroundVariantChange(BackgroundVariant.Lines)}
                className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Lines ? 'bg-neutral-200' : ''
                  }`}
              >
                <IconGrid3x3 size={12} />
              </button>
            </Tooltip>
            <Tooltip content="No Background (Transparent)" position="top">
              <button
                onClick={() => onBackgroundVariantChange(BackgroundVariant.Cross)}
                className={`btn btn-xs btn-ghost border-0 rounded-none px-1.5 ${backgroundVariant === BackgroundVariant.Cross ? 'bg-neutral-200' : ''
                  }`}
              >
                <IconSquare size={12} />
              </button>
            </Tooltip>
          </div>
          <div className="w-px h-4 bg-border" />

          {/* Smart Arrange Controls */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <Tooltip content="Hierarchical Layout - Top-down flow" position="top">
              <button
                onClick={() => onApplySmartLayout('hierarchical')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconHierarchy size={12} />
              </button>
            </Tooltip>
            <Tooltip content="Circular Layout - Nodes in circle" position="top">
              <button
                onClick={() => onApplySmartLayout('circular')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconCircle size={12} />
              </button>
            </Tooltip>
            <Tooltip content="Force Layout - Organic arrangement" position="top">
              <button
                onClick={() => onApplySmartLayout('force')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconNetwork size={12} />
              </button>
            </Tooltip>
            <Tooltip content="Grid Layout - Organized grid" position="top">
              <button
                onClick={() => onApplySmartLayout('grid')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconLayoutGrid size={12} />
              </button>
            </Tooltip>
          </div>

          <div className="w-px h-4 bg-border" />

          {/* Traditional Layout Controls */}
          <div className="flex items-center bg-card border border-border rounded-sm overflow-hidden">
            <Tooltip content="Vertical Layout - Top to Bottom" position="top">
              <button
                onClick={() => onApplyLayout('TB')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconLayoutColumns size={12} />
              </button>
            </Tooltip>
            <Tooltip content="Horizontal Layout - Left to Right" position="top">
              <button
                onClick={() => onApplyLayout('LR')}
                className="btn btn-xs btn-ghost border-0 rounded-none px-1.5"
              >
                <IconWand size={12} />
              </button>
            </Tooltip>
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
          <Tooltip content={`${showRightSidebar ? 'Hide' : 'Show'} right sidebar`} position="top">
            <button
              onClick={onToggleRightSidebar}
              className={`btn btn-xs ${showRightSidebar
                  ? 'btn-primary'
                  : 'btn-outline'
                }`}
            >
              <IconLayoutSidebar size={12} />
            </button>
          </Tooltip>

          <div className="w-px h-4 bg-border" />

          {/* Keyboard Shortcuts Help */}
          <Tooltip content="Show Keyboard Shortcuts (?)" position="top">
            <button
              onClick={onShowKeyboardShortcuts}
              className="btn btn-xs btn-ghost text-muted hover:text-foreground"
            >
              <IconKeyboard size={12} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
