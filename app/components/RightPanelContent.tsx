import React, { useState } from 'react';
import { DiagramNode } from './DiagramEditor';
import { useTheme } from '../hooks/useTheme';

export function PropertiesContent({ 
  selectedNode, 
  onUpdateNode 
}: { 
  selectedNode: DiagramNode | null; 
  onUpdateNode: (nodeId: string, updates: unknown) => void; 
}) {
  const [localData, setLocalData] = useState(selectedNode?.data || null);

  React.useEffect(() => {
    setLocalData(selectedNode?.data || null);
  }, [selectedNode]);

  const handleInputChange = (field: string, value: unknown) => {
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
        <div className="text-xs mt-1 text-muted">
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
    <div className="space-y-3">
      {/* Node Info */}
      <div className="card card-content p-2.5">
        <div className="text-xs font-semibold text-muted uppercase mb-2">Node Info</div>
        <div className="text-xs text-muted space-y-1">
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

export function SettingsContent() {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <div className="space-y-3">
      {/* Theme */}
      <div>
        <label className="block text-xs font-semibold text-muted uppercase mb-2">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button 
            onClick={() => changeTheme('light')}
            className={`btn btn-xs ${
              currentTheme === 'light' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Light</span>
          </button>
          <button 
            onClick={() => changeTheme('dark')}
            className={`btn btn-xs ${
              currentTheme === 'dark' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span>Dark</span>
          </button>
          <button 
            onClick={() => changeTheme('professional')}
            className={`btn btn-xs ${
              currentTheme === 'professional' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
            <span>Pro</span>
          </button>
          <button 
            onClick={() => changeTheme('creative')}
            className={`btn btn-xs ${
              currentTheme === 'creative' ? 'btn-primary' : 'btn-outline'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
            <span>Creative</span>
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
