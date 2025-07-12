import React from 'react';
import { COMMON_TOOLBAR_SETTINGS } from '../config/appConfig';

// Reusable Common Settings Section Component
export interface CommonSettingsSectionProps {
  snapToGrid: boolean;
  onSnapToGridToggle: (enabled: boolean) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  showControls: boolean;
  onShowControlsToggle: (show: boolean) => void;
  showMiniMap: boolean;
  onMiniMapToggle: (show: boolean) => void;
  compact?: boolean; // For different layout contexts
  className?: string;
}

export function CommonSettingsSection({
  snapToGrid,
  onSnapToGridToggle,
  gridSize,
  onGridSizeChange,
  showControls,
  onShowControlsToggle,
  showMiniMap,
  onMiniMapToggle,
  compact = false,
  className = '',
}: CommonSettingsSectionProps) {
  const textSize = compact ? 'text-xs' : 'text-sm';
  const spacing = compact ? 'space-x-1.5' : 'space-x-2';
  const inputSize = compact ? 'w-3 h-3' : 'w-4 h-4';
  const numberInputSize = compact ? 'w-12' : 'w-16';

  return (
    <div className={`flex items-center ${spacing} ${className}`}>
      {/* Snap to Grid */}
      <label className={`flex items-center space-x-1.5 ${textSize} text-muted cursor-pointer hover:text-foreground transition-colors`}>
        <input
          type="checkbox"
          checked={snapToGrid}
          onChange={(e) => onSnapToGridToggle(e.target.checked)}
          className={`checkbox ${inputSize}`}
          title={COMMON_TOOLBAR_SETTINGS.snapToGrid.tooltip}
        />
        <span>{COMMON_TOOLBAR_SETTINGS.snapToGrid.label}</span>
      </label>

      {/* Grid Size */}
      <div className={`flex items-center space-x-1 ${textSize} text-muted`}>
        <label>{COMMON_TOOLBAR_SETTINGS.gridSize.label}:</label>
        <input
          type="number"
          value={gridSize}
          onChange={(e) => onGridSizeChange(parseInt(e.target.value))}
          className={`${numberInputSize} px-1 py-0.5 ${textSize} border border-border rounded bg-background text-foreground`}
          min={COMMON_TOOLBAR_SETTINGS.gridSize.min}
          max={COMMON_TOOLBAR_SETTINGS.gridSize.max}
          step={COMMON_TOOLBAR_SETTINGS.gridSize.step}
          title={COMMON_TOOLBAR_SETTINGS.gridSize.tooltip}
        />
      </div>

      {/* Show Controls */}
      <label className={`flex items-center space-x-1.5 ${textSize} text-muted cursor-pointer hover:text-foreground transition-colors`}>
        <input
          type="checkbox"
          checked={showControls}
          onChange={(e) => onShowControlsToggle(e.target.checked)}
          className={`checkbox ${inputSize}`}
          title={COMMON_TOOLBAR_SETTINGS.showControls.tooltip}
        />
        <span>{COMMON_TOOLBAR_SETTINGS.showControls.label}</span>
      </label>

      <div className="w-px h-4 bg-border" />

      {/* Show MiniMap */}
      <label className={`flex items-center space-x-1.5 ${textSize} text-muted cursor-pointer hover:text-foreground transition-colors`}>
        <input
          type="checkbox"
          checked={showMiniMap}
          onChange={(e) => onMiniMapToggle(e.target.checked)}
          className={`checkbox ${inputSize}`}
          title={COMMON_TOOLBAR_SETTINGS.showMiniMap.tooltip}
        />
        <svg className={`${inputSize} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{COMMON_TOOLBAR_SETTINGS.showMiniMap.label}</span>
      </label>
    </div>
  );
}

/**
 * Hook to provide default settings values based on global defaults
 */
export function useCommonSettings() {
  return {
    snapToGrid: COMMON_TOOLBAR_SETTINGS.snapToGrid.defaultValue,
    gridSize: COMMON_TOOLBAR_SETTINGS.gridSize.defaultValue,
    showControls: COMMON_TOOLBAR_SETTINGS.showControls.defaultValue,
    showMiniMap: COMMON_TOOLBAR_SETTINGS.showMiniMap.defaultValue,
  };
}
