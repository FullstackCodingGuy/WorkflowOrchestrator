import { create, StateCreator } from 'zustand';
import {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Position
} from 'reactflow';
import dagre from 'dagre';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  areEdgesAnimated: boolean; // <-- New state for edge animation
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  importWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }, layoutDirection?: 'TB' | 'LR') => void; // Modified to accept layout direction
  exportWorkflow: () => { nodes: Node[]; edges: Edge[] };
  toggleEdgeAnimation: () => void; // <-- New function to toggle animation
  applyLayout: (direction: 'TB' | 'LR') => void; // <-- New function to apply layout
}

// Dagre layout logic
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') => {
  const isHorizontal = direction === 'LR';
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
      id: 'startNode1',
      type: 'start',
      data: { id: 'startNode1', label: 'Start' }, // Ensure data.id is present
      position: { x: 250, y: 5 },
      width: 180, // Provide initial dimensions
      height: 60,
    },
  ],
  edges: [],
  areEdgesAnimated: false, // Initialize animation state
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
  onConnect: (connection: Connection) => {
    set((state) => ({
      edges: addEdge({ ...connection, animated: state.areEdgesAnimated }, state.edges), // Apply animation status on new edges
    }));
  },
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  addNode: (node: Node) => {
    const newNode = {
      ...node,
      data: { ...node.data, id: node.id }, // Ensure data.id is set for new nodes
      width: node.width || 180, // Default width for new nodes
      height: node.height || 60, // Default height for new nodes
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },
  importWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }, layoutDirection: 'TB' | 'LR' = 'TB') => {
    const nodesWithDataId = workflow.nodes.map(n => ({
      ...n,
      data: { ...n.data, id: n.id },
      width: n.width || 180,
      height: n.height || 60,
    }));
    const { nodes: layoutedNodes, edges } = getLayoutedElements(nodesWithDataId, workflow.edges || [], layoutDirection);
    set({
      nodes: layoutedNodes,
      edges: edges.map(edge => ({ ...edge, animated: get().areEdgesAnimated }))
    });
  },
  exportWorkflow: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
  toggleEdgeAnimation: () => {
    set((state) => ({
      areEdgesAnimated: !state.areEdgesAnimated,
      edges: state.edges.map(edge => ({ ...edge, animated: !state.areEdgesAnimated })),
    }));
  },
  applyLayout: (direction: 'TB' | 'LR') => {
    const { nodes, edges } = get().exportWorkflow(); // Use existing exportWorkflow to get current elements
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    set({ nodes: layoutedNodes, edges: layoutedEdges.map(edge => ({ ...edge, animated: get().areEdgesAnimated })) });
  },
});

const useWorkflowStore = create<WorkflowState>(workflowStateCreator);

export default useWorkflowStore;
