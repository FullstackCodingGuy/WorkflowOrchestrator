import React, { useState, useEffect } from 'react';
import { DiagramEdge } from './DiagramEditor';

interface DiagramEdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  markerEnd?: 'arrow' | 'none';
  edgeType?: string;
}

interface EdgePropertiesPanelProps {
  selectedEdge: DiagramEdge | null;
  onUpdateEdge: (edgeId: string, updates: Partial<DiagramEdgeData | undefined>) => void;
}

export function EdgePropertiesPanel({
  selectedEdge,
  onUpdateEdge,
}: EdgePropertiesPanelProps) {
  const [localData, setLocalData] = useState(selectedEdge?.data || null);

  // Sync local data with selected edge
  useEffect(() => {
    if (selectedEdge) {
      setLocalData({ ...selectedEdge.data });
    } else {
      setLocalData(null);
    }
  }, [selectedEdge]);

  // Handle input changes
  const handleInputChange = (field: string, value: unknown) => {
    if (!localData || !selectedEdge) return;

    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdateEdge(selectedEdge.id, updatedData as Partial<DiagramEdgeData>);
  };

  if (!selectedEdge || !localData) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No edge selected</p>
        <p className="text-sm mt-2">Click on an edge to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Edge Properties</h3>
        <span className="text-sm text-gray-500">ID: {selectedEdge.id}</span>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={localData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter edge label"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex space-x-2">
          <input
            type="color"
            value={localData.color || '#64748b'}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={localData.color || '#64748b'}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#64748b"
          />
        </div>
      </div>

      {/* Stroke Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stroke Width
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={localData.strokeWidth || 2}
          onChange={(e) => handleInputChange('strokeWidth', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1px</span>
          <span>{localData.strokeWidth || 2}px</span>
          <span>10px</span>
        </div>
      </div>

      {/* Stroke Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stroke Style
        </label>
        <select
          value={localData.strokeStyle || 'solid'}
          onChange={(e) => handleInputChange('strokeStyle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      {/* Animation */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={localData.animated || false}
            onChange={(e) => handleInputChange('animated', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Animated</span>
        </label>
      </div>

      {/* Animation Speed */}
      {localData.animated && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Animation Speed
          </label>
          <select
            value={localData.animationSpeed || 'normal'}
            onChange={(e) => handleInputChange('animationSpeed', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      )}

      {/* Marker End */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Marker
        </label>
        <select
          value={localData.markerEnd || 'arrow'}
          onChange={(e) => handleInputChange('markerEnd', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="arrow">Arrow</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Edge Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Edge Type
        </label>
        <select
          value={localData.edgeType || 'animated'}
          onChange={(e) => handleInputChange('edgeType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="animated">Animated</option>
        </select>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
        <div className="h-16 bg-white rounded border flex items-center justify-center">
          <svg width="100" height="40" viewBox="0 0 100 40">
            <path
              d="M10 20 L90 20"
              stroke={localData.color || '#64748b'}
              strokeWidth={localData.strokeWidth || 2}
              strokeDasharray={
                localData.strokeStyle === 'dashed' ? '5,5' :
                localData.strokeStyle === 'dotted' ? '2,2' : 'none'
              }
              fill="none"
              markerEnd={localData.markerEnd !== 'none' ? 'url(#arrowhead)' : undefined}
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={localData.color || '#64748b'}
                />
              </marker>
            </defs>
          </svg>
        </div>
        {localData.label && (
          <div className="text-center mt-2">
            <span className="text-xs text-gray-600">{localData.label}</span>
          </div>
        )}
      </div>

      {/* Connection Details */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Details</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Source: {selectedEdge.source}</div>
          <div>Target: {selectedEdge.target}</div>
          <div>Type: {selectedEdge.type || 'default'}</div>
        </div>
      </div>
    </div>
  );
}
