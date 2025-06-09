import { Node, Edge, Position } from 'reactflow';

export interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  layoutDirection: 'TB' | 'LR';
}

export const workflowExamples: WorkflowExample[] = [
  {
    name: 'Simple Linear Flow',
    description: 'A basic sequence: Start -> Action -> End.',
    layoutDirection: 'TB',
    nodes: [
      {
        id: 'ex1-start',
        type: 'start',
        data: { id: 'ex1-start', label: 'Start Process' },
        position: { x: 0, y: 0 }, // Position will be set by layout
        width: 180,
        height: 60,
      },
      {
        id: 'ex1-action1',
        type: 'action',
        data: { id: 'ex1-action1', label: 'Perform Task' },
        position: { x: 0, y: 0 },
        width: 180,
        height: 60,
      },
      {
        id: 'ex1-end',
        type: 'end',
        data: { id: 'ex1-end', label: 'End Process' },
        position: { x: 0, y: 0 },
        width: 180,
        height: 60,
      },
    ],
    edges: [
      { id: 'ex1-e1-2', source: 'ex1-start', target: 'ex1-action1', animated: false },
      { id: 'ex1-e2-3', source: 'ex1-action1', target: 'ex1-end', animated: false },
    ],
  },
  {
    name: 'Conditional Branch Flow',
    description: 'A flow with a condition splitting into two paths.',
    layoutDirection: 'TB',
    nodes: [
      { id: 'ex2-start', type: 'start', data: { id: 'ex2-start', label: 'Begin' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex2-action1', type: 'action', data: { id: 'ex2-action1', label: 'Initial Step' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex2-cond1', type: 'condition', data: { id: 'ex2-cond1', label: 'Check Status' }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'ex2-action-true', type: 'action', data: { id: 'ex2-action-true', label: 'Path A Action' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex2-action-false', type: 'action', data: { id: 'ex2-action-false', label: 'Path B Action' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex2-end-true', type: 'end', data: { id: 'ex2-end-true', label: 'End A' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex2-end-false', type: 'end', data: { id: 'ex2-end-false', label: 'End B' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
    ],
    edges: [
      { id: 'ex2-e-s-a1', source: 'ex2-start', target: 'ex2-action1', animated: false },
      { id: 'ex2-e-a1-c1', source: 'ex2-action1', target: 'ex2-cond1', animated: false },
      // Assuming ConditionNode has handles like 'condition-source-right-true' and 'condition-source-bottom-false'
      // The actual handle IDs will depend on ConditionNode.tsx implementation.
      // For now, using generic source handles and relying on layout.
      // The handle IDs in ConditionNode.tsx are `${id}-source-right-true` and `${id}-source-bottom-false`
      { id: 'ex2-e-c1-at', source: 'ex2-cond1', sourceHandle: 'ex2-cond1-source-right-true', target: 'ex2-action-true', label: 'True', animated: false },
      { id: 'ex2-e-c1-af', source: 'ex2-cond1', sourceHandle: 'ex2-cond1-source-bottom-false', target: 'ex2-action-false', label: 'False', animated: false },
      { id: 'ex2-e-at-et', source: 'ex2-action-true', target: 'ex2-end-true', animated: false },
      { id: 'ex2-e-af-ef', source: 'ex2-action-false', target: 'ex2-end-false', animated: false },
    ],
  },
  {
    name: 'Multi-Step Approval',
    description: 'A more complex flow with sequential actions and multiple conditions.',
    layoutDirection: 'LR',
    nodes: [
      { id: 'ex3-start', type: 'start', data: { id: 'ex3-start', label: 'Request Submitted' }, position: { x: 0, y: 0 }, width: 200, height: 60 },
      { id: 'ex3-action1', type: 'action', data: { id: 'ex3-action1', label: 'Manager Review' }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'ex3-cond1', type: 'condition', data: { id: 'ex3-cond1', label: 'Manager Approved?' }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'ex3-action2', type: 'action', data: { id: 'ex3-action2', label: 'Director Review' }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'ex3-cond2', type: 'condition', data: { id: 'ex3-cond2', label: 'Director Approved?' }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'ex3-action-final', type: 'action', data: { id: 'ex3-action-final', label: 'Notify Approved' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex3-action-reject', type: 'action', data: { id: 'ex3-action-reject', label: 'Notify Rejected' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex3-end-approved', type: 'end', data: { id: 'ex3-end-approved', label: 'Process Complete' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'ex3-end-rejected', type: 'end', data: { id: 'ex3-end-rejected', label: 'Process Halted' }, position: { x: 0, y: 0 }, width: 180, height: 60 },
    ],
    edges: [
      { id: 'ex3-e1', source: 'ex3-start', target: 'ex3-action1', animated: false },
      { id: 'ex3-e2', source: 'ex3-action1', target: 'ex3-cond1', animated: false },
      { id: 'ex3-e3', source: 'ex3-cond1', sourceHandle: 'ex3-cond1-source-right-true', target: 'ex3-action2', label: 'Yes', animated: false },
      { id: 'ex3-e4', source: 'ex3-cond1', sourceHandle: 'ex3-cond1-source-bottom-false', target: 'ex3-action-reject', label: 'No', animated: false },
      { id: 'ex3-e5', source: 'ex3-action2', target: 'ex3-cond2', animated: false },
      { id: 'ex3-e6', source: 'ex3-cond2', sourceHandle: 'ex3-cond2-source-right-true', target: 'ex3-action-final', label: 'Yes', animated: false },
      { id: 'ex3-e7', source: 'ex3-cond2', sourceHandle: 'ex3-cond2-source-bottom-false', target: 'ex3-action-reject', label: 'No', animated: false },
      { id: 'ex3-e8', source: 'ex3-action-final', target: 'ex3-end-approved', animated: false },
      { id: 'ex3-e9', source: 'ex3-action-reject', target: 'ex3-end-rejected', animated: false },
    ],
  },
];
