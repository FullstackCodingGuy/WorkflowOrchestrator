import React from 'react';
import { DiagramNode, DiagramEdge } from '../DiagramEditor';

interface ExplorerPanelProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  selectedNode: DiagramNode | null;
  onNodeSelect: (node: DiagramNode) => void;
  onNodeDelete: (nodeId: string) => void;
  onAddNode: () => void;
}

export function ExplorerPanel({ 
  nodes, 
  selectedNode, 
  onNodeSelect, 
  onNodeDelete, 
  onAddNode 
}: ExplorerPanelProps) {
  return (
    <div className="space-y-4">
      {/* Add Node Button */}
      <button
        onClick={onAddNode}
        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <span>➕</span>
        <span className="text-sm font-medium">Add Node</span>
      </button>

      {/* Nodes List */}
      <div className="space-y-1">
        {nodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-sm">No nodes in diagram</div>
          </div>
        ) : (
          nodes.map((node) => (
            <div
              key={node.id}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                ${selectedNode?.id === node.id 
                  ? 'bg-blue-100 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-100'
                }
              `}
              onClick={() => onNodeSelect(node)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className="text-sm">{node.data.icon || '📋'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {node.data.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {node.id}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeDelete(node.id);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete node"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface OutlinePanelProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  onNodeSelect: (node: DiagramNode) => void;
  onFitView: () => void;
}

export function OutlinePanel({ nodes, edges, onNodeSelect, onFitView }: OutlinePanelProps) {
  const nodesByType = nodes.reduce((acc, node) => {
    const type = node.type || 'default';
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {} as Record<string, DiagramNode[]>);

  return (
    <div className="space-y-4">
      {/* Fit View Button */}
      <button
        onClick={onFitView}
        className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        <span>🎯</span>
        <span className="text-sm font-medium">Fit View</span>
      </button>

      {/* Nodes by Type */}
      <div className="space-y-3">
        {Object.entries(nodesByType).map(([type, typeNodes]) => (
          <div key={type} className="space-y-1">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {type} ({typeNodes.length})
            </div>
            {typeNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => onNodeSelect(node)}
                className="w-full flex items-center space-x-2 p-1 text-left rounded hover:bg-gray-100 transition-colors"
              >
                <span className="text-xs">{node.data.icon || '📋'}</span>
                <span className="text-xs text-gray-700 truncate flex-1">
                  {node.data.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Nodes:</span>
            <span className="font-medium">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Edges:</span>
            <span className="font-medium">{edges.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Types:</span>
            <span className="font-medium">{Object.keys(nodesByType).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FileExplorerProps {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onExport?: () => void;
}

export function FileExplorer({ onSave, onLoad, onClear, onExport }: FileExplorerProps) {
  const recentFiles = [
    { name: 'Workflow_1.json', date: '2 hours ago', size: '12 KB' },
    { name: 'Process_Flow.json', date: '1 day ago', size: '8 KB' },
    { name: 'Decision_Tree.json', date: '3 days ago', size: '15 KB' },
  ];

  return (
    <div className="space-y-4">
      {/* File Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onSave}
          className="flex items-center justify-center space-x-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
        <button
          onClick={onLoad}
          className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <span>📂</span>
          <span>Load</span>
        </button>
        <button
          onClick={onClear}
          className="flex items-center justify-center space-x-1 py-2 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          <span>🗑️</span>
          <span>Clear</span>
        </button>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center justify-center space-x-1 py-2 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            <span>📤</span>
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Recent Files */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Recent Files
        </div>
        {recentFiles.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <span className="text-sm">📄</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {file.date} • {file.size}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
