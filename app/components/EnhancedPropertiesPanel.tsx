'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Node, Edge } from 'reactflow';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from './Icons';
import { WorkflowNodeType, DiagramNodeData, DiagramEdgeData } from './DiagramEditor';

interface EnhancedPropertiesPanelProps {
  selectedNode: Node<DiagramNodeData> | null;
  selectedEdge: Edge<DiagramEdgeData> | null;
  onNodeUpdate: (nodeId: string, updates: Partial<DiagramNodeData>) => void;
  onEdgeUpdate: (edgeId: string, updates: Partial<DiagramEdgeData>) => void;
  onPositionUpdate: (nodeId: string, position: { x: number; y: number }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface NodeFormData extends DiagramNodeData {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface EdgeFormData extends DiagramEdgeData {
  id: string;
  type: string;
  source: string;
  target: string;
}

type TabType = 'overview' | 'properties' | 'appearance' | 'advanced';

interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
  description: string;
}

export default function EnhancedPropertiesPanel({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
  onPositionUpdate,
  isOpen,
  onToggle,
}: EnhancedPropertiesPanelProps) {
  const [nodeFormData, setNodeFormData] = useState<NodeFormData | null>(null);
  const [edgeFormData, setEdgeFormData] = useState<EdgeFormData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [panelWidth, setPanelWidth] = useState(384); // Default width
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    appearance: false,
    position: false,
    advanced: false,
    metadata: false,
  });

  // Tab configurations
  const tabs: TabConfig[] = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: '📋', description: 'Essential properties and quick actions' },
    { id: 'properties', label: 'Properties', icon: '🏷️', description: 'Data and custom properties' },
    { id: 'appearance', label: 'Style', icon: '🎨', description: 'Visual appearance and colors' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️', description: 'Position, size, and metadata' },
  ], []);

  // Responsive width management
  const handleWidthChange = useCallback((newWidth: number) => {
    const minWidth = 280;
    const maxWidth = 480;
    setPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  }, []);

  // Toggle compact mode
  const toggleCompactMode = useCallback(() => {
    setIsCompactMode(prev => !prev);
    if (!isCompactMode) {
      setPanelWidth(320); // Smaller width for compact mode
    } else {
      setPanelWidth(384); // Default width
    }
  }, [isCompactMode]);

  // Update form data when selection changes
  useEffect(() => {
    if (selectedNode) {
      setNodeFormData({
        id: selectedNode.id,
        type: selectedNode.type || 'custom',
        x: selectedNode.position?.x || 0,
        y: selectedNode.position?.y || 0,
        width: selectedNode.width || undefined,
        height: selectedNode.height || undefined,
        label: selectedNode.data.label || '',
        description: selectedNode.data.description || '',
        color: selectedNode.data.color || '#64748b',
        icon: selectedNode.data.icon || '📋',
        nodeType: selectedNode.data.nodeType || 'custom',
        properties: selectedNode.data.properties || {},
        isExecuting: selectedNode.data.isExecuting || false,
      });
      setEdgeFormData(null);
      setActiveTab('overview'); // Reset to overview tab
    } else if (selectedEdge) {
      setEdgeFormData({
        id: selectedEdge.id,
        type: selectedEdge.type || 'default',
        source: selectedEdge.source,
        target: selectedEdge.target,
        label: selectedEdge.data?.label || '',
        animated: selectedEdge.data?.animated || false,
        color: selectedEdge.data?.color || '#64748b',
        strokeWidth: selectedEdge.data?.strokeWidth || 2,
        strokeStyle: selectedEdge.data?.strokeStyle || 'solid',
        animationSpeed: selectedEdge.data?.animationSpeed || 'normal',
        markerEnd: selectedEdge.data?.markerEnd || 'arrow',
        edgeType: selectedEdge.data?.edgeType || 'default',
      });
      setNodeFormData(null);
      setActiveTab('overview'); // Reset to overview tab
    } else {
      setNodeFormData(null);
      setEdgeFormData(null);
    }
  }, [selectedNode, selectedEdge]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleNodeFieldChange = useCallback((field: keyof NodeFormData, value: string | number | boolean | WorkflowNodeType | Record<string, unknown> | undefined) => {
    if (!nodeFormData) return;

    const updatedData = { ...nodeFormData, [field]: value };
    setNodeFormData(updatedData);

    // Handle position updates separately
    if (field === 'x' || field === 'y') {
      const newPosition = {
        x: field === 'x' ? (value as number) : updatedData.x,
        y: field === 'y' ? (value as number) : updatedData.y,
      };
      onPositionUpdate(updatedData.id, newPosition);
    } else if (field !== 'id' && field !== 'type' && field !== 'width' && field !== 'height') {
      // Update node data for all other fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, type, x, y, width, height, ...nodeDataFields } = updatedData;
      onNodeUpdate(updatedData.id, nodeDataFields);
    }
  }, [nodeFormData, onNodeUpdate, onPositionUpdate]);

  const handleEdgeFieldChange = useCallback((field: keyof EdgeFormData, value: string | number | boolean) => {
    if (!edgeFormData) return;

    const updatedData = { ...edgeFormData, [field]: value };
    setEdgeFormData(updatedData);

    if (field !== 'id' && field !== 'type' && field !== 'source' && field !== 'target') {
      // Update edge data for editable fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, type: _type, source: _source, target: _target, ...edgeDataFields } = updatedData;
      onEdgeUpdate(updatedData.id, edgeDataFields);
    }
  }, [edgeFormData, onEdgeUpdate]);

  const handleCustomPropertyChange = useCallback((key: string, value: string) => {
    if (!nodeFormData) return;

    const updatedProperties = { ...nodeFormData.properties, [key]: value };
    const updatedData = { ...nodeFormData, properties: updatedProperties };
    setNodeFormData(updatedData);

    onNodeUpdate(nodeFormData.id, { properties: updatedProperties });
  }, [nodeFormData, onNodeUpdate]);

  const removeCustomProperty = useCallback((key: string) => {
    if (!nodeFormData) return;

    const updatedProperties = { ...nodeFormData.properties };
    delete updatedProperties[key];
    const updatedData = { ...nodeFormData, properties: updatedProperties };
    setNodeFormData(updatedData);

    onNodeUpdate(nodeFormData.id, { properties: updatedProperties });
  }, [nodeFormData, onNodeUpdate]);

  const addCustomProperty = useCallback(() => {
    if (!nodeFormData) return;

    const key = `property_${Date.now()}`;
    const updatedProperties = { ...nodeFormData.properties, [key]: '' };
    const updatedData = { ...nodeFormData, properties: updatedProperties };
    setNodeFormData(updatedData);

    onNodeUpdate(nodeFormData.id, { properties: updatedProperties });
  }, [nodeFormData, onNodeUpdate]);

  // Common styles with responsive adjustments
  const inputClassName = useMemo(() => 
    `w-full px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
      isCompactMode ? 'text-xs px-1.5 py-1' : ''
    }`, [isCompactMode]);
  
  const labelClassName = useMemo(() => 
    `block font-medium mb-1 text-slate-700 ${
      isCompactMode ? 'text-xs mb-0.5' : 'text-sm'
    }`, [isCompactMode]);
  
  const sectionClassName = useMemo(() => 
    `mb-3 bg-white rounded-lg border border-slate-100 overflow-hidden ${
      isCompactMode ? 'mb-2' : 'shadow-sm'
    }`, [isCompactMode]);

  const sectionHeaderClassName = useMemo(() => 
    `flex items-center justify-between cursor-pointer p-2 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100 ${
      isCompactMode ? 'p-1.5' : ''
    }`, [isCompactMode]);

  if (!isOpen) {
    return (
      <div className="w-12 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 flex flex-col items-center pt-4 shadow-sm">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="Open Properties Panel"
        >
          <ChevronRightIcon className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    );
  }

  const SectionHeader = ({ title, section, icon }: { title: string; section: keyof typeof expandedSections; icon: string }) => (
    <div className={sectionHeaderClassName} onClick={() => toggleSection(section)}>
      <div className="flex items-center gap-2">
        <span className={isCompactMode ? 'text-sm' : 'text-base'}>{icon}</span>
        <h4 className={`font-medium text-slate-800 ${isCompactMode ? 'text-sm' : 'text-base'}`}>{title}</h4>
      </div>
      {expandedSections[section] ? (
        <ChevronUpIcon className="w-4 h-4 text-slate-500" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 text-slate-500" />
      )}
    </div>
  );

  // Tab Content Components
  const OverviewTab = () => {
    if (nodeFormData) {
      return (
        <div className="space-y-3">
          <div className={sectionClassName}>
            <div className={`p-3 ${isCompactMode ? 'p-2' : ''}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelClassName}>Display Label</label>
                  <input
                    type="text"
                    value={nodeFormData.label}
                    onChange={(e) => handleNodeFieldChange('label', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter node display label"
                  />
                </div>
                <div>
                  <label className={labelClassName}>Description</label>
                  <textarea
                    value={nodeFormData.description || ''}
                    onChange={(e) => handleNodeFieldChange('description', e.target.value)}
                    className={`${inputClassName} h-16 resize-none`}
                    placeholder="Enter detailed description"
                  />
                </div>
                <div>
                  <label className={labelClassName}>Node Type</label>
                  <select
                    value={nodeFormData.nodeType}
                    onChange={(e) => handleNodeFieldChange('nodeType', e.target.value as WorkflowNodeType)}
                    className={inputClassName}
                  >
                    <option value="start">🚀 Start</option>
                    <option value="process">⚙️ Process</option>
                    <option value="action">⚡ Action</option>
                    <option value="decision">🔀 Decision</option>
                    <option value="condition">❓ Condition</option>
                    <option value="end">✅ End</option>
                    <option value="custom">✨ Custom</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClassName}>Icon</label>
                    <input
                      type="text"
                      value={nodeFormData.icon}
                      onChange={(e) => handleNodeFieldChange('icon', e.target.value)}
                      className={inputClassName}
                      placeholder="🚀"
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Color</label>
                    <input
                      type="color"
                      value={nodeFormData.color}
                      onChange={(e) => handleNodeFieldChange('color', e.target.value)}
                      className="w-full h-8 rounded-md border border-slate-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (edgeFormData) {
      return (
        <div className="space-y-3">
          <div className={sectionClassName}>
            <div className={`p-3 ${isCompactMode ? 'p-2' : ''}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelClassName}>Edge Label</label>
                  <input
                    type="text"
                    value={edgeFormData.label || ''}
                    onChange={(e) => handleEdgeFieldChange('label', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter edge label"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClassName}>Color</label>
                    <input
                      type="color"
                      value={edgeFormData.color}
                      onChange={(e) => handleEdgeFieldChange('color', e.target.value)}
                      className="w-full h-8 rounded-md border border-slate-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Width</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={edgeFormData.strokeWidth}
                      onChange={(e) => handleEdgeFieldChange('strokeWidth', parseInt(e.target.value) || 2)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="animated"
                    checked={edgeFormData.animated}
                    onChange={(e) => handleEdgeFieldChange('animated', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="animated" className="text-sm font-medium text-slate-700">
                    Animated
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const PropertiesTab = () => {
    if (!nodeFormData) return null;

    return (
      <div className="space-y-3">
        <div className={sectionClassName}>
          <div className={`p-3 ${isCompactMode ? 'p-2' : ''}`}>
            <div className="space-y-3">
              <div>
                <label className={labelClassName}>Description</label>
                <textarea
                  value={nodeFormData.description || ''}
                  onChange={(e) => handleNodeFieldChange('description', e.target.value)}
                  className={`${inputClassName} h-16 resize-none`}
                  placeholder="Enter detailed description"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom Properties */}
        <div className={sectionClassName}>
          <SectionHeader title="Custom Properties" section="advanced" icon="🔧" />
          {expandedSections.advanced && (
            <div className={`p-3 space-y-2 ${isCompactMode ? 'p-2' : ''}`}>
              {Object.entries(nodeFormData.properties || {}).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const updatedProperties = { ...nodeFormData.properties };
                      delete updatedProperties[key];
                      updatedProperties[newKey] = value;
                      handleNodeFieldChange('properties', updatedProperties);
                    }}
                    className={`${inputClassName} flex-1`}
                    placeholder="Property name"
                  />
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleCustomPropertyChange(key, e.target.value)}
                    className={`${inputClassName} flex-1`}
                    placeholder="Property value"
                  />
                  <button
                    onClick={() => removeCustomProperty(key)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors text-xs"
                    title="Remove property"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={addCustomProperty}
                className={`w-full py-1.5 px-3 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium ${
                  isCompactMode ? 'text-xs py-1' : 'text-sm'
                }`}
              >
                + Add Property
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AppearanceTab = () => {
    if (nodeFormData) {
      return (
        <div className="space-y-3">
          <div className={sectionClassName}>
            <div className={`p-3 ${isCompactMode ? 'p-2' : ''}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelClassName}>Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={nodeFormData.color}
                      onChange={(e) => handleNodeFieldChange('color', e.target.value)}
                      className="w-12 h-8 rounded-md border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={nodeFormData.color}
                      onChange={(e) => handleNodeFieldChange('color', e.target.value)}
                      className={`${inputClassName} flex-1`}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>Icon</label>
                  <input
                    type="text"
                    value={nodeFormData.icon}
                    onChange={(e) => handleNodeFieldChange('icon', e.target.value)}
                    className={inputClassName}
                    placeholder="🚀"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isExecuting"
                    checked={nodeFormData.isExecuting}
                    onChange={(e) => handleNodeFieldChange('isExecuting', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isExecuting" className="text-sm font-medium text-slate-700">
                    Show as executing
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (edgeFormData) {
      return (
        <div className="space-y-3">
          <div className={sectionClassName}>
            <div className={`p-3 ${isCompactMode ? 'p-2' : ''}`}>
              <div className="space-y-3">
                <div>
                  <label className={labelClassName}>Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={edgeFormData.color}
                      onChange={(e) => handleEdgeFieldChange('color', e.target.value)}
                      className="w-12 h-8 rounded-md border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={edgeFormData.color}
                      onChange={(e) => handleEdgeFieldChange('color', e.target.value)}
                      className={`${inputClassName} flex-1`}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClassName}>Stroke Width</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={edgeFormData.strokeWidth}
                      onChange={(e) => handleEdgeFieldChange('strokeWidth', parseInt(e.target.value) || 2)}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Stroke Style</label>
                    <select
                      value={edgeFormData.strokeStyle}
                      onChange={(e) => handleEdgeFieldChange('strokeStyle', e.target.value)}
                      className={inputClassName}
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>Marker End</label>
                  <select
                    value={edgeFormData.markerEnd}
                    onChange={(e) => handleEdgeFieldChange('markerEnd', e.target.value)}
                    className={inputClassName}
                  >
                    <option value="arrow">Arrow</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="animated-appearance"
                    checked={edgeFormData.animated}
                    onChange={(e) => handleEdgeFieldChange('animated', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="animated-appearance" className="text-sm font-medium text-slate-700">
                    Enable animation
                  </label>
                </div>
                {edgeFormData.animated && (
                  <div>
                    <label className={labelClassName}>Animation Speed</label>
                    <select
                      value={edgeFormData.animationSpeed}
                      onChange={(e) => handleEdgeFieldChange('animationSpeed', e.target.value)}
                      className={inputClassName}
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const AdvancedTab = () => {
    if (nodeFormData) {
      return (
        <div className="space-y-3">
          {/* Position & Size */}
          <div className={sectionClassName}>
            <SectionHeader title="Position & Size" section="position" icon="📏" />
            {expandedSections.position && (
              <div className={`p-3 space-y-3 ${isCompactMode ? 'p-2' : ''}`}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClassName}>X Position</label>
                    <input
                      type="number"
                      value={nodeFormData.x}
                      onChange={(e) => handleNodeFieldChange('x', parseInt(e.target.value) || 0)}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Y Position</label>
                    <input
                      type="number"
                      value={nodeFormData.y}
                      onChange={(e) => handleNodeFieldChange('y', parseInt(e.target.value) || 0)}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClassName}>Width</label>
                    <input
                      type="number"
                      value={nodeFormData.width || ''}
                      onChange={(e) => handleNodeFieldChange('width', parseInt(e.target.value) || 0)}
                      className={inputClassName}
                      placeholder="Auto"
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Height</label>
                    <input
                      type="number"
                      value={nodeFormData.height || ''}
                      onChange={(e) => handleNodeFieldChange('height', parseInt(e.target.value) || 0)}
                      className={inputClassName}
                      placeholder="Auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={sectionClassName}>
            <SectionHeader title="Metadata" section="metadata" icon="ℹ️" />
            {expandedSections.metadata && (
              <div className={`p-3 space-y-3 ${isCompactMode ? 'p-2' : ''}`}>
                <div>
                  <label className={labelClassName}>Node ID</label>
                  <input
                    type="text"
                    value={nodeFormData.id}
                    disabled
                    className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label className={labelClassName}>React Flow Type</label>
                  <input
                    type="text"
                    value={nodeFormData.type}
                    disabled
                    className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (edgeFormData) {
      return (
        <div className="space-y-3">
          {/* Edge Metadata */}
          <div className={sectionClassName}>
            <SectionHeader title="Metadata" section="metadata" icon="ℹ️" />
            {expandedSections.metadata && (
              <div className={`p-3 space-y-3 ${isCompactMode ? 'p-2' : ''}`}>
                <div>
                  <label className={labelClassName}>Edge ID</label>
                  <input
                    type="text"
                    value={edgeFormData.id}
                    disabled
                    className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Source Node</label>
                  <input
                    type="text"
                    value={edgeFormData.source}
                    disabled
                    className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
                <div>
                  <label className={labelClassName}>Target Node</label>
                  <input
                    type="text"
                    value={edgeFormData.target}
                    disabled
                    className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'properties':
        return <PropertiesTab />;
      case 'appearance':
        return <AppearanceTab />;
      case 'advanced':
        return <AdvancedTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div 
      className="bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-lg overflow-hidden flex flex-col"
      style={{ width: `${panelWidth}px` }}
    >
      {/* Header */}
      <div className={`bg-white border-b border-slate-200 flex-shrink-0 ${isCompactMode ? 'px-3 py-2' : 'px-4 py-3'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-slate-800 flex items-center gap-2 ${isCompactMode ? 'text-base' : 'text-lg'}`}>
              <span className={isCompactMode ? 'text-lg' : 'text-xl'}>⚙️</span>
              Properties
            </h3>
            <button
              onClick={toggleCompactMode}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
              title={isCompactMode ? "Expand view" : "Compact view"}
            >
              <span className="text-xs">{isCompactMode ? '🔍' : '📋'}</span>
            </button>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="Close Properties Panel"
          >
            <ChevronRightIcon className="w-4 h-4 text-slate-600 rotate-180" />
          </button>
        </div>
        
        {/* Selection Info */}
        {selectedNode && (
          <div className={`text-slate-600 mt-2 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>
            <div className="truncate">
              <span className="font-medium text-indigo-600">{selectedNode.data.label || 'Untitled Node'}</span>
            </div>
            <div className={`text-slate-500 mt-0.5 ${isCompactMode ? 'text-xs' : 'text-xs'}`}>
              {selectedNode.data.nodeType || 'custom'} • {selectedNode.id}
            </div>
          </div>
        )}
        {selectedEdge && (
          <div className={`text-slate-600 mt-2 ${isCompactMode ? 'text-xs' : 'text-sm'}`}>
            <div className="truncate">
              <span className="font-medium text-indigo-600">{selectedEdge.data?.label || 'Untitled Edge'}</span>
            </div>
            <div className={`text-slate-500 mt-0.5 ${isCompactMode ? 'text-xs' : 'text-xs'}`}>
              {selectedEdge.source} → {selectedEdge.target}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      {(nodeFormData || edgeFormData) && (
        <div className="bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-2 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                } ${isCompactMode ? 'px-1 py-1.5' : ''}`}
                title={tab.description}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={isCompactMode ? 'text-xs' : 'text-sm'}>{tab.icon}</span>
                  {!isCompactMode && <span>{tab.label}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {(nodeFormData || edgeFormData) ? (
          <div className={`${isCompactMode ? 'p-2' : 'p-3'}`}>
            {renderTabContent()}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-base font-medium text-slate-800 mb-2">No Selection</h3>
              <p className="text-sm text-slate-600">
                Select a node or edge to edit its properties
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 left-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-indigo-200 transition-colors"
        onMouseDown={(e) => {
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = panelWidth;

          const handleMouseMove = (e: MouseEvent) => {
            const deltaX = startX - e.clientX;
            handleWidthChange(startWidth + deltaX);
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
        title="Drag to resize"
      />
    </div>
  );
}
