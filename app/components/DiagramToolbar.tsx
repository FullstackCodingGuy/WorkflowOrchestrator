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
    properties?: Record<string, any>;
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
}: DiagramToolbarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
      {/* Left Section - Main Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onAddNode}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          title="Add Node (Ctrl+N)"
        >
          <span className="text-sm">➕</span>
          <span className="text-sm font-medium">Add Node</span>
        </button>

        <button
          onClick={onDeleteNode}
          disabled={!selectedNode}
          className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Delete Selected Node (Delete)"
        >
          <span className="text-sm">🗑️</span>
          <span className="text-sm font-medium">Delete</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onFitView}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          title="Fit View (Ctrl+F)"
        >
          <span className="text-sm">🎯</span>
          <span className="text-sm font-medium">Fit View</span>
        </button>

        <button
          onClick={onClear}
          className="flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          title="Clear All"
        >
          <span className="text-sm">🧹</span>
          <span className="text-sm font-medium">Clear</span>
        </button>
      </div>

      {/* Center Section - Background & Animation Controls */}
      <div className="flex items-center space-x-4">
        {/* Background Variant Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Background:</label>
          <select
            value={backgroundVariant}
            onChange={(e) => onBackgroundVariantChange(e.target.value as BackgroundVariant)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value={BackgroundVariant.Dots}>Dots</option>
            <option value={BackgroundVariant.Lines}>Lines</option>
            <option value={BackgroundVariant.Cross}>Cross</option>
          </select>
        </div>

        {/* Animation Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Animations:</label>
          <button
            onClick={() => onAnimationToggle(!isAnimationEnabled)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              isAnimationEnabled
                ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}
            title={`${isAnimationEnabled ? 'Disable' : 'Enable'} edge animations`}
          >
            {isAnimationEnabled ? '🎬 On' : '⏸️ Off'}
          </button>
        </div>
      </div>

      {/* Right Section - File Operations & Properties */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onLoad}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          title="Load Diagram (Ctrl+O)"
        >
          <span className="text-sm">📂</span>
          <span className="text-sm font-medium">Load</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          title="Save Diagram (Ctrl+S)"
        >
          <span className="text-sm">💾</span>
          <span className="text-sm font-medium">Save</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          onClick={onTogglePropertiesPanel}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            showPropertiesPanel
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-800 border border-gray-300'
          }`}
          title="Toggle Properties Panel"
        >
          <span className="text-sm">⚙️</span>
          <span className="text-sm font-medium">Properties</span>
        </button>
      </div>
    </div>
  );
}
