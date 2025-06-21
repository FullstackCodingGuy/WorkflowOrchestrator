import React, { useState } from 'react';
import { BackgroundVariant } from 'reactflow';
import { DiagramNode } from './DiagramEditor';

interface RightPanelContentProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  isAnimationEnabled: boolean;
  onAnimationToggle: (enabled: boolean) => void;
  totalNodes: number;
  totalEdges: number;
}

export function PropertiesContent({ 
  selectedNode, 
  onUpdateNode 
}: { 
  selectedNode: DiagramNode | null; 
  onUpdateNode: (nodeId: string, updates: any) => void; 
}) {
  const [localData, setLocalData] = useState(selectedNode?.data || null);

  React.useEffect(() => {
    setLocalData(selectedNode?.data || null);
  }, [selectedNode]);

  const handleInputChange = (field: string, value: any) => {
    if (!selectedNode || !localData) return;
    
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdateNode(selectedNode.id, { [field]: value });
  };

  if (!selectedNode || !localData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-3xl mb-2">📄</div>
        <div className="text-sm">No node selected</div>
        <div className="text-xs mt-1 text-gray-400">
          Click on a node to edit properties
        </div>
      </div>
    );
  }

  const predefinedColors = [
    '#4ade80', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#10b981', '#f97316', '#ec4899', '#64748b'
  ];

  return (
    <div className="space-y-4">
      {/* Node Info */}
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Node Info</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>ID: {selectedNode.id}</div>
          <div>Type: {selectedNode.type || 'default'}</div>
          <div>Position: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</div>
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Label
        </label>
        <input
          type="text"
          value={localData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Description
        </label>
        <textarea
          value={localData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Color
        </label>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => handleInputChange('color', color)}
              className={`w-6 h-6 rounded border hover:scale-110 transition-transform ${
                localData.color === color ? 'ring-2 ring-gray-900' : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="text"
          value={localData.color || ''}
          onChange={(e) => handleInputChange('color', e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Icon
        </label>
        <input
          type="text"
          value={localData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="📋"
        />
      </div>
    </div>
  );
}

export function SettingsContent({ 
  backgroundVariant, 
  onBackgroundVariantChange, 
  isAnimationEnabled, 
  onAnimationToggle 
}: {
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  isAnimationEnabled: boolean;
  onAnimationToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Background */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Background Pattern
        </label>
        <select
          value={backgroundVariant}
          onChange={(e) => onBackgroundVariantChange(e.target.value as BackgroundVariant)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={BackgroundVariant.Dots}>Dots</option>
          <option value={BackgroundVariant.Lines}>Lines</option>
          <option value={BackgroundVariant.Cross}>Cross</option>
        </select>
      </div>

      {/* Animation */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Edge Animations
        </label>
        <button
          onClick={() => onAnimationToggle(!isAnimationEnabled)}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors text-sm ${
            isAnimationEnabled
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-800 border border-gray-300'
          }`}
        >
          <span>{isAnimationEnabled ? '🎬' : '⏸️'}</span>
          <span>{isAnimationEnabled ? 'Enabled' : 'Disabled'}</span>
        </button>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-1 py-2 px-3 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            <span>☀️</span>
            <span>Light</span>
          </button>
          <button className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors">
            <span>🌙</span>
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Grid Settings */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
          Grid Settings
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Snap to Grid</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Grid Size</span>
            <input 
              type="number" 
              defaultValue={15} 
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DiagramStatsContent({ 
  totalNodes, 
  totalEdges 
}: { 
  totalNodes: number; 
  totalEdges: number; 
}) {
  const stats = [
    { label: 'Total Nodes', value: totalNodes, icon: '🔵' },
    { label: 'Total Edges', value: totalEdges, icon: '🔗' },
    { label: 'Connections', value: Math.round((totalEdges / Math.max(totalNodes, 1)) * 100) / 100, icon: '📊' },
    { label: 'Complexity', value: totalNodes + totalEdges > 10 ? 'High' : totalNodes + totalEdges > 5 ? 'Medium' : 'Low', icon: '⚡' },
  ];

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{stat.icon}</span>
            <span className="text-sm text-gray-700">{stat.label}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
        </div>
      ))}

      {/* Performance Tips */}
      <div className="pt-3 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Tips</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>• Keep diagrams under 50 nodes for best performance</div>
          <div>• Use groups to organize complex workflows</div>
          <div>• Disable animations for large diagrams</div>
        </div>
      </div>
    </div>
  );
}
