import { create, StateCreator } from "zustand";
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Position,
} from "reactflow";
import dagre from "dagre";
import { APP_COLORS, NODE_DIMENSIONS, STORAGE_KEYS, DEFAULT_DIAGRAM_TYPE, DiagramType, DIAGRAM_TYPE_DEFAULT_NODE } from '../config/appConfig';

// Define node type for workflow logic
export type WorkflowNodeType = 'start' | 'process' | 'decision' | 'condition' | 'action' | 'end' | 'custom';

// Define a more specific type for node data
export interface NodeData {
  id: string;
  label: string;
  backgroundColor: string; // Changed from optional to required
  fontColor?: string; // Added for dynamic styling
  nodeType?: WorkflowNodeType; // New node type attribute for workflow logic
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  areEdgesAnimated: boolean;
  selectedNodeId: string | null; // Added for properties panel
  // Diagram type management
  currentDiagramType: DiagramType;
  setDiagramType: (diagramType: DiagramType) => void;
  getDefaultNodeTypeForDiagram: () => string;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  importWorkflow: (
    workflow: { nodes: Node[]; edges: Edge[] },
    layoutDirection?: "TB" | "LR"
  ) => void;
  exportWorkflow: () => { nodes: Node[]; edges: Edge[] };
  toggleEdgeAnimation: () => void;
  applyLayout: (direction: "TB" | "LR") => void;
  applySmartLayout: (layoutType: "hierarchical" | "circular" | "force" | "grid") => void;
  saveWorkflowToLocalStorage: () => void;
  loadWorkflowFromLocalStorage: () => boolean;
  // Actions for NodeToolbar
  setSelectedNodeId: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, newData: Partial<NodeData>) => void; // Use Partial<NodeData>
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  // New state and actions for message flow
  isMessageFlowing: boolean;
  startMessageFlow: () => void;
  stopMessageFlow: () => void;
  // Viewport and auto-zoom state
  shouldAutoZoom: boolean;
  setShouldAutoZoom: (shouldAutoZoom: boolean) => void;
  calculateWorkflowBounds: () => { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } | null;
}

const LOCAL_STORAGE_KEY = STORAGE_KEYS.workflow;

// Dagre layout logic with improved tree organization
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Enhanced layout calculation with adaptive spacing
const calculateOptimalSpacing = (nodeCount: number) => {
  // Use configuration values
  const baseNodeSep = NODE_DIMENSIONS.minNodeSeparation;
  const baseRankSep = NODE_DIMENSIONS.minRankSeparation;
  const maxNodeSep = NODE_DIMENSIONS.maxNodeSeparation;
  const maxRankSep = NODE_DIMENSIONS.maxRankSeparation;
  
  // Adjust spacing based on workflow complexity
  let nodeSeparation = baseNodeSep;
  let rankSeparation = baseRankSep;
  
  if (nodeCount > 10) {
    // For complex workflows, increase spacing
    nodeSeparation = baseNodeSep + (nodeCount - 10) * 5;
    rankSeparation = baseRankSep + (nodeCount - 10) * 8;
  }
  
  // Apply maximum spacing limits
  nodeSeparation = Math.min(nodeSeparation, maxNodeSep);
  rankSeparation = Math.min(rankSeparation, maxRankSep);
  
  return { nodeSeparation, rankSeparation };
};

// Calculate node hierarchy depth for better positioning
/*
const calculateNodeHierarchy = (nodes: Node[], edges: Edge[]) => {
  const hierarchy: { [nodeId: string]: number } = {};
  const visited = new Set<string>();
  
  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(n => !incomingEdges.has(n.id));
  
  // BFS to assign hierarchy levels
  const queue: Array<{ nodeId: string; depth: number }> = 
    rootNodes.map(n => ({ nodeId: n.id, depth: 0 }));
  
  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;
    
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    hierarchy[nodeId] = depth;
    
    // Add children to queue
    const childEdges = edges.filter(e => e.source === nodeId);
    childEdges.forEach(edge => {
      if (!visited.has(edge.target)) {
        queue.push({ nodeId: edge.target, depth: depth + 1 });
      }
    });
  }
  
  return hierarchy;
};
*/

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) => {
  const isHorizontal = direction === "LR";
  const { nodeSeparation, rankSeparation } = calculateOptimalSpacing(nodes.length);
  
  // Configure dagre with adaptive spacing and improved algorithms
  dagreGraph.setGraph({ 
    rankdir: direction, 
    nodesep: nodeSeparation, 
    ranksep: rankSeparation,
    marginx: NODE_DIMENSIONS.layoutMargin,
    marginy: NODE_DIMENSIONS.layoutMargin,
    // Use better ranking algorithm for complex graphs
    ranker: nodes.length > 8 ? 'tight-tree' : 'network-simplex'
  });

  nodes.forEach((node) => {
    // Get actual node dimensions, with smart defaults based on node type
    let nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
    let nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
    
    // Adjust dimensions based on node type for better visual hierarchy
    if (node.type === 'condition') {
      nodeHeight = NODE_DIMENSIONS.conditionHeight;
    } else if (node.type === 'start' || node.type === 'end') {
      nodeHeight = NODE_DIMENSIONS.startEndHeight;
    }
    
    // Wider nodes for complex labels
    if (node.data.label && node.data.label.length > 20) {
      nodeWidth = NODE_DIMENSIONS.wideWidth;
    }
    
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    // Add edge weight based on importance (main flow vs conditional branches)
    const weight = edge.label ? 1 : 2; // Main flow edges get higher weight
    dagreGraph.setEdge(edge.source, edge.target, { weight });
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
    const nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
    
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      // Ensure dimensions are set for consistent rendering
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  // Update edges to remove explicit handles and use node's default connection points
  const layoutedEdges = edges.map((edge) => {
    // Create a new edge object without sourceHandle and targetHandle properties
    const newEdge = { ...edge };
    delete newEdge.sourceHandle;
    delete newEdge.targetHandle;
    return newEdge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

// Smart layout algorithms for better node arrangement
const getSmartLayoutElements = (
  nodes: Node[],
  edges: Edge[],
  layoutType: "hierarchical" | "circular" | "force" | "grid"
) => {
  let layoutedNodes: Node[] = [];

  const { nodeSeparation, rankSeparation } = calculateOptimalSpacing(nodes.length);
  const canvasWidth = Math.max(1200, nodes.length * 200);
  const canvasHeight = Math.max(800, nodes.length * 150);

  switch (layoutType) {
    case "hierarchical": {
      // Enhanced hierarchical layout using Dagre with better spacing
      dagreGraph.setGraph({ 
        rankdir: "TB", 
        nodesep: nodeSeparation * 1.2, 
        ranksep: rankSeparation * 1.5,
        marginx: NODE_DIMENSIONS.layoutMargin,
        marginy: NODE_DIMENSIONS.layoutMargin,
        ranker: 'tight-tree'
      });

      nodes.forEach((node) => {
        let nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
        let nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
        
        if (node.type === 'condition') {
          nodeHeight = NODE_DIMENSIONS.conditionHeight;
        } else if (node.type === 'start' || node.type === 'end') {
          nodeHeight = NODE_DIMENSIONS.startEndHeight;
        }
        
        if (node.data.label && node.data.label.length > 20) {
          nodeWidth = NODE_DIMENSIONS.wideWidth;
        }
        
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target, { weight: 2 });
      });

      dagre.layout(dagreGraph);

      layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
        const nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
        
        return {
          ...node,
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
          width: nodeWidth,
          height: nodeHeight,
        };
      });
      break;
    }

    case "circular": {
      // Circular arrangement - great for understanding connections
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = Math.min(canvasWidth, canvasHeight) / 3;
      
      layoutedNodes = nodes.map((node, index) => {
        const angle = (2 * Math.PI * index) / nodes.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        return {
          ...node,
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          position: {
            x: x - (node.width || NODE_DIMENSIONS.defaultWidth) / 2,
            y: y - (node.height || NODE_DIMENSIONS.defaultHeight) / 2,
          },
          width: node.width || NODE_DIMENSIONS.defaultWidth,
          height: node.height || NODE_DIMENSIONS.defaultHeight,
        };
      });
      break;
    }

    case "force": {
      // Force-directed layout simulation for organic arrangement
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      // Create a simple force simulation
      const positions = nodes.map(() => ({
        x: centerX + (Math.random() - 0.5) * 400,
        y: centerY + (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0
      }));

      // Run simulation iterations
      for (let iteration = 0; iteration < 100; iteration++) {
        // Repulsive forces between nodes
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = Math.min(500, 2000 / (distance * distance));
            
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            positions[i].vx += fx * 0.1;
            positions[i].vy += fy * 0.1;
            positions[j].vx -= fx * 0.1;
            positions[j].vy -= fy * 0.1;
          }
        }

        // Attractive forces for connected nodes
        edges.forEach(edge => {
          const sourceIndex = nodes.findIndex(n => n.id === edge.source);
          const targetIndex = nodes.findIndex(n => n.id === edge.target);
          
          if (sourceIndex !== -1 && targetIndex !== -1) {
            const dx = positions[targetIndex].x - positions[sourceIndex].x;
            const dy = positions[targetIndex].y - positions[sourceIndex].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = distance * 0.01;
            
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            positions[sourceIndex].vx += fx;
            positions[sourceIndex].vy += fy;
            positions[targetIndex].vx -= fx;
            positions[targetIndex].vy -= fy;
          }
        });

        // Apply velocities and damping
        positions.forEach(pos => {
          pos.x += pos.vx;
          pos.y += pos.vy;
          pos.vx *= 0.8;
          pos.vy *= 0.8;
        });
      }

      layoutedNodes = nodes.map((node, index) => ({
        ...node,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        position: {
          x: Math.max(50, Math.min(canvasWidth - 200, positions[index].x - (node.width || NODE_DIMENSIONS.defaultWidth) / 2)),
          y: Math.max(50, Math.min(canvasHeight - 150, positions[index].y - (node.height || NODE_DIMENSIONS.defaultHeight) / 2)),
        },
        width: node.width || NODE_DIMENSIONS.defaultWidth,
        height: node.height || NODE_DIMENSIONS.defaultHeight,
      }));
      break;
    }

    case "grid": {
      // Grid layout - clean and organized
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const cellWidth = (canvasWidth - 100) / cols;
      const cellHeight = (canvasHeight - 100) / Math.ceil(nodes.length / cols);
      
      layoutedNodes = nodes.map((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        return {
          ...node,
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          position: {
            x: 50 + col * cellWidth + cellWidth / 2 - (node.width || NODE_DIMENSIONS.defaultWidth) / 2,
            y: 50 + row * cellHeight + cellHeight / 2 - (node.height || NODE_DIMENSIONS.defaultHeight) / 2,
          },
          width: node.width || NODE_DIMENSIONS.defaultWidth,
          height: node.height || NODE_DIMENSIONS.defaultHeight,
        };
      });
      break;
    }

    default:
      layoutedNodes = nodes;
  }

  // Process edges to remove explicit handles for all smart layouts
  const layoutedEdges = edges.map((edge) => {
    // Create a new edge object without sourceHandle and targetHandle properties
    const newEdge = { ...edge };
    delete newEdge.sourceHandle;
    delete newEdge.targetHandle;
    return newEdge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const workflowStateCreator: StateCreator<WorkflowState> = (set, get) => ({
  nodes: [
    {
      id: "startNode1",
      type: "start",
      data: { id: "startNode1", label: "Start", backgroundColor: APP_COLORS.defaultBg, nodeType: "start" }, // Added nodeType
      position: { x: 250, y: 5 },
      width: NODE_DIMENSIONS.defaultWidth, // Provide initial dimensions
      height: NODE_DIMENSIONS.startEndHeight,
    },
  ],
  edges: [],
  areEdgesAnimated: false, // Initialize animation state
  selectedNodeId: null, // Initialize selectedNodeId
  isMessageFlowing: false, // Initialize message flow state
  shouldAutoZoom: true, // Initialize auto-zoom state

  onNodesChange: (changes: NodeChange[]) => {
    console.log('Node changes: ', changes)
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    console.log("Edge changes:", changes); // Debugging log
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  addNode: (node: Node) => {
    const newNode = {
      ...node,
      data: {
        ...node.data,
        id: node.id,
        backgroundColor: node.data.backgroundColor || APP_COLORS.defaultBg, // Ensure default bg for new nodes
      },
      width: node.width || NODE_DIMENSIONS.defaultWidth, // Default width for new nodes
      height: node.height || NODE_DIMENSIONS.defaultHeight, // Default height for new nodes
    };
    set((state) => ({ 
      nodes: [...state.nodes, newNode],
      shouldAutoZoom: true, // Trigger auto-zoom when adding nodes
    }));
  },
  importWorkflow: (
    workflow: { nodes: Node[]; edges: Edge[] },
    layoutDirection: "TB" | "LR" = "TB"
  ) => {
    const currentAnimatedState = get().areEdgesAnimated;
    const nodesWithDataDefaults = workflow.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        id: n.id,
        backgroundColor: n.data.backgroundColor || APP_COLORS.defaultBg, // Ensure default bg for imported nodes
        fontColor: n.data.fontColor, // Preserve imported font color or undefined
      },
      width: n.width || NODE_DIMENSIONS.defaultWidth,
      height: n.height || NODE_DIMENSIONS.defaultHeight,
    }));
    const edgesWithAnimationState = workflow.edges.map((edge) => ({
      ...edge,
      animated: currentAnimatedState,
    }));

    const { nodes: layoutedNodes, edges } = getLayoutedElements(
      nodesWithDataDefaults,
      edgesWithAnimationState || [],
      layoutDirection
    );
    set({
      nodes: layoutedNodes,
      edges: edges,
      shouldAutoZoom: true, // Trigger auto-zoom after import
    });
  },
  exportWorkflow: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
  toggleEdgeAnimation: () => {
    // add a code block to disable the animation for first edge
    set((state) => {
      if (state.edges.length === 0) return {};
      const updatedEdges = state.edges.map((edge, idx) =>
        idx === 0 ? { ...edge, animated: true } : edge
      );
      return { edges: updatedEdges, areEdgesAnimated: !state.areEdgesAnimated };
    });
    // set((state) => ({
    //   areEdgesAnimated: !state.areEdgesAnimated,
    //   edges: state.edges.map(edge => ({
    //     ...edge,
    //     animated: !state.areEdgesAnimated,
    //     // Do not change edge type here, only animation style for default edges
    //   })),
    // }));
  },
  applyLayout: (direction: "TB" | "LR") => {
    const { nodes, edges, isMessageFlowing } = get(); // get isMessageFlowing
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges.map((edge) => ({
        ...edge,
        animated: get().areEdgesAnimated && !isMessageFlowing, // CSS animation only if not message flowing
        type: isMessageFlowing ? "dotFlow" : undefined, // Keep dotFlow if active
      })),
      shouldAutoZoom: true, // Trigger auto-zoom after layout
    });
  },

  applySmartLayout: (layoutType: "hierarchical" | "circular" | "force" | "grid") => {
    const { nodes, edges, isMessageFlowing } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayoutElements(
      nodes,
      edges,
      layoutType
    );
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges.map((edge) => ({
        ...edge,
        animated: get().areEdgesAnimated && !isMessageFlowing,
        type: isMessageFlowing ? "dotFlow" : undefined,
      })),
      shouldAutoZoom: true,
    });
  },

  saveWorkflowToLocalStorage: () => {
    try {
      const { nodes, edges } = get().exportWorkflow();
      const workflowToSave = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      }; // Add a timestamp
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workflowToSave));
      console.log("Workflow saved to LocalStorage.");
    } catch (error) {
      console.error("Error saving workflow to LocalStorage:", error);
    }
  },

  loadWorkflowFromLocalStorage: () => {
    try {
      const savedWorkflowJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedWorkflowJSON) {
        const savedWorkflow = JSON.parse(savedWorkflowJSON);
        if (savedWorkflow && savedWorkflow.nodes && savedWorkflow.edges) {
          // Use importWorkflow to correctly process and layout the loaded data
          // Defaulting to 'TB' layout, can be made configurable or saved with workflow
          get().importWorkflow(
            { nodes: savedWorkflow.nodes, edges: savedWorkflow.edges },
            "TB"
          );
          console.log("Workflow loaded from LocalStorage.");
          return true;
        }
      }
    } catch (error) {
      console.error("Error loading workflow from LocalStorage:", error);
    }
    return false;
  },

  // Implementations for NodeToolbar actions
  setSelectedNodeId: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeData: (nodeId: string, newData: Partial<NodeData>) => {
    // Use Partial<NodeData>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    }));
  },

  deleteNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId, // Deselect if deleted
    }));
  },

  duplicateNode: (nodeId: string) => {
    const { nodes, addNode } = get();
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNodeId = `${nodeToDuplicate.type}_${Date.now()}`; // Simple unique ID
      const duplicatedNode: Node = {
        ...nodeToDuplicate,
        id: newNodeId,
        data: { ...nodeToDuplicate.data, id: newNodeId }, // Ensure new data.id
        position: {
          x: (nodeToDuplicate.position.x || 0) + 30, // Offset slightly
          y: (nodeToDuplicate.position.y || 0) + 30,
        },
        selected: false, // Ensure duplicated node is not selected initially
      };
      addNode(duplicatedNode);
      // Note: addNode already sets shouldAutoZoom to true
    }
  },

  // Message flow actions
  startMessageFlow: () => {
    set((state) => ({
      isMessageFlowing: true,
      areEdgesAnimated: false, // Turn off default CSS animation
      edges: state.edges.map((edge) => ({
        ...edge,
        type: "dotFlow",
        animated: false, // Ensure CSS animation is off for custom edge
      })),
    }));
  },

  stopMessageFlow: () => {
    set((state) => ({
      isMessageFlowing: false,
      // Restore areEdgesAnimated state for default edges if needed, or set to a default
      // For now, let's assume we want to turn off all animations when stopping message flow.
      // If toggleEdgeAnimation was used before starting message flow, its state is lost here.
      // A more robust solution might store the pre-message-flow animation state.
      areEdgesAnimated: false,
      edges: state.edges.map((edge) => ({
        ...edge,
        type: undefined, // Revert to default edge type
        animated: false, // Ensure CSS animation is off
      })),
    }));
  },

  // Viewport and auto-zoom methods
  setShouldAutoZoom: (shouldAutoZoom: boolean) => {
    set({ shouldAutoZoom });
  },

  calculateWorkflowBounds: () => {
    const { nodes } = get();
    if (nodes.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      const nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
      const nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
      const x = node.position.x;
      const y = node.position.y;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + nodeWidth);
      maxY = Math.max(maxY, y + nodeHeight);
    });

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  },

  // Diagram type management
  currentDiagramType: DEFAULT_DIAGRAM_TYPE,
  
  setDiagramType: (diagramType: DiagramType) => {
    set({ currentDiagramType: diagramType });
  },
  
  getDefaultNodeTypeForDiagram: () => {
    const { currentDiagramType } = get();
    return DIAGRAM_TYPE_DEFAULT_NODE[currentDiagramType];
  },
});

const useWorkflowStore = create<WorkflowState>(workflowStateCreator);

export default useWorkflowStore;
