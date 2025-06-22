'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    appearance: true,
    position: false,
    advanced: false,
    metadata: false,
  });

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

  // Common styles
  const inputClassName = "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200";
  const labelClassName = "block text-sm font-semibold mb-2 text-slate-700";
  const sectionClassName = "mb-6 bg-white rounded-xl p-4 shadow-sm border border-slate-100";
  const sectionHeaderClassName = "flex items-center justify-between cursor-pointer mb-3 p-2 rounded-lg hover:bg-slate-50 transition-colors";

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
        <span className="text-lg">{icon}</span>
        <h4 className="font-semibold text-slate-800">{title}</h4>
      </div>
      {expandedSections[section] ? (
        <ChevronUpIcon className="w-4 h-4 text-slate-500" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 text-slate-500" />
      )}
    </div>
  );

  return (
    <div className="w-96 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-lg overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            Properties
          </h3>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Close Properties Panel"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-600 rotate-180" />
          </button>
        </div>
        {selectedNode && (
          <div className="text-sm text-slate-600 mt-2">
            <div>
              <span className="font-semibold text-indigo-600">&ldquo;{selectedNode.data.label || 'Untitled Node'}&rdquo;</span>
            </div>
            <div className="text-xs mt-1">
              ID: <span className="font-mono text-slate-500">{selectedNode.id}</span> • 
              Type: <span className="font-medium">{selectedNode.data.nodeType || 'custom'}</span>
            </div>
          </div>
        )}
        {selectedEdge && (
          <div className="text-sm text-slate-600 mt-2">
            <div>
              <span className="font-semibold text-indigo-600">&ldquo;{selectedEdge.data?.label || 'Untitled Edge'}&rdquo;</span>
            </div>
            <div className="text-xs mt-1">
              ID: <span className="font-mono text-slate-500">{selectedEdge.id}</span> • 
              From: <span className="font-medium">{selectedEdge.source}</span> → 
              To: <span className="font-medium">{selectedEdge.target}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* NODE PROPERTIES */}
        {nodeFormData && (
          <>
            {/* Basic Properties */}
            <div className={sectionClassName}>
              <SectionHeader title="Basic Properties" section="basic" icon="📝" />
              {expandedSections.basic && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Display Label</label>
                    <input
                      type="text"
                      value={nodeFormData.label}
                      onChange={(e) => handleNodeFieldChange('label', e.target.value)}
                      className={inputClassName}
                      placeholder="Enter node display label"
                    />
                    <p className="text-xs text-slate-500 mt-1">This is the main label shown on the node</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Description</label>
                    <textarea
                      value={nodeFormData.description || ''}
                      onChange={(e) => handleNodeFieldChange('description', e.target.value)}
                      className={`${inputClassName} h-20 resize-none`}
                      placeholder="Enter detailed node description"
                    />
                    <p className="text-xs text-slate-500 mt-1">Additional context or help text for this node</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Node Type</label>
                    <select
                      value={nodeFormData.nodeType}
                      onChange={(e) => handleNodeFieldChange('nodeType', e.target.value as WorkflowNodeType)}
                      className={inputClassName}
                    >
                      <option value="start">Start</option>
                      <option value="process">Process</option>
                      <option value="action">Action</option>
                      <option value="decision">Decision</option>
                      <option value="condition">Condition</option>
                      <option value="end">End</option>
                      <option value="custom">Custom</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Defines the node&apos;s behavior and appearance</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Icon</label>
                    <input
                      type="text"
                      value={nodeFormData.icon}
                      onChange={(e) => handleNodeFieldChange('icon', e.target.value)}
                      className={inputClassName}
                      placeholder="Enter emoji or icon (e.g., 🚀, ⚙️, 🔀)"
                    />
                    <p className="text-xs text-slate-500 mt-1">Visual icon displayed on the node</p>
                  </div>
                </div>
              )}
            </div>

            {/* Appearance Properties */}
            <div className={sectionClassName}>
              <SectionHeader title="Appearance" section="appearance" icon="🎨" />
              {expandedSections.appearance && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={nodeFormData.color}
                        onChange={(e) => handleNodeFieldChange('color', e.target.value)}
                        className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
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
                  <div className="flex items-center gap-3">
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
              )}
            </div>

            {/* Position & Size */}
            <div className={sectionClassName}>
              <SectionHeader title="Position & Size" section="position" icon="📏" />
              {expandedSections.position && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
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
                  <div className="grid grid-cols-2 gap-3">
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

            {/* Custom Properties */}
            <div className={sectionClassName}>
              <SectionHeader title="Custom Properties" section="advanced" icon="🔧" />
              {expandedSections.advanced && (
                <div className="space-y-4">
                  {Object.entries(nodeFormData.properties || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
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
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove property"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCustomProperty}
                    className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                  >
                    + Add Custom Property
                  </button>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className={sectionClassName}>
              <SectionHeader title="Metadata" section="metadata" icon="ℹ️" />
              {expandedSections.metadata && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Node ID</label>
                    <input
                      type="text"
                      value={nodeFormData.id}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Unique identifier (read-only)</p>
                  </div>
                  <div>
                    <label className={labelClassName}>React Flow Type</label>
                    <input
                      type="text"
                      value={nodeFormData.type}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Component type used for rendering</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Current Display Label</label>
                    <input
                      type="text"
                      value={nodeFormData.label}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Current label (edit in Basic Properties)</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* EDGE PROPERTIES */}
        {edgeFormData && (
          <>
            {/* Basic Edge Properties */}
            <div className={sectionClassName}>
              <SectionHeader title="Basic Properties" section="basic" icon="📝" />
              {expandedSections.basic && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Edge Label</label>
                    <input
                      type="text"
                      value={edgeFormData.label || ''}
                      onChange={(e) => handleEdgeFieldChange('label', e.target.value)}
                      className={inputClassName}
                      placeholder="Enter edge label (e.g., &apos;Yes&apos;, &apos;No&apos;, &apos;Next&apos;)"
                    />
                    <p className="text-xs text-slate-500 mt-1">Text displayed along the edge connection</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Edge Type</label>
                    <select
                      value={edgeFormData.edgeType}
                      onChange={(e) => handleEdgeFieldChange('edgeType', e.target.value)}
                      className={inputClassName}
                    >
                      <option value="default">Default</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Defines the edge&apos;s visual style and meaning</p>
                  </div>
                </div>
              )}
            </div>

            {/* Edge Appearance */}
            <div className={sectionClassName}>
              <SectionHeader title="Appearance" section="appearance" icon="🎨" />
              {expandedSections.appearance && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={edgeFormData.color}
                        onChange={(e) => handleEdgeFieldChange('color', e.target.value)}
                        className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
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
                </div>
              )}
            </div>

            {/* Animation */}
            <div className={sectionClassName}>
              <SectionHeader title="Animation" section="advanced" icon="⚡" />
              {expandedSections.advanced && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="animated"
                      checked={edgeFormData.animated}
                      onChange={(e) => handleEdgeFieldChange('animated', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="animated" className="text-sm font-medium text-slate-700">
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
              )}
            </div>

            {/* Edge Metadata */}
            <div className={sectionClassName}>
              <SectionHeader title="Metadata" section="metadata" icon="ℹ️" />
              {expandedSections.metadata && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClassName}>Edge ID</label>
                    <input
                      type="text"
                      value={edgeFormData.id}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Unique identifier (read-only)</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Source Node</label>
                    <input
                      type="text"
                      value={edgeFormData.source}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Starting node of this connection</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Target Node</label>
                    <input
                      type="text"
                      value={edgeFormData.target}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Ending node of this connection</p>
                  </div>
                  <div>
                    <label className={labelClassName}>React Flow Type</label>
                    <input
                      type="text"
                      value={edgeFormData.type}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Component type used for rendering</p>
                  </div>
                  <div>
                    <label className={labelClassName}>Current Edge Label</label>
                    <input
                      type="text"
                      value={edgeFormData.label || '(no label)'}
                      disabled
                      className={`${inputClassName} bg-slate-50 text-slate-500 cursor-not-allowed`}
                    />
                    <p className="text-xs text-slate-500 mt-1">Current label (edit in Basic Properties)</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* No Selection State */}
        {!nodeFormData && !edgeFormData && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Selection</h3>
            <p className="text-slate-600">
              Select a node or edge to edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
