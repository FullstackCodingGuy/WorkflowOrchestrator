import { NodeTypes, EdgeTypes } from 'reactflow';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowEdge } from './WorkflowEdge';

/**
 * Shared ReactFlow node types configuration
 * Used by both DiagramEditor and PresentationView to ensure consistency
 */
export const nodeTypes: NodeTypes = {
  custom: WorkflowNode,
};

/**
 * Shared ReactFlow edge types configuration
 * Used by both DiagramEditor and PresentationView to ensure consistency
 */
export const edgeTypes: EdgeTypes = {
  workflowEdge: WorkflowEdge,
  animatedSvg: WorkflowEdge, // Keep backward compatibility
};
