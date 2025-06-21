import React, { useState, useEffect } from 'react';

interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  properties?: Record<string, any>;
}

interface DiagramNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  selected?: boolean;
  data: DiagramNodeData;
}

interface NodePropertiesPanelProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<DiagramNodeData>) => void;
  onClose: () => void;
}

export function NodePropertiesPanel({
  selectedNode,
  onUpdateNode,
  onClose,
}: NodePropertiesPanelProps) {
  const [localData, setLocalData] = useState<DiagramNodeData | null>(null);
  const [customProperty, setCustomProperty] = useState({ key: '', value: '' });

  // Sync local data with selected node
  useEffect(() => {
    if (selectedNode) {
      setLocalData({ ...selectedNode.data });
    } else {
      setLocalData(null);
    }
  }, [selectedNode]);

  // Handle input changes
  const handleInputChange = (field: keyof DiagramNodeData, value: any) => {
    if (!localData || !selectedNode) return;

    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onUpdateNode(selectedNode.id, { [field]: value });
  };

  // Handle property changes
  const handlePropertyChange = (key: string, value: any) => {
    if (!localData || !selectedNode) return;

    const updatedProperties = { ...localData.properties, [key]: value };
    const updatedData = { ...localData, properties: updatedProperties };
    setLocalData(updatedData);
    onUpdateNode(selectedNode.id, { properties: updatedProperties });
  };

  // Add custom property
  const addCustomProperty = () => {
    if (!customProperty.key || !customProperty.value || !localData || !selectedNode) return;

    const updatedProperties = {
      ...localData.properties,
      [customProperty.key]: customProperty.value,
    };
    const updatedData = { ...localData, properties: updatedProperties };
    setLocalData(updatedData);
    onUpdateNode(selectedNode.id, { properties: updatedProperties });
    setCustomProperty({ key: '', value: '' });
  };

  // Remove property
  const removeProperty = (key: string) => {
    if (!localData || !selectedNode) return;

    const updatedProperties = { ...localData.properties };
    delete updatedProperties[key];
    const updatedData = { ...localData, properties: updatedProperties };
    setLocalData(updatedData);
    onUpdateNode(selectedNode.id, { properties: updatedProperties });
  };

  if (!localData || !selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 shadow-lg">
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-lg font-medium">No Node Selected</div>
          <div className="text-sm mt-2">Click on a node to edit its properties</div>
        </div>
      </div>
    );
  }

  // Predefined colors and icons
  const predefinedColors = [
    '#4ade80', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#10b981', '#f97316', '#ec4899', '#64748b'
  ];

  const predefinedIcons = [
    '📋', '⚙️', '🔀', '🏁', '▶️', '⏸️', '⏹️', '🔄', '📊', '💾',
    '📂', '🔍', '📧', '🔔', '⚡', '🛠️', '📈', '🎯', '🔒', '🌟'
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Node Properties</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close Panel"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          ID: {selectedNode.id}
        </div>
      </div>

      {/* Properties Form */}
      <div className="p-4 space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Properties
          </h4>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={localData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter node label"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={localData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleInputChange('color', color)}
                  className={`w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform ${
                    localData.color === color ? 'border-gray-900' : 'border-gray-300'
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              placeholder="#000000"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleInputChange('icon', icon)}
                  className={`w-8 h-8 rounded-md border hover:bg-gray-100 text-lg transition-colors ${
                    localData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  title={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={localData.icon || ''}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter icon or emoji"
            />
          </div>
        </div>

        {/* Custom Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
            Custom Properties
          </h4>

          {/* Existing Properties */}
          {localData.properties && Object.entries(localData.properties).length > 0 && (
            <div className="space-y-2">
              {Object.entries(localData.properties).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs flex-1"
                    />
                  </div>
                  <button
                    onClick={() => removeProperty(key)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Remove property"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Property */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Add Property</div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customProperty.key}
                onChange={(e) => setCustomProperty({ ...customProperty, key: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                placeholder="Key"
              />
              <input
                type="text"
                value={customProperty.value}
                onChange={(e) => setCustomProperty({ ...customProperty, value: e.target.value })}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                placeholder="Value"
              />
              <button
                onClick={addCustomProperty}
                disabled={!customProperty.key || !customProperty.value}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Node Info */}
        <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <div><strong>Position:</strong> ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</div>
          <div><strong>Type:</strong> {selectedNode.type}</div>
          <div><strong>Selected:</strong> {selectedNode.selected ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
}
