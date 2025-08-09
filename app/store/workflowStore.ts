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
import { APP_COLORS, NODE_DIMENSIONS, STORAGE_KEYS } from '../config/appConfig';

// Define a more specific type for node data
export interface NodeData {
  id: string;
  label: string;
  backgroundColor?: string;
  fontColor?: string;
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  importDiagram: (
    diagram: { nodes: Node[]; edges: Edge[] },
    layoutDirection?: "TB" | "LR"
  ) => void;
  exportDiagram: () => { nodes: Node[]; edges: Edge[] };
  applyLayout: (direction: "TB" | "LR") => void;
  applySmartLayout: (layoutType: "hierarchical" | "circular" | "force" | "grid") => void;
  saveDiagramToLocalStorage: () => void;
  loadDiagramFromLocalStorage: () => boolean;
  // Actions for NodeToolbar
  setSelectedNodeId: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, newData: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  // Viewport and auto-zoom state
  shouldAutoZoom: boolean;
  setShouldAutoZoom: (shouldAutoZoom: boolean) => void;
  calculateDiagramBounds: () => { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } | null;
}

const LOCAL_STORAGE_KEY = STORAGE_KEYS.diagram;

// Dagre layout logic
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const calculateOptimalSpacing = (nodeCount: number) => {
  const baseNodeSep = NODE_DIMENSIONS.minNodeSeparation;
  const baseRankSep = NODE_DIMENSIONS.minRankSeparation;
  const maxNodeSep = NODE_DIMENSIONS.maxNodeSeparation;
  const maxRankSep = NODE_DIMENSIONS.maxRankSeparation;
  
  let nodeSeparation = baseNodeSep;
  let rankSeparation = baseRankSep;
  
  if (nodeCount > 10) {
    nodeSeparation = baseNodeSep + (nodeCount - 10) * 5;
    rankSeparation = baseRankSep + (nodeCount - 10) * 8;
  }
  
  nodeSeparation = Math.min(nodeSeparation, maxNodeSep);
  rankSeparation = Math.min(rankSeparation, maxRankSep);
  
  return { nodeSeparation, rankSeparation };
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) => {
  const isHorizontal = direction === "LR";
  const { nodeSeparation, rankSeparation } = calculateOptimalSpacing(nodes.length);
  
  dagreGraph.setGraph({ 
    rankdir: direction, 
    nodesep: nodeSeparation, 
    ranksep: rankSeparation,
    marginx: NODE_DIMENSIONS.layoutMargin,
    marginy: NODE_DIMENSIONS.layoutMargin,
    ranker: nodes.length > 8 ? 'tight-tree' : 'network-simplex'
  });

  nodes.forEach((node) => {
    let nodeWidth = node.width || NODE_DIMENSIONS.defaultWidth;
    const nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
    
    if (node.data.label && node.data.label.length > 20) {
      nodeWidth = NODE_DIMENSIONS.wideWidth;
    }
    
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    const weight = edge.label ? 1 : 2;
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
      width: nodeWidth,
      height: nodeHeight,
    };
  });

  const layoutedEdges = edges.map((edge) => {
    const newEdge = { ...edge };
    delete newEdge.sourceHandle;
    delete newEdge.targetHandle;
    return newEdge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

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
        const nodeHeight = node.height || NODE_DIMENSIONS.defaultHeight;
        
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
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      const positions = nodes.map(() => ({
        x: centerX + (Math.random() - 0.5) * 400,
        y: centerY + (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0
      }));

      for (let iteration = 0; iteration < 100; iteration++) {
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

  const layoutedEdges = edges.map((edge) => {
    const newEdge = { ...edge };
    delete newEdge.sourceHandle;
    delete newEdge.targetHandle;
    return newEdge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

const workflowStateCreator: StateCreator<WorkflowState> = (set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  shouldAutoZoom: true,

  onNodesChange: (changes: NodeChange[]) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },
  onEdgesChange: (changes: EdgeChange[]) => {
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
        backgroundColor: node.data.backgroundColor || APP_COLORS.defaultBg,
      },
      width: node.width || NODE_DIMENSIONS.defaultWidth,
      height: node.height || NODE_DIMENSIONS.defaultHeight,
    };
    set((state) => ({ 
      nodes: [...state.nodes, newNode],
      shouldAutoZoom: true,
    }));
  },
  importDiagram: (
    diagram: { nodes: Node[]; edges: Edge[] },
    layoutDirection: "TB" | "LR" = "TB"
  ) => {
    const nodesWithDataDefaults = diagram.nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        id: n.id,
        backgroundColor: n.data.backgroundColor || APP_COLORS.defaultBg,
        fontColor: n.data.fontColor,
      },
      width: n.width || NODE_DIMENSIONS.defaultWidth,
      height: n.height || NODE_DIMENSIONS.defaultHeight,
    }));

    const { nodes: layoutedNodes, edges } = getLayoutedElements(
      nodesWithDataDefaults,
      diagram.edges || [],
      layoutDirection
    );
    set({
      nodes: layoutedNodes,
      edges: edges,
      shouldAutoZoom: true,
    });
  },
  exportDiagram: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
  applyLayout: (direction: "TB" | "LR") => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      shouldAutoZoom: true,
    });
  },

  applySmartLayout: (layoutType: "hierarchical" | "circular" | "force" | "grid") => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getSmartLayoutElements(
      nodes,
      edges,
      layoutType
    );
    set({
      nodes: layoutedNodes,
      edges: layoutedEdges,
      shouldAutoZoom: true,
    });
  },

  saveDiagramToLocalStorage: () => {
    try {
      const { nodes, edges } = get().exportDiagram();
      const diagramToSave = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(diagramToSave));
      console.log("Diagram saved to LocalStorage.");
    } catch (error) {
      console.error("Error saving diagram to LocalStorage:", error);
    }
  },

  loadDiagramFromLocalStorage: () => {
    try {
      const savedDiagramJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDiagramJSON) {
        const savedDiagram = JSON.parse(savedDiagramJSON);
        if (savedDiagram && savedDiagram.nodes && savedDiagram.edges) {
          get().importDiagram(
            { nodes: savedDiagram.nodes, edges: savedDiagram.edges },
            "TB"
          );
          console.log("Diagram loaded from LocalStorage.");
          return true;
        }
      }
    } catch (error) {
      console.error("Error loading diagram from LocalStorage:", error);
    }
    return false;
  },

  setSelectedNodeId: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeData: (nodeId: string, newData: Partial<NodeData>) => {
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
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  duplicateNode: (nodeId: string) => {
    const { nodes, addNode } = get();
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNodeId = `${nodeToDuplicate.type}_${Date.now()}`;
      const duplicatedNode: Node = {
        ...nodeToDuplicate,
        id: newNodeId,
        data: { ...nodeToDuplicate.data, id: newNodeId },
        position: {
          x: (nodeToDuplicate.position.x || 0) + 30,
          y: (nodeToDuplicate.position.y || 0) + 30,
        },
        selected: false,
      };
      addNode(duplicatedNode);
    }
  },

  setShouldAutoZoom: (shouldAutoZoom: boolean) => {
    set({ shouldAutoZoom });
  },

  calculateDiagramBounds: () => {
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
});

const useWorkflowStore = create<WorkflowState>(workflowStateCreator);

export default useWorkflowStore;
