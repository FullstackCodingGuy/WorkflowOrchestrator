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
  ReactFlowInstance,
  ConnectionMode,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Import custom components
import { DiagramToolbar } from './DiagramToolbar';
import { useExportManager, ExportOptions } from './ExportManager';

// Import the Property Panel
import { PropertyPanel } from './PropertyPanel/PropertyPanel';

// Import side panel components
import { 
  SidePanel, 
  PanelSection, 
  ExplorerPanel, 
  OutlinePanel
} from './SidebarPanels';
import { PresentationView } from './PresentationView';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

// Import shared ReactFlow configuration
import { nodeTypes, edgeTypes } from './reactFlowConfig';

// Import enhanced configuration
import { APP_COLORS } from '../config/appConfig';

// Import workflow store for diagram type management
import useWorkflowStore from '../store/workflowStore';

// Types
export interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  maxWidth?: number;
  icon?: string;
  properties?: Record<string, unknown>;
  isExecuting?: boolean;
  // Settings properties
  snapToGrid?: boolean;
  gridSize?: number;
  showMinimap?: boolean;
  showControls?: boolean;
}

export type DiagramNode = Node<DiagramNodeData>;

export interface DiagramEdgeData {
  label?: string;
  description?: string;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  markerEnd?: 'arrow' | 'none';
  edgeType?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  values?: string[];
  tags?: string[];
}

export type DiagramEdge = Edge<DiagramEdgeData>;

// Initial nodes with enhanced default styling
const initialNodes: DiagramNode[] = [];

// Initial edges with enhanced modern styling
const initialEdges: DiagramEdge[] = [];

// Enhanced connection line style
const connectionLineStyle = {
  strokeWidth: 3,
  stroke: APP_COLORS.edgeTypes.default,
  strokeDasharray: '8,4',
};

// Enhanced default edge options
const defaultEdgeOptions = {
  style: { 
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  },
  markerEnd: { type: MarkerType.ArrowClosed },
};

export default function DiagramEditor() {
  // Workflow store for diagram type management
  const { 
    applyLayout,
    applySmartLayout 
  } = useWorkflowStore();
  
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<DiagramEdge | null>(null);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  
  // Handle background variant changes, support solid background with Cross variant
  const handleBackgroundVariantChange = useCallback((variant: BackgroundVariant) => {
    setBackgroundVariant(variant);
  }, []);
  const [isAnimationEnabled] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Settings state (moved from property panel)
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [showControls, setShowControls] = useState(true);

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Export functionality
  const {
    exportAsImage,
    exportAsPDF,
    exportAsGIF,
    shareToClipboard,
    generateSocialMediaLinks,
    exportWorkflowData,
  } = useExportManager(reactFlowInstance, nodes, edges);

  // Export handlers for DiagramToolbar
  const handleExportSVG = useCallback(async (options: ExportOptions) => {
    try {
      await exportAsImage({ ...options, format: 'svg' });
    } catch (error) {
      console.error('SVG export failed:', error);
    }
  }, [exportAsImage]);

  const handleExportImage = useCallback(async (format: 'png' | 'jpeg', options: ExportOptions) => {
    try {
      await exportAsImage({ ...options, format });
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
    }
  }, [exportAsImage]);

  const handleExportPDF = useCallback(async (options: ExportOptions) => {
    try {
      await exportAsPDF(options);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  }, [exportAsPDF]);

  const handleExportGIF = useCallback(async (options: ExportOptions) => {
    try {
      await exportAsGIF(options);
    } catch (error) {
      console.error('GIF export failed:', error);
    }
  }, [exportAsGIF]);

  // Side panel states
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  
  // Property panel state - opens when nodes/edges are selected
  const [propertyPanelOpen, setPropertyPanelOpen] = useState(false);
  
  // Presentation view state
  const [presentationViewOpen, setPresentationViewOpen] = useState(false);
  
  // Keyboard shortcuts help state
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  // Connection handler
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      const newEdge: DiagramEdge = {
        ...params,
        id: `${params.source}->${params.target}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        data: {
          animated: isAnimationEnabled,
          color: APP_COLORS.edgeTypes.default,
          strokeWidth: 3,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: APP_COLORS.edgeTypes.default },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, isAnimationEnabled]
  );

  // Node click handler - opens property panel
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node as DiagramNode);
      setSelectedEdge(null); // Clear edge selection
      setPropertyPanelOpen(true); // Open property panel when node is selected
    },
    []
  );

  // Pane click handler (deselect and close property panel)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setPropertyPanelOpen(false);
  }, []);

  // Add new node with waterfall positioning for enhanced visibility
  const addNewNode = useCallback(
    (type?: string) => {
      if (!reactFlowInstance) return;

      const nodeType = type || 'custom';
      
      // Calculate waterfall position based on existing nodes
      const nodeCount = nodes.length;
      const stepX = 150; // Horizontal step distance
      const stepY = 100; // Vertical step distance
      const startX = 50;  // Starting X position
      const startY = 50;  // Starting Y position
      
      const position = {
        x: startX + (nodeCount * stepX) % 800,
        y: startY + Math.floor((nodeCount * stepX) / 800) * stepY,
      };

      const newNode: DiagramNode = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `New Node ${nodes.length + 1}`,
          description: 'Click to customize this node',
          icon: '✨',
          properties: { 
            created: new Date().toISOString(), 
            version: '1.0',
          },
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
    setPropertyPanelOpen(false);
  }, [selectedNode, setNodes, setEdges]);

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
    setPropertyPanelOpen(false);
  }, [setNodes, setEdges]);

  // Layout handlers using workflow store
  const handleApplyLayout = useCallback((direction: "TB" | "LR") => {
    const store = useWorkflowStore.getState();
    store.setNodes(nodes);
    store.setEdges(edges);
    
    applyLayout(direction);
    
    const updatedState = useWorkflowStore.getState();
    setNodes(updatedState.nodes);
    setEdges(updatedState.edges);
    
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
      }
    }, 100);
  }, [nodes, edges, applyLayout, setNodes, setEdges, reactFlowInstance]);

  const handleApplySmartLayout = useCallback((layoutType: "hierarchical" | "circular" | "force" | "grid") => {
    const store = useWorkflowStore.getState();
    store.setNodes(nodes);
    store.setEdges(edges);
    
    applySmartLayout(layoutType);
    
    const updatedState = useWorkflowStore.getState();
    setNodes(updatedState.nodes);
    setEdges(updatedState.edges);
    
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
      }
    }, 100);
  }, [nodes, edges, applySmartLayout, setNodes, setEdges, reactFlowInstance]);

  // Create new workflow (same as clear but with confirmation)
  const newWorkflow = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const confirmed = window.confirm('This will clear the current diagram. Are you sure?');
      if (!confirmed) return;
    }
    
    clearDiagram();
    
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'New Diagram',
        message: 'Started a new diagram. Ready to add nodes!',
        duration: 3000,
      });
    }
  }, [nodes.length, edges.length, clearDiagram]);

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
      if (event.key === 'Escape') {
        if (keyboardShortcutsOpen) {
          setKeyboardShortcutsOpen(false);
          return;
        }
        if (presentationViewOpen) {
          setPresentationViewOpen(false);
          return;
        }
        setSelectedNode(null);
        setPropertyPanelOpen(false);
        return;
      }

      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setKeyboardShortcutsOpen(true);
        return;
      }

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
            if (event.shiftKey) {
              event.preventDefault();
              newWorkflow();
            } else {
              event.preventDefault();
              addNewNode();
            }
            break;
          case 'f':
            event.preventDefault();
            fitView();
            break;
          case 'm':
            event.preventDefault();
            setShowMiniMap(!showMiniMap);
            break;
          case 'p':
            event.preventDefault();
            setPresentationViewOpen(true);
            break;
        }
      }
      if (event.key === 'Delete' && selectedNode) {
        deleteSelectedNode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveDiagram, loadDiagram, addNewNode, newWorkflow, fitView, deleteSelectedNode, selectedNode, showMiniMap, keyboardShortcutsOpen, presentationViewOpen]);

  // Presentation view handler
  const handleOpenPresentationView = useCallback(() => {
    setPresentationViewOpen(true);
  }, []);

  const handleClosePresentationView = useCallback(() => {
    setPresentationViewOpen(false);
  }, []);

  // Keyboard shortcuts help handler
  const handleShowKeyboardShortcuts = useCallback(() => {
    setKeyboardShortcutsOpen(true);
  }, []);

  const handleCloseKeyboardShortcuts = useCallback(() => {
    setKeyboardShortcutsOpen(false);
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
            setPropertyPanelOpen(true);
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
            setPropertyPanelOpen(true);
          }}
          onFitView={fitView}
        />
      ),
    },
  ];

  // Edge click handler
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: DiagramEdge) => {
      setSelectedEdge(edge);
      setSelectedNode(null); // Clear node selection
      setPropertyPanelOpen(true); // Open property panel when edge is selected
    },
    []
  );

  // Enhanced node update callback
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<DiagramNodeData> & Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== nodeId) return node;
          
          const { 
            draggable, 
            selectable, 
            deletable, 
            zIndex,
            ...dataUpdates 
          } = updates;
          
          const nodeUpdates: Partial<Node> = {};
          if (draggable !== undefined) nodeUpdates.draggable = draggable as boolean;
          if (selectable !== undefined) nodeUpdates.selectable = selectable as boolean;
          if (deletable !== undefined) nodeUpdates.deletable = deletable as boolean;
          if (zIndex !== undefined) nodeUpdates.zIndex = zIndex as number;
          
          return { 
            ...node, 
            ...nodeUpdates,
            data: { ...node.data, ...dataUpdates } 
          };
        })
      );
    },
    [setNodes]
  );

  // Enhanced edge update callback
  const handleEdgeUpdate = useCallback(
    (edgeId: string, updates: Partial<DiagramEdgeData>) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...edge.data, ...updates } }
            : edge
        )
      );
    },
    [setEdges]
  );

  // Handle node position updates (for property panel position editing)
  const handleNodePositionUpdate = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, position }
            : node
        )
      );
    },
    [setNodes]
  );

  const proOptions = { hideAttribution: true };
  return (
    <div className="h-screen w-full flex flex-col bg-background relative">
      {/* Toolbar */}
      <DiagramToolbar
        onAddNode={addNewNode}
        onFitView={fitView}
        onNew={newWorkflow}
        onSave={saveDiagram}
        onLoad={loadDiagram}
        backgroundVariant={backgroundVariant}
        onBackgroundVariantChange={handleBackgroundVariantChange}
        showMiniMap={showMiniMap}
        onMiniMapToggle={setShowMiniMap}
        
        showLeftSidebar={leftPanelOpen}
        onToggleLeftSidebar={() => setLeftPanelOpen(!leftPanelOpen)}
        showRightSidebar={false}
        onToggleRightSidebar={() => {}}
        snapToGrid={snapToGrid}
        onSnapToGridToggle={setSnapToGrid}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        showControls={showControls}
        onShowControlsToggle={setShowControls}
        onOpenPresentationView={handleOpenPresentationView}
        onShowKeyboardShortcuts={handleShowKeyboardShortcuts}
        onExportSVG={handleExportSVG}
        onExportImage={handleExportImage}
        onExportPDF={handleExportPDF}
        onExportGIF={handleExportGIF}
        onShareToClipboard={shareToClipboard}
        onGenerateSocialMediaLinks={generateSocialMediaLinks}
        onExportWorkflowData={exportWorkflowData}
        onApplyLayout={handleApplyLayout}
        onApplySmartLayout={handleApplySmartLayout}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex relative">
        {/* ReactFlow Canvas */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            leftPanelOpen ? 'ml-[280px]' : 'ml-0'
          }`} 
          ref={reactFlowWrapper}
        >
          <ReactFlow
            proOptions={proOptions}
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
            snapToGrid={snapToGrid}
            snapGrid={[gridSize, gridSize]}
            fitView
            attributionPosition="bottom-left"
            className="bg-background"
          >
            {showControls && (
              <Controls 
                position="bottom-right"
                showZoom={true}
                showFitView={true}
                showInteractive={true}
                className="bg-card border border-border rounded-lg shadow-soft"
              />
            )}
            {showMiniMap && (
              <MiniMap 
                position="top-right"
                nodeStrokeColor="var(--border-color)"
                nodeColor={(node: Node) => (node.data as DiagramNodeData).color || 'var(--secondary)'}
                nodeBorderRadius={8}
                className="bg-card border border-border rounded-lg shadow-soft"
              />
            )}
            {backgroundVariant !== BackgroundVariant.Cross && (
              <Background 
                variant={backgroundVariant}
                gap={backgroundVariant === BackgroundVariant.Dots ? 32 : 24}
                size={backgroundVariant === BackgroundVariant.Dots ? 2.5 : 2}
                color="#cbd5e1"
                lineWidth={backgroundVariant === BackgroundVariant.Lines ? 1 : 1.5}
              />
            )}
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

      {/* Property Panel System - Opens when nodes/edges are selected */}
      <PropertyPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onNodeUpdate={handleNodeUpdate}
        onNodePositionUpdate={handleNodePositionUpdate}
        onEdgeUpdate={handleEdgeUpdate}
        isVisible={propertyPanelOpen}
        onVisibilityChange={setPropertyPanelOpen}
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

      {/* Presentation View */}
      <PresentationView 
        isOpen={presentationViewOpen}
        nodes={nodes}
        edges={edges}
        backgroundVariant={backgroundVariant}
        showMiniMap={showMiniMap}
        workflowState={'idle'}
        onClose={handleClosePresentationView}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={keyboardShortcutsOpen}
        onClose={handleCloseKeyboardShortcuts}
      />
    </div>
  );
}
