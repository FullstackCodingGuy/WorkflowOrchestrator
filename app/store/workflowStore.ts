import { create, StateCreator } from 'zustand';
import { Node, Edge, OnNodesChange, OnEdgesChange, applyNodeChanges, applyEdgeChanges, addEdge, OnConnect, NodeChange, EdgeChange, Connection } from 'reactflow';

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  importWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }) => void;
  exportWorkflow: () => { nodes: Node[]; edges: Edge[] };
}

const workflowStateCreator: StateCreator<WorkflowState> = (set, get) => ({
  nodes: [
    {
      id: 'startNode1',
      type: 'start',
      data: { label: 'Start' },
      position: { x: 250, y: 5 },
    },
  ],
  edges: [],
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
      edges: addEdge(connection, state.edges),
    }));
  },
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  addNode: (node: Node) => set((state) => ({ nodes: [...state.nodes, node] })),
  importWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }) => {
    set({ nodes: workflow.nodes || [], edges: workflow.edges || [] });
  },
  exportWorkflow: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
});

const useWorkflowStore = create<WorkflowState>(workflowStateCreator);

export default useWorkflowStore;
