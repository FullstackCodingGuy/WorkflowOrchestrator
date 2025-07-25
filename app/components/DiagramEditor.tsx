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

// Import the Property Panel
import { PropertyPanel } from './PropertyPanel/PropertyPanel';

// Import side panel components
import { 
  SidePanel, 
  PanelSection, 
  ExplorerPanel, 
  OutlinePanel, 
  FileExplorer, 
  TemplateLibraryPanel 
} from './SidebarPanels';
import { WorkflowTemplate, workflowTemplates } from './workflowTemplates';
import { PresentationView } from './PresentationView';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

// Import shared ReactFlow configuration
import { nodeTypes, edgeTypes } from './reactFlowConfig';

// Import enhanced configuration
import { APP_COLORS, getNodeTypeStyles, DiagramType } from '../config/appConfig';

// Import workflow store for diagram type management
import useWorkflowStore from '../store/workflowStore';

// Types
export type WorkflowNodeType = 'start' | 'process' | 'decision' | 'condition' | 'action' | 'end' | 'custom';

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
  nodeType?: WorkflowNodeType; // New node type attribute
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
}

export type DiagramEdge = Edge<DiagramEdgeData>;

// Initial nodes with enhanced default styling
const initialNodes: DiagramNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 50, y: 50 }, // Top cliff start
    data: {
      label: 'Start Node',
      description: 'Begin workflow execution',
      color: APP_COLORS.nodeTypes.start,
      backgroundColor: '#f0fdf4', // Light green background
      borderColor: '#bbf7d0',
      textColor: '#065f46', // Dark green text
      fontSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: 220,
      icon: '🚀',
      nodeType: 'start',
      properties: { priority: 'high', trigger: 'manual', timeout: '30s' }
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 350, y: 250 }, // First step down and right
    data: {
      label: 'Process Data',
      description: 'Transform and validate input',
      color: APP_COLORS.nodeTypes.process,
      backgroundColor: '#eff6ff', // Light blue background
      borderColor: '#bfdbfe',
      textColor: '#1e40af', // Dark blue text
      fontSize: 15,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '500',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: 220,
      icon: '⚙️',
      nodeType: 'process',
      properties: { duration: '2 minutes', cpu: '0.5 cores', memory: '512MB' }
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 650, y: 450 }, // Second step down and right
    data: {
      label: 'Decision Point',
      description: 'Evaluate conditions and route',
      color: APP_COLORS.nodeTypes.decision,
      backgroundColor: '#fffbeb', // Light amber background
      borderColor: '#fde68a',
      textColor: '#92400e', // Dark amber text
      fontSize: 15,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '500',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: 220,
      icon: '🔀',
      nodeType: 'decision',
      properties: { condition: 'if x > 10', branches: 2, timeout: '5s' }
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 950, y: 650 }, // Final step down and right
    data: {
      label: 'Complete',
      description: 'Workflow finished successfully',
      color: APP_COLORS.nodeTypes.end,
      backgroundColor: '#fef2f2', // Light red background
      borderColor: '#fecaca',
      textColor: '#991b1b', // Dark red text
      fontSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: 220,
      icon: '✅',
      nodeType: 'end',
      properties: { result: 'success', notify: 'email', cleanup: true }
    },
  },
];

// Initial edges with enhanced modern styling
const initialEdges: DiagramEdge[] = [
  {
    id: '1->2',
    type: 'workflowEdge',
    source: '1',
    target: '2',
    data: { 
      label: 'Execute', 
      animated: false, 
      color: APP_COLORS.edgeTypes.success,
      backgroundColor: '#ffffff',
      strokeWidth: 3,
      strokeStyle: 'solid',
      animationSpeed: 'normal',
      markerEnd: 'arrow',
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      textAlign: 'center',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: APP_COLORS.edgeTypes.success },
  },
  {
    id: '2->3',
    type: 'workflowEdge',
    source: '2',
    target: '3',
    data: { 
      label: 'Evaluate', 
      animated: false, 
      color: APP_COLORS.edgeTypes.info,
      strokeWidth: 3,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: APP_COLORS.edgeTypes.info },
  },
  {
    id: '3->4',
    type: 'workflowEdge',
    source: '3',
    target: '4',
    data: { 
      label: 'Finish', 
      animated: false, 
      color: APP_COLORS.edgeTypes.success,
      strokeWidth: 3,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: APP_COLORS.edgeTypes.success },
  },
];

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
  const { currentDiagramType, getDefaultNodeTypeForDiagram, setDiagramType } = useWorkflowStore();
  
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<DiagramEdge | null>(null);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  
  // Handle background variant changes, default Cross to Dots since Cross is removed
  const handleBackgroundVariantChange = useCallback((variant: BackgroundVariant) => {
    if (variant === BackgroundVariant.Cross) {
      setBackgroundVariant(BackgroundVariant.Dots);
    } else {
      setBackgroundVariant(variant);
    }
  }, []);
  const [isAnimationEnabled] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Settings state (moved from property panel)
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [showControls, setShowControls] = useState(true);

  // Workflow state
  const [workflowState, setWorkflowState] = useState<'idle' | 'playing' | 'paused' | 'debugging'>('idle');
  const [workflowSequence, setWorkflowSequence] = useState<string[]>([]);
  const [workflowEndNodes, setWorkflowEndNodes] = useState<string[]>([]);
  const [workflowStep, setWorkflowStep] = useState(0);
  const workflowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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
        type: isAnimationEnabled ? 'workflowEdge' : 'smoothstep',
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

      // Use diagram type to determine default node type if not specified
      let nodeType: string = 'custom'; // Start with a safe default
      
      if (type) {
        nodeType = type;
      } else {
        try {
          const defaultType = getDefaultNodeTypeForDiagram();
          if (defaultType && typeof defaultType === 'string') {
            nodeType = defaultType;
          }
        } catch (error) {
          console.warn('Error getting default node type from diagram configuration:', error);
        }
      }
      
      // Final safety check
      if (!nodeType || typeof nodeType !== 'string') {
        nodeType = 'custom';
        console.warn('Invalid node type resolved, using "custom" as fallback');
      }
      
      // Calculate waterfall position based on existing nodes
      const nodeCount = nodes.length;
      const stepX = 300; // Horizontal step distance
      const stepY = 150; // Vertical step distance
      const startX = 50;  // Starting X position (cliff top)
      const startY = 50;  // Starting Y position
      
      // Create stepped waterfall layout: each new node steps down and right
      const position = {
        x: startX + (nodeCount * stepX),
        y: startY + (nodeCount * stepY),
      };

      const newNode: DiagramNode = {
        id: `node-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `New ${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodes.length + 1}`,
          description: 'Click to customize this node',
          ...getNodeTypeStyles(nodeType as WorkflowNodeType),
          icon: nodeType === 'start' ? '🚀' : nodeType === 'end' ? '🏁' : nodeType === 'decision' ? '❓' : nodeType === 'action' ? '⚡' : '✨',
          nodeType: nodeType as WorkflowNodeType,
          properties: { 
            created: new Date().toISOString(), 
            version: '1.0',
            diagramType: currentDiagramType,
          },
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes.length, setNodes, getDefaultNodeTypeForDiagram, currentDiagramType]
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

  // Create new workflow (same as clear but with confirmation)
  const newWorkflow = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const confirmed = window.confirm('This will clear the current workflow. Are you sure?');
      if (!confirmed) return;
    }
    
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setPropertyPanelOpen(false);
    
    // Show toast notification
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'New Workflow',
        message: 'Started a new workflow. Ready to add nodes!',
        duration: 3000,
      });
    }
  }, [nodes.length, edges.length, setNodes, setEdges]);

  // Handle template-based workflow creation
  const handleNewTemplate = useCallback((templateId: string) => {
    // Check if current workflow needs to be saved
    if (nodes.length > 0 || edges.length > 0) {
      const confirmed = window.confirm('This will replace the current workflow. Are you sure?');
      if (!confirmed) return;
    }

    // Create template based on ID
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];
    let templateName = 'New Workflow';

    switch (templateId) {
      case 'basic-workflow':
        templateName = 'Basic Workflow';
        templateNodes = [
          {
            id: 'start-1',
            type: 'start',
            data: { 
              label: 'Start Process',
              nodeType: 'start',
              ...getNodeTypeStyles('start')
            },
            position: { x: 100, y: 50 },
            width: 120,
            height: 60,
          },
          {
            id: 'action-1',
            type: 'action',
            data: { 
              label: 'Process Task',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 100, y: 150 },
            width: 120,
            height: 60,
          },
          {
            id: 'end-1',
            type: 'end',
            data: { 
              label: 'Complete',
              nodeType: 'end',
              ...getNodeTypeStyles('end')
            },
            position: { x: 100, y: 250 },
            width: 120,
            height: 60,
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'start-1',
            target: 'action-1',
            type: 'default',
          },
          {
            id: 'e2-3',
            source: 'action-1',
            target: 'end-1',
            type: 'default',
          },
        ];
        break;

      case 'conditional-workflow':
        templateName = 'Conditional Workflow';
        templateNodes = [
          {
            id: 'start-1',
            type: 'start',
            data: { 
              label: 'Start',
              nodeType: 'start',
              ...getNodeTypeStyles('start')
            },
            position: { x: 200, y: 50 },
            width: 120,
            height: 60,
          },
          {
            id: 'condition-1',
            type: 'condition',
            data: { 
              label: 'Check Condition',
              nodeType: 'condition',
              ...getNodeTypeStyles('condition')
            },
            position: { x: 200, y: 150 },
            width: 120,
            height: 80,
          },
          {
            id: 'action-1',
            type: 'action',
            data: { 
              label: 'Action A',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 100, y: 280 },
            width: 120,
            height: 60,
          },
          {
            id: 'action-2',
            type: 'action',
            data: { 
              label: 'Action B',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 300, y: 280 },
            width: 120,
            height: 60,
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'start-1',
            target: 'condition-1',
            type: 'default',
          },
          {
            id: 'e2-3',
            source: 'condition-1',
            sourceHandle: 'true',
            target: 'action-1',
            type: 'default',
            label: 'Yes',
          },
          {
            id: 'e2-4',
            source: 'condition-1',
            target: 'action-2',
            type: 'default',
            label: 'No',
          },
        ];
        break;

      case 'animated-basic':
        templateName = 'Animated Basic Flow';
        templateNodes = [
          {
            id: 'start-1',
            type: 'start',
            data: { 
              label: 'Start Process',
              nodeType: 'start',
              ...getNodeTypeStyles('start')
            },
            position: { x: 100, y: 50 },
            width: 120,
            height: 60,
          },
          {
            id: 'action-1',
            type: 'action',
            data: { 
              label: 'Animated Task',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 100, y: 150 },
            width: 120,
            height: 60,
          },
          {
            id: 'end-1',
            type: 'end',
            data: { 
              label: 'Complete',
              nodeType: 'end',
              ...getNodeTypeStyles('end')
            },
            position: { x: 100, y: 250 },
            width: 120,
            height: 60,
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'start-1',
            target: 'action-1',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e2-3',
            source: 'action-1',
            target: 'end-1',
            type: 'animatedSvg',
            animated: true,
          },
        ];
        // Enable edge animations for this template
        setTimeout(() => {
          const toggleButton = document.querySelector('[data-testid="edge-animation-toggle"]') as HTMLButtonElement;
          if (toggleButton && !toggleButton.classList.contains('bg-primary')) {
            toggleButton.click();
          }
        }, 100);
        break;

      case 'animated-complex':
        templateName = 'Advanced Animated Flow';
        templateNodes = [
          {
            id: 'start-1',
            type: 'start',
            data: { 
              label: 'Start',
              nodeType: 'start',
              ...getNodeTypeStyles('start')
            },
            position: { x: 200, y: 50 },
            width: 120,
            height: 60,
          },
          {
            id: 'condition-1',
            type: 'condition',
            data: { 
              label: 'Complex Decision',
              nodeType: 'condition',
              ...getNodeTypeStyles('condition')
            },
            position: { x: 200, y: 150 },
            width: 140,
            height: 80,
          },
          {
            id: 'action-1',
            type: 'action',
            data: { 
              label: 'Process A',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 50, y: 280 },
            width: 120,
            height: 60,
          },
          {
            id: 'action-2',
            type: 'action',
            data: { 
              label: 'Process B',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 200, y: 280 },
            width: 120,
            height: 60,
          },
          {
            id: 'action-3',
            type: 'action',
            data: { 
              label: 'Process C',
              nodeType: 'action',
              ...getNodeTypeStyles('action')
            },
            position: { x: 350, y: 280 },
            width: 120,
            height: 60,
          },
          {
            id: 'end-1',
            type: 'end',
            data: { 
              label: 'Complete',
              nodeType: 'end',
              ...getNodeTypeStyles('end')
            },
            position: { x: 200, y: 400 },
            width: 120,
            height: 60,
          },
        ];
        templateEdges = [
          {
            id: 'e1-2',
            source: 'start-1',
            target: 'condition-1',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e2-3',
            source: 'condition-1',
            sourceHandle: 'true',
            target: 'action-1',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e2-4',
            source: 'condition-1',
            target: 'action-2',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e2-5',
            source: 'condition-1',
            sourceHandle: 'false',
            target: 'action-3',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e3-6',
            source: 'action-1',
            target: 'end-1',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e4-6',
            source: 'action-2',
            target: 'end-1',
            type: 'animatedSvg',
            animated: true,
          },
          {
            id: 'e5-6',
            source: 'action-3',
            target: 'end-1',
            type: 'animatedSvg',
            animated: true,
          },
        ];
        // Enable advanced animations
        setTimeout(() => {
          const toggleButton = document.querySelector('[data-testid="edge-animation-toggle"]') as HTMLButtonElement;
          if (toggleButton && !toggleButton.classList.contains('bg-primary')) {
            toggleButton.click();
          }
        }, 100);
        break;

      default:
        // Use existing template if templateId matches a known template
        const existingTemplate = workflowTemplates.find(t => t.name.toLowerCase().replace(/\s+/g, '-') === templateId);
        if (existingTemplate) {
          templateName = existingTemplate.name;
          templateNodes = existingTemplate.nodes;
          templateEdges = existingTemplate.edges;
        }
        break;
    }

    // Apply the template
    setNodes(templateNodes);
    setEdges(templateEdges);
    setSelectedNode(null);
    setPropertyPanelOpen(false);

    // Auto-fit view to show the template
    setTimeout(() => {
      fitView();
    }, 100);

    // Show toast notification
    if (window.showToast) {
      window.showToast({
        type: 'success',
        title: 'Template Applied',
        message: `Created "${templateName}" workflow from template`,
        duration: 3000,
      });
    }
  }, [nodes.length, edges.length, setNodes, setEdges, fitView]);

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
      // Handle Escape key for closing modals
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

      // Handle ? key for showing shortcuts help
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
            // Check if this is a new workflow (Shift+Ctrl+N) or add node (Ctrl+N)
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

  // Workflow handlers
  const buildWorkflowSequence = useCallback(() => {
    // Find all start nodes (nodes with nodeType 'start' or no incoming edges)
    const startNodes = nodes.filter(node => 
      node.data.nodeType === 'start' || 
      (!node.data.nodeType && !edges.some(edge => edge.target === node.id)) ||
      (node.data.nodeType === undefined && node.data.label.toLowerCase().includes('start'))
    );
    
    // Find all end nodes (nodes with nodeType 'end' or no outgoing edges)
    const endNodes = nodes.filter(node =>
      node.data.nodeType === 'end' ||
      (!node.data.nodeType && !edges.some(edge => edge.source === node.id)) ||
      (node.data.nodeType === undefined && node.data.label.toLowerCase().includes('end'))
    );
    
    if (startNodes.length === 0) return { sequence: [], endNodes: [] };
    
    // Use the first start node if multiple exist
    const startNode = startNodes[0];
    
    const sequence: Array<{ nodeId: string; level: number; isEndNode: boolean }> = [];
    const visited = new Set<string>();
    const nodeToLevel = new Map<string, number>();
    
    // Breadth-first traversal to build proper workflow sequence
    const buildSequenceBFS = () => {
      const queue: Array<{ nodeId: string; level: number }> = [{ nodeId: startNode.id, level: 0 }];
      nodeToLevel.set(startNode.id, 0);
      
      while (queue.length > 0) {
        const { nodeId, level } = queue.shift()!;
        
        if (visited.has(nodeId)) continue;
        visited.add(nodeId);
        
        const isEndNode = endNodes.some(endNode => endNode.id === nodeId);
        sequence.push({ nodeId, level, isEndNode });
        
        // Find all direct children (outgoing edges)
        const outgoingEdges = edges.filter(edge => edge.source === nodeId);
        
        outgoingEdges.forEach(edge => {
          if (edge.target && !visited.has(edge.target)) {
            const targetLevel = level + 1;
            
            // Only update level if it's higher (handles convergent paths)
            if (!nodeToLevel.has(edge.target) || nodeToLevel.get(edge.target)! < targetLevel) {
              nodeToLevel.set(edge.target, targetLevel);
              queue.push({ nodeId: edge.target, level: targetLevel });
            }
          }
        });
      }
    };
    
    buildSequenceBFS();
    
    // Sort by level to ensure proper execution order
    sequence.sort((a, b) => a.level - b.level);
    
    return {
      sequence: sequence.map(item => item.nodeId),
      endNodes: sequence.filter(item => item.isEndNode).map(item => item.nodeId),
      sequenceWithMetadata: sequence
    };
  }, [nodes, edges]);

  const highlightNode = useCallback((nodeId: string | null) => {
    setNodes((nds) =>
      nds.map((node) => {
        // Ensure node has proper structure
        if (!node || !node.id || !node.data) {
          return node;
        }
        
        if (node.id === nodeId) {
          // Node is executing - ONLY modify data, never style
          return {
            ...node,
            data: {
              ...node.data,
              isExecuting: true,
            },
            // NEVER modify style - let WorkflowNode handle visual feedback
          };
        } else if (node.data.isExecuting) {
          // Node was executing but no longer is - ONLY modify data
          return {
            ...node,
            data: {
              ...node.data,
              isExecuting: false,
            },
            // NEVER modify style - preserve original ReactFlow positioning
          };
        } else {
          // Node is not being highlighted - return unchanged
          return node;
        }
      })
    );
  }, [setNodes]);

  const animateEdge = useCallback((sourceId: string, targetId: string) => {
    // Try multiple edge ID patterns to find the correct edge
    const possibleEdgeIds = [
      `${sourceId}->${targetId}`, // Our standard format
      `${sourceId}-${targetId}`,  // Alternative format
      `reactflow__edge-${sourceId}${targetId}`, // ReactFlow auto-generated format
    ];
    
    setEdges((eds) =>
      eds.map((edge) => {
        // Check if this edge matches any of the possible patterns
        const isTargetEdge = possibleEdgeIds.includes(edge.id) || 
                           (edge.source === sourceId && edge.target === targetId);
        
        if (isTargetEdge) {
          return {
            ...edge,
            data: {
              ...edge.data,
              animated: true,
            },
          };
        }
        return edge; // Don't modify other edges
      })
    );

    // Reset edge animation after a delay
    setTimeout(() => {
      setEdges((eds) =>
        eds.map((edge) => {
          const isTargetEdge = possibleEdgeIds.includes(edge.id) || 
                             (edge.source === sourceId && edge.target === targetId);
          
          if (isTargetEdge) {
            return {
              ...edge,
              data: {
                ...edge.data,
                animated: false,
              },
            };
          }
          return edge;
        })
      );
    }, 2000);
  }, [setEdges]);

  const executeWorkflowStep = useCallback(() => {
    if (workflowStep >= workflowSequence.length) {
      // Workflow completed - check if we've reached all end nodes
      const currentNodeId = workflowSequence[workflowStep - 1];
      const isActualEndNode = workflowEndNodes.includes(currentNodeId);
      
      setWorkflowState('idle');
      highlightNode(null);
      setWorkflowStep(0);
      
      // Show completion toast with enhanced information
      if (window.showToast) {
        window.showToast({
          type: 'success',
          title: isActualEndNode ? 'Workflow Completed! 🎉' : 'Workflow Path Completed! ✅',
          message: isActualEndNode 
            ? `Successfully executed ${workflowSequence.length} node${workflowSequence.length === 1 ? '' : 's'} and reached the final node.`
            : `Executed ${workflowSequence.length} node${workflowSequence.length === 1 ? '' : 's'}. Workflow path completed.`,
          duration: 5000,
        });
      }
      
      return;
    }

    const currentNodeId = workflowSequence[workflowStep];
    const isEndNode = workflowEndNodes.includes(currentNodeId);
    
    highlightNode(currentNodeId);

    // Animate edges to next nodes (only if not the last step)
    const nextNodeId = workflowSequence[workflowStep + 1];
    if (nextNodeId) {
      animateEdge(currentNodeId, nextNodeId);
    }

    // If this is an end node, show a special indicator
    if (isEndNode && window.showToast) {
      window.showToast({
        type: 'info',
        title: 'End Node Reached',
        message: 'This node marks the end of a workflow path.',
        duration: 2000,
      });
    }

    setWorkflowStep(prev => prev + 1);
  }, [workflowStep, workflowSequence, workflowEndNodes, highlightNode, animateEdge]);

  // Separate effect to handle workflow stepping
  useEffect(() => {
    if (workflowState === 'playing' || workflowState === 'debugging') {
      if (workflowStep < workflowSequence.length && workflowSequence.length > 0) {
        // Clear any existing timeout before setting a new one
        if (workflowTimerRef.current) {
          clearTimeout(workflowTimerRef.current);
        }
        
        workflowTimerRef.current = setTimeout(() => {
          // Double-check the state before executing to prevent race conditions
          if (workflowState === 'playing' || workflowState === 'debugging') {
            executeWorkflowStep();
          }
        }, workflowState === 'debugging' ? 3000 : 1500);
      }
    }

    return () => {
      if (workflowTimerRef.current) {
        clearTimeout(workflowTimerRef.current);
        workflowTimerRef.current = null;
      }
    };
  }, [workflowState, workflowStep, workflowSequence.length, executeWorkflowStep]);

  const handlePlayWorkflow = useCallback(() => {
    if (workflowState === 'paused') {
      // Resume from current step
      setWorkflowState('playing');
      
      // Show resume toast
      if (window.showToast) {
        window.showToast({
          type: 'info',
          title: 'Workflow Resumed',
          message: 'Continuing from where it was paused.',
          duration: 3000,
        });
      }
    } else {
      // Start new workflow
      const workflowData = buildWorkflowSequence();
      
      if (workflowData.sequence.length === 0) {
        // Show error toast instead of alert
        if (window.showToast) {
          window.showToast({
            type: 'warning',
            title: 'No Workflow Found',
            message: 'Please add nodes with connections to create a workflow.',
            duration: 4000,
          });
        }
        return;
      }
      
      setWorkflowSequence(workflowData.sequence);
      setWorkflowEndNodes(workflowData.endNodes);
      setWorkflowStep(0);
      setWorkflowState('playing');
      
      // Show start toast
      if (window.showToast) {
        window.showToast({
          type: 'info',
          title: 'Workflow Started',
          message: `Executing workflow with ${workflowData.sequence.length} node${workflowData.sequence.length === 1 ? '' : 's'}.${workflowData.endNodes.length > 1 ? ` (${workflowData.endNodes.length} end nodes detected)` : ''}`,
          duration: 3000,
        });
      }
    }
  }, [workflowState, buildWorkflowSequence]);

  const handlePauseWorkflow = useCallback(() => {
    setWorkflowState('paused');
    if (workflowTimerRef.current) {
      clearTimeout(workflowTimerRef.current);
      workflowTimerRef.current = null;
    }
    
    // Show pause toast
    if (window.showToast) {
      window.showToast({
        type: 'warning',
        title: 'Workflow Paused',
        message: 'Click Play to resume from current step.',
        duration: 3000,
      });
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
    
    // Show restart toast
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Workflow Reset',
        message: 'Workflow has been reset to initial state.',
        duration: 3000,
      });
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
      
      // Show debug stop toast
      if (window.showToast) {
        window.showToast({
          type: 'info',
          title: 'Debug Mode Stopped',
          message: 'Debugging session has ended.',
          duration: 3000,
        });
      }
    } else {
      // Start debugging
      const workflowData = buildWorkflowSequence();
      if (workflowData.sequence.length === 0) {
        // Show error toast
        if (window.showToast) {
          window.showToast({
            type: 'warning',
            title: 'No Workflow to Debug',
            message: 'Please add nodes with connections to create a workflow.',
            duration: 4000,
          });
        }
        return;
      }
      
      setWorkflowSequence(workflowData.sequence);
      setWorkflowEndNodes(workflowData.endNodes);
      setWorkflowStep(0);
      setWorkflowState('debugging');
      
      // Show debug start toast
      if (window.showToast) {
        window.showToast({
          type: 'info',
          title: 'Debug Mode Started',
          message: `Workflow will execute with 3-second delays between steps. ${workflowData.endNodes.length > 1 ? `${workflowData.endNodes.length} end nodes detected.` : ''}`,
          duration: 4000,
        });
      }
    }
  }, [workflowState, buildWorkflowSequence, highlightNode]);

  // Presentation view handler
  const handleOpenPresentationView = useCallback(() => {
    setPresentationViewOpen(true);
  }, []);

  const handleClosePresentationView = useCallback(() => {
    setPresentationViewOpen(false);
  }, []);

  // Diagram type change handler
  const handleDiagramTypeChange = useCallback((diagramType: DiagramType) => {
    setDiagramType(diagramType);
    // Show toast notification
    if (window.showToast) {
      window.showToast({
        type: 'info',
        title: 'Diagram Type Changed',
        message: `Changed to ${diagramType}. New nodes will use the appropriate type for this diagram.`,
        duration: 4000,
      });
    }
  }, [setDiagramType]);

  // Keyboard shortcuts help handler
  const handleShowKeyboardShortcuts = useCallback(() => {
    setKeyboardShortcutsOpen(true);
  }, []);

  const handleCloseKeyboardShortcuts = useCallback(() => {
    setKeyboardShortcutsOpen(false);
  }, []);

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
      id: 'examples',
      title: 'Workflow Examples',
      icon: '📚',
      defaultOpen: true,
      content: (
        <TemplateLibraryPanel
          onLoadExample={(template: WorkflowTemplate) => {
            setNodes(template.nodes);
            setEdges(template.edges);
            // Clear selections when loading new example
            setSelectedNode(null);
            setSelectedEdge(null);
            // Auto-fit view after loading
            setTimeout(() => {
              if (reactFlowInstance) {
                reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
              }
            }, 100);
          }}
        />
      ),
    },
    {
      id: 'explorer',
      title: 'Explorer',
      icon: '📁',
      defaultOpen: false,
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
          
          // Separate node-level properties from data properties
          const { 
            draggable, 
            selectable, 
            deletable, 
            zIndex,
            ...dataUpdates 
          } = updates;
          
          // Update node-level properties
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
        onNewTemplate={handleNewTemplate}
        onClear={clearDiagram}
        onSave={saveDiagram}
        onLoad={loadDiagram}
        backgroundVariant={backgroundVariant}
        onBackgroundVariantChange={handleBackgroundVariantChange}
        showMiniMap={showMiniMap}
        onMiniMapToggle={setShowMiniMap}
        onPlayWorkflow={handlePlayWorkflow}
        onPauseWorkflow={handlePauseWorkflow}
        onRestartWorkflow={handleRestartWorkflow}
        onDebugWorkflow={handleDebugWorkflow}
        workflowState={workflowState}
        showLeftSidebar={leftPanelOpen}
        onToggleLeftSidebar={() => setLeftPanelOpen(!leftPanelOpen)}
        showRightSidebar={false}
        onToggleRightSidebar={() => {}} // Placeholder - no right sidebar functionality
        snapToGrid={snapToGrid}
        onSnapToGridToggle={setSnapToGrid}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        showControls={showControls}
        onShowControlsToggle={setShowControls}
        onOpenPresentationView={handleOpenPresentationView}
        currentDiagramType={currentDiagramType}
        onDiagramTypeChange={handleDiagramTypeChange}
        onShowKeyboardShortcuts={handleShowKeyboardShortcuts}
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
            <Background 
              variant={backgroundVariant}
              gap={backgroundVariant === BackgroundVariant.Dots ? 32 : 24}
              size={backgroundVariant === BackgroundVariant.Dots ? 2.5 : 2}
              color="#cbd5e1"
              lineWidth={backgroundVariant === BackgroundVariant.Lines ? 1 : 1.5}
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

      {/* Panel Toggle Buttons */}
      {/* <PanelToggleButton
        side="left"
        isOpen={leftPanelOpen}
        onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
        label="Explorer"
      /> */}

      {/* <PanelToggleButton
        side="right"
        isOpen={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        label="Properties"
      /> */}

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
        workflowState={workflowState}
        onPlayWorkflow={handlePlayWorkflow}
        onPauseWorkflow={handlePauseWorkflow}
        onRestartWorkflow={handleRestartWorkflow}
        onDebugWorkflow={handleDebugWorkflow}
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
