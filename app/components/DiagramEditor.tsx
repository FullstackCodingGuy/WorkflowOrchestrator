'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  ConnectionMode,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Import custom components - will be created below
import { AnimatedSVGEdge } from './AnimatedSVGEdge';
import { CustomNode } from './CustomNode';
import { DiagramToolbar } from './DiagramToolbar';
import { NodePropertiesPanel } from './NodePropertiesPanel';

// Types
export interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  properties?: Record<string, any>;
}

export type DiagramNode = Node<DiagramNodeData>;

export interface DiagramEdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  strokeWidth?: number;
}

export type DiagramEdge = Edge<DiagramEdgeData>;

// Initial nodes with different types and styles
const initialNodes: DiagramNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      label: 'Start Node',
      description: 'This is the starting point',
      color: '#4ade80',
      icon: '▶️',
      properties: { priority: 'high' }
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      label: 'Process Node',
      description: 'Processing step',
      color: '#3b82f6',
      icon: '⚙️',
      properties: { duration: '2 minutes' }
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 500, y: 100 },
    data: {
      label: 'Decision Node',
      description: 'Decision point',
      color: '#f59e0b',
      icon: '🔀',
      properties: { condition: 'if x > 10' }
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 700, y: 200 },
    data: {
      label: 'End Node',
      description: 'Completion point',
      color: '#ef4444',
      icon: '🏁',
      properties: { result: 'success' }
    },
  },
];

// Edge types configuration
const edgeTypes: EdgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

// Node types configuration
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Initial edges with different styles
const initialEdges: DiagramEdge[] = [
  {
    id: '1->2',
    type: 'animatedSvg',
    source: '1',
    target: '2',
    data: { label: 'Next', animated: true, color: '#4ade80' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4ade80' },
  },
  {
    id: '2->3',
    type: 'animatedSvg',
    source: '2',
    target: '3',
    data: { label: 'Process', animated: true, color: '#3b82f6' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
  },
  {
    id: '3->4',
    type: 'animatedSvg',
    source: '3',
    target: '4',
    data: { label: 'Complete', animated: true, color: '#f59e0b' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
  },
];

// Connection line style
const connectionLineStyle = {
  strokeWidth: 2,
  stroke: '#64748b',
};

// Default edge options
const defaultEdgeOptions = {
  style: { strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed },
};

export default function DiagramEditor() {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Connection handler
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      const newEdge: DiagramEdge = {
        ...params,
        id: `${params.source}->${params.target}`,
        source: params.source,
        target: params.target,
        type: isAnimationEnabled ? 'animatedSvg' : 'smoothstep',
        data: {
          animated: isAnimationEnabled,
          color: '#64748b',
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, isAnimationEnabled]
  );

  // Node click handler
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node as DiagramNode);
      setShowPropertiesPanel(true);
    },
    []
  );

  // Pane click handler (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, []);

  // Add new node
  const addNewNode = useCallback(
    (type: string = 'custom') => {
      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      // Position new node in the center of the viewport
      const position = reactFlowInstance.project({
        x: reactFlowBounds.width / 2,
        y: reactFlowBounds.height / 2,
      });

      const newNode: DiagramNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: {
          label: `New Node ${nodes.length + 1}`,
          description: 'Click to edit',
          color: '#64748b',
          icon: '📋',
          properties: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes.length, setNodes]
  );

  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
    );
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, [selectedNode, setNodes, setEdges]);

  // Update node properties
  const updateNodeProperties = useCallback(
    (nodeId: string, updates: Partial<DiagramNode['data']>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Toggle animation for all edges
  const toggleAllEdgesAnimation = useCallback(
    (enabled: boolean) => {
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          type: enabled ? 'animatedSvg' : 'smoothstep',
          data: {
            ...edge.data,
            animated: enabled,
          },
        }))
      );
    },
    [setEdges]
  );

  // Enhanced animation toggle handler
  const handleAnimationToggle = useCallback(
    (enabled: boolean) => {
      setIsAnimationEnabled(enabled);
      toggleAllEdgesAnimation(enabled);
    },
    [toggleAllEdgesAnimation]
  );

  // Fit view to all nodes
  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 500 });
    }
  }, [reactFlowInstance]);

  // Clear all nodes and edges
  const clearDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, [setNodes, setEdges]);

  // Save diagram to localStorage
  const saveDiagram = useCallback(() => {
    const diagramData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('diagram-editor-data', JSON.stringify(diagramData));
    alert('Diagram saved successfully!');
  }, [nodes, edges]);

  // Load diagram from localStorage
  const loadDiagram = useCallback(() => {
    try {
      const savedData = localStorage.getItem('diagram-editor-data');
      if (savedData) {
        const diagramData = JSON.parse(savedData);
        setNodes(diagramData.nodes || []);
        setEdges(diagramData.edges || []);
        alert('Diagram loaded successfully!');
      } else {
        alert('No saved diagram found!');
      }
    } catch (error) {
      alert('Error loading diagram!');
      console.error('Load error:', error);
    }
  }, [setNodes, setEdges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            saveDiagram();
            break;
          case 'o':
            event.preventDefault();
            loadDiagram();
            break;
          case 'n':
            event.preventDefault();
            addNewNode();
            break;
          case 'f':
            event.preventDefault();
            fitView();
            break;
        }
      }
      if (event.key === 'Delete' && selectedNode) {
        deleteSelectedNode();
      }
      if (event.key === 'Escape') {
        setSelectedNode(null);
        setShowPropertiesPanel(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveDiagram, loadDiagram, addNewNode, fitView, deleteSelectedNode, selectedNode]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <DiagramToolbar
        onAddNode={addNewNode}
        onDeleteNode={deleteSelectedNode}
        onFitView={fitView}
        onClear={clearDiagram}
        onSave={saveDiagram}
        onLoad={loadDiagram}
        selectedNode={selectedNode}
        backgroundVariant={backgroundVariant}
        onBackgroundVariantChange={setBackgroundVariant}
        isAnimationEnabled={isAnimationEnabled}
        onAnimationToggle={handleAnimationToggle}
        onTogglePropertiesPanel={() => setShowPropertiesPanel(!showPropertiesPanel)}
        showPropertiesPanel={showPropertiesPanel}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* ReactFlow Canvas */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            showPropertiesPanel ? 'mr-80' : 'mr-0'
          }`} 
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            connectionMode={ConnectionMode.Loose}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={defaultEdgeOptions}
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView
            attributionPosition="bottom-left"
            className="bg-white"
          >
            <Controls 
              position="bottom-right"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <MiniMap 
              position="top-right"
              nodeStrokeColor="#64748b"
              nodeColor={(node: Node) => (node.data as any).color || '#64748b'}
              nodeBorderRadius={8}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            />
            <Background 
              variant={backgroundVariant}
              gap={20}
              size={1}
              color="#e2e8f0"
            />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        {showPropertiesPanel && (
          <NodePropertiesPanel
            selectedNode={selectedNode}
            onUpdateNode={updateNodeProperties}
            onClose={() => setShowPropertiesPanel(false)}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Nodes: {nodes.length}</span>
          <span>Edges: {edges.length}</span>
          {selectedNode && <span>Selected: {selectedNode.data.label}</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span>Ctrl+N: New Node</span>
          <span>Ctrl+S: Save</span>
          <span>Ctrl+F: Fit View</span>
          <span>Del: Delete</span>
        </div>
      </div>
    </div>
  );
}
