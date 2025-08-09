import React, { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { IconChevronRight, IconPlus, IconTrash, IconFile, IconLink } from '@tabler/icons-react';

interface ExplorerPanelProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onNodeSelect: (node: Node) => void;
  onNodeDelete: (nodeId: string) => void;
  onAddNode: () => void;
}

export function ExplorerPanel({
  nodes,
  edges,
  selectedNode,
  onNodeSelect,
  onNodeDelete,
  onAddNode,
}: ExplorerPanelProps) {
  const [isNodesOpen, setIsNodesOpen] = useState(true);
  const [isEdgesOpen, setIsEdgesOpen] = useState(false);

  return (
    <div className="p-2 text-sm">
      <div className="mb-2">
        <button
          onClick={onAddNode}
          className="w-full btn btn-sm btn-primary"
        >
          <IconPlus size={16} className="mr-1" />
          Add New Node
        </button>
      </div>
      
      {/* Nodes Section */}
      <div>
        <button
          onClick={() => setIsNodesOpen(!isNodesOpen)}
          className="w-full flex items-center justify-between text-left font-semibold py-1"
        >
          <span>Nodes ({nodes.length})</span>
          <IconChevronRight
            size={16}
            className={`transform transition-transform ${isNodesOpen ? 'rotate-90' : ''}`}
          />
        </button>
        {isNodesOpen && (
          <div className="pl-2 border-l border-border ml-2">
            {nodes.length > 0 ? (
              nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => onNodeSelect(node)}
                  className={`flex items-center justify-between p-1 rounded cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center">
                    <IconFile size={14} className="mr-2" />
                    <span>{node.data.label || 'Untitled Node'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeDelete(node.id);
                    }}
                    className="btn btn-xs btn-ghost text-muted hover:text-destructive"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted text-xs p-1">No nodes yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Edges Section */}
      <div className="mt-2">
        <button
          onClick={() => setIsEdgesOpen(!isEdgesOpen)}
          className="w-full flex items-center justify-between text-left font-semibold py-1"
        >
          <span>Edges ({edges.length})</span>
          <IconChevronRight
            size={16}
            className={`transform transition-transform ${isEdgesOpen ? 'rotate-90' : ''}`}
          />
        </button>
        {isEdgesOpen && (
          <div className="pl-2 border-l border-border ml-2">
            {edges.length > 0 ? (
              edges.map((edge) => (
                <div
                  key={edge.id}
                  className="flex items-center p-1"
                >
                  <IconLink size={14} className="mr-2" />
                  <span>{edge.id}</span>
                </div>
              ))
            ) : (
              <p className="text-muted text-xs p-1">No edges yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface OutlinePanelProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node) => void;
  onFitView: () => void;
}

export function OutlinePanel({ nodes, onNodeSelect, onFitView }: OutlinePanelProps) {
  return (
    <div className="p-2 text-sm">
      <button onClick={onFitView} className="w-full btn btn-sm btn-outline mb-2">
        Fit View
      </button>
      <ul className="space-y-1">
        {nodes.map((node) => (
          <li
            key={node.id}
            onClick={() => onNodeSelect(node)}
            className="p-1 rounded cursor-pointer hover:bg-muted"
          >
            {node.data.label || 'Untitled Node'}
          </li>
        ))}
      </ul>
    </div>
  );
}
