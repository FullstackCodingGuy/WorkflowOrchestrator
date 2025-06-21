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

// Import side panel components
import { SidePanel, PanelToggleButton, PanelSection } from './SidePanel';
import { ExplorerPanel, OutlinePanel, FileExplorer } from './PanelContent';
import { PropertiesContent, SettingsContent, DiagramStatsContent } from './RightPanelContent';
import { EdgePropertiesPanel } from './EdgePropertiesPanel';

// Types
export interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  properties?: Record<string, unknown>;
  isExecuting?: boolean;
}

export type DiagramNode = Node<DiagramNodeData>;

export interface DiagramEdgeData {
  label?: string;
  animated?: boolean;
  color?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  markerEnd?: 'arrow' | 'none';
  edgeType?: string;
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
  const [selectedEdge, setSelectedEdge] = useState<DiagramEdge | null>(null);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Workflow state
  const [workflowState, setWorkflowState] = useState<'idle' | 'playing' | 'paused' | 'debugging'>('idle');
  const [workflowSequence, setWorkflowSequence] = useState<string[]>([]);
  const [workflowStep, setWorkflowStep] = useState(0);
  const workflowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Side panel states
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

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
      setSelectedEdge(null); // Clear edge selection
      setRightPanelOpen(true);
    },
    []
  );

  // Pane click handler (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setRightPanelOpen(false);
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
    setRightPanelOpen(false);
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
    setRightPanelOpen(false);
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
          case 'm':
            event.preventDefault();
            setShowMiniMap(!showMiniMap);
            break;
        }
      }
      if (event.key === 'Delete' && selectedNode) {
        deleteSelectedNode();
      }
      if (event.key === 'Escape') {
        setSelectedNode(null);
        setRightPanelOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveDiagram, loadDiagram, addNewNode, fitView, deleteSelectedNode, selectedNode, showMiniMap]);

  // Update edge properties
  const updateEdgeProperties = useCallback(
    (edgeId: string, updates: Partial<DiagramEdgeData | undefined>) => {
      if (!updates) return;
      
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? { 
                ...edge, 
                data: { ...edge.data, ...updates },
                // Handle edge type changes
                ...(updates.edgeType && updates.edgeType !== edge.type ? { type: updates.edgeType } : {})
              }
            : edge
        )
      );
    },
    [setEdges]
  );

  // Workflow handlers
  const buildWorkflowSequence = useCallback(() => {
    // Find the starting node (first node or node with no incoming edges)
    const startNode = nodes.find(node => 
      node.data.label.toLowerCase().includes('start') || 
      !edges.some(edge => edge.target === node.id)
    );
    
    if (!startNode) return [];
    
    const sequence: string[] = [];
    const visited = new Set<string>();
    
    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      sequence.push(nodeId);
      
      // Find all edges from this node
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => {
        if (edge.target) {
          traverse(edge.target);
        }
      });
    };
    
    traverse(startNode.id);
    return sequence;
  }, [nodes, edges]);

  const highlightNode = useCallback((nodeId: string | null) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isExecuting: node.id === nodeId,
        },
        style: node.id === nodeId ? {
          ...node.style,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          border: '2px solid #3b82f6',
          backgroundColor: '#eff6ff',
        } : {
          ...node.style,
          boxShadow: undefined,
          border: undefined,
          backgroundColor: undefined,
        },
      }))
    );
  }, [setNodes]);

  const animateEdge = useCallback((sourceId: string, targetId: string) => {
    const edgeId = `${sourceId}->${targetId}`;
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          animated: edge.id === edgeId ? true : edge.data?.animated || false,
        },
        className: edge.id === edgeId ? 'animate-pulse' : '',
      }))
    );

    // Reset edge animation after a delay
    setTimeout(() => {
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          className: '',
        }))
      );
    }, 2000);
  }, [setEdges]);

  const executeWorkflowStep = useCallback(async () => {
    if (workflowStep >= workflowSequence.length) {
      // Workflow completed
      setWorkflowState('idle');
      highlightNode(null);
      setWorkflowStep(0);
      return;
    }

    const currentNodeId = workflowSequence[workflowStep];
    highlightNode(currentNodeId);

    // Animate edges to next nodes
    const nextNodeId = workflowSequence[workflowStep + 1];
    if (nextNodeId) {
      animateEdge(currentNodeId, nextNodeId);
    }

    setWorkflowStep(prev => prev + 1);

    // Continue to next step if workflow is still playing
    if (workflowState === 'playing' || workflowState === 'debugging') {
      workflowTimerRef.current = setTimeout(() => {
        executeWorkflowStep();
      }, workflowState === 'debugging' ? 3000 : 1500); // Slower in debug mode
    }
  }, [workflowStep, workflowSequence, workflowState, highlightNode, animateEdge]);

  const handlePlayWorkflow = useCallback(() => {
    if (workflowState === 'paused') {
      // Resume from current step
      setWorkflowState('playing');
      executeWorkflowStep();
    } else {
      // Start new workflow
      const sequence = buildWorkflowSequence();
      if (sequence.length === 0) {
        alert('No workflow to execute. Please add nodes with connections.');
        return;
      }
      
      setWorkflowSequence(sequence);
      setWorkflowStep(0);
      setWorkflowState('playing');
      executeWorkflowStep();
    }
  }, [workflowState, buildWorkflowSequence, executeWorkflowStep]);

  const handlePauseWorkflow = useCallback(() => {
    setWorkflowState('paused');
    if (workflowTimerRef.current) {
      clearTimeout(workflowTimerRef.current);
      workflowTimerRef.current = null;
    }
  }, []);

  const handleRestartWorkflow = useCallback(() => {
    setWorkflowState('idle');
    setWorkflowStep(0);
    highlightNode(null);
    if (workflowTimerRef.current) {
      clearTimeout(workflowTimerRef.current);
      workflowTimerRef.current = null;
    }
  }, [highlightNode]);

  const handleDebugWorkflow = useCallback(() => {
    if (workflowState === 'debugging') {
      // Stop debugging
      setWorkflowState('idle');
      highlightNode(null);
      if (workflowTimerRef.current) {
        clearTimeout(workflowTimerRef.current);
        workflowTimerRef.current = null;
      }
    } else {
      // Start debugging
      const sequence = buildWorkflowSequence();
      if (sequence.length === 0) {
        alert('No workflow to debug. Please add nodes with connections.');
        return;
      }
      
      setWorkflowSequence(sequence);
      setWorkflowStep(0);
      setWorkflowState('debugging');
      executeWorkflowStep();
    }
  }, [workflowState, buildWorkflowSequence, executeWorkflowStep, highlightNode]);

  // Cleanup workflow timer on unmount
  useEffect(() => {
    return () => {
      if (workflowTimerRef.current) {
        clearTimeout(workflowTimerRef.current);
      }
    };
  }, []);

  // Configure left panel sections
  const leftPanelSections: PanelSection[] = [
    {
      id: 'explorer',
      title: 'Explorer',
      icon: '📁',
      defaultOpen: true,
      content: (
        <ExplorerPanel
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          onNodeSelect={(node) => {
            setSelectedNode(node);
            setRightPanelOpen(true);
          }}
          onNodeDelete={(nodeId) => {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) =>
              eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
            );
          }}
          onAddNode={addNewNode}
        />
      ),
    },
    {
      id: 'outline',
      title: 'Outline',
      icon: '📋',
      defaultOpen: false,
      content: (
        <OutlinePanel
          nodes={nodes}
          edges={edges}
          onNodeSelect={(node) => {
            setSelectedNode(node);
            setRightPanelOpen(true);
          }}
          onFitView={fitView}
        />
      ),
    },
    {
      id: 'files',
      title: 'Files',
      icon: '💾',
      defaultOpen: false,
      content: (
        <FileExplorer
          onSave={saveDiagram}
          onLoad={loadDiagram}
          onClear={clearDiagram}
        />
      ),
    },
  ];

  // Configure right panel sections
  const rightPanelSections: PanelSection[] = [
    {
      id: 'properties',
      title: selectedEdge ? 'Edge Properties' : 'Node Properties',
      icon: selectedEdge ? '🔗' : '⚙️',
      defaultOpen: true,
      content: selectedEdge ? (
        <EdgePropertiesPanel
          selectedEdge={selectedEdge}
          onUpdateEdge={updateEdgeProperties}
        />
      ) : (
        <PropertiesContent
          selectedNode={selectedNode}
          onUpdateNode={(nodeId: string, updates: unknown) => 
            updateNodeProperties(nodeId, updates as Partial<DiagramNode['data']>)
          }
        />
      ),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '🔧',
      defaultOpen: false,
      content: <SettingsContent />,
    },
    {
      id: 'stats',
      title: 'Diagram Stats',
      icon: '📊',
      defaultOpen: false,
      content: (
        <DiagramStatsContent
          totalNodes={nodes.length}
          totalEdges={edges.length}
        />
      ),
    },
  ];

  // Edge click handler
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: DiagramEdge) => {
      setSelectedEdge(edge);
      setSelectedNode(null); // Clear node selection
      setRightPanelOpen(true);
    },
    []
  );

  return (
    <div className="h-screen w-full flex flex-col bg-background relative">
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
        onTogglePropertiesPanel={() => setRightPanelOpen(!rightPanelOpen)}
        showPropertiesPanel={rightPanelOpen}
        showMiniMap={showMiniMap}
        onMiniMapToggle={setShowMiniMap}
        onPlayWorkflow={handlePlayWorkflow}
        onPauseWorkflow={handlePauseWorkflow}
        onRestartWorkflow={handleRestartWorkflow}
        onDebugWorkflow={handleDebugWorkflow}
        workflowState={workflowState}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex relative">
        {/* ReactFlow Canvas */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            leftPanelOpen ? 'ml-80' : 'ml-0'
          } ${
            rightPanelOpen ? 'mr-80' : 'mr-0'
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
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            connectionMode={ConnectionMode.Loose}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={defaultEdgeOptions}
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView
            attributionPosition="bottom-left"
            className="bg-background"
          >
            <Controls 
              position="bottom-right"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
              className="bg-card border border-border rounded-lg shadow-soft"
            />
            {showMiniMap && (
              <MiniMap 
                position="top-right"
                nodeStrokeColor="var(--border-color)"
                nodeColor={(node: Node) => (node.data as DiagramNodeData).color || 'var(--secondary)'}
                nodeBorderRadius={8}
                className="bg-card border border-border rounded-lg shadow-soft"
              />
            )}
            <Background 
              variant={backgroundVariant}
              gap={20}
              size={1}
              color="#e2e8f0"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Left Side Panel */}
      <SidePanel
        side="left"
        isOpen={leftPanelOpen}
        onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        sections={leftPanelSections}
        width={280}
      />

      {/* Right Side Panel */}
      <SidePanel
        side="right"
        isOpen={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        sections={rightPanelSections}
        width={280}
      />

      {/* Panel Toggle Buttons */}
      <PanelToggleButton
        side="left"
        isOpen={leftPanelOpen}
        onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        label="Explorer"
      />

      <PanelToggleButton
        side="right"
        isOpen={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        label="Properties"
      />

      {/* Status Bar */}
      <div className="h-7 bg-sidebar border-t border-border flex items-center justify-between px-3 text-xs text-muted relative z-10">
        <div className="flex items-center space-x-3">
          <span>Nodes: {nodes.length}</span>
          <span>Edges: {edges.length}</span>
          {selectedNode && <span>Selected: {selectedNode.data.label}</span>}
          {selectedEdge && <span>Selected Edge: {selectedEdge.id}</span>}
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span>Ctrl+N: New</span>
          <span>Ctrl+S: Save</span>
          <span>Ctrl+F: Fit</span>
          <span>Ctrl+M: Map</span>
          <span>Del: Delete</span>
        </div>
      </div>
    </div>
  );
}
