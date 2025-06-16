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
  backgroundColor: string; // Changed from optional to required
  fontColor?: string; // Added for dynamic styling
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  areEdgesAnimated: boolean;
  selectedNodeId: string | null; // Added for properties panel
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
}

const LOCAL_STORAGE_KEY = STORAGE_KEYS.workflow;

// Dagre layout logic
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 100 }); // Increased separation

  nodes.forEach((node) => {
    // Estimate node dimensions if not present (important for layout)
    const nodeWidth = node.width || 180; // Default width
    const nodeHeight = node.height || 60; // Default height
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - (node.width || 180) / 2,
        y: nodeWithPosition.y - (node.height || 60) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const workflowStateCreator: StateCreator<WorkflowState> = (set, get) => ({
  nodes: [
    {
      id: "startNode1",
      type: "start",
      data: { id: "startNode1", label: "Start", backgroundColor: APP_COLORS.defaultBg }, // Added default backgroundColor
      position: { x: 250, y: 5 },
      width: NODE_DIMENSIONS.defaultWidth, // Provide initial dimensions
      height: NODE_DIMENSIONS.startEndHeight,
    },
  ],
  edges: [],
  areEdgesAnimated: false, // Initialize animation state
  selectedNodeId: null, // Initialize selectedNodeId
  isMessageFlowing: false, // Initialize message flow state

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
    set((state) => ({ nodes: [...state.nodes, newNode] }));
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
});

const useWorkflowStore = create<WorkflowState>(workflowStateCreator);

export default useWorkflowStore;
