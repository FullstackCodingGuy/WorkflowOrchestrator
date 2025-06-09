'use client';

import React, { useCallback, useRef, useState } from 'react'; // Removed useMemo
import ReactFlow,
{
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  ConnectionMode,
  useReactFlow,
  addEdge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import StartNode from './StartNode';
import ActionNode from './ActionNode';
import ConditionNode from './ConditionNode';
import EndNode from './EndNode';
import PropertiesPanel from './PropertiesPanel';
import useWorkflowStore from '../store/workflowStore';
import { connectionRules } from '../config/workflowConfig'; // Import connection rules from the new config file
import DotFlowEdge from './DotFlowEdge';

// Define nodeTypes and edgeTypes directly at the module scope
const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
  end: EndNode,
};

const edgeTypes: EdgeTypes = {
  dotFlow: DotFlowEdge,
};

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    setEdges,
    areEdgesAnimated,
    setSelectedNodeId, // Added to use for onNodeClick and onPaneClick
  } = useWorkflowStore();

  const { project } = useReactFlow(); // For projecting screen to flow coordinates
  const connectingNodeId = useRef<string | null>(null); // To store the source node id when starting a connection

  // const [selectedNode, setSelectedNode] = useState<Node | null>(null); // Removed, selection handled by store
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // setSelectedNode(node); // Removed, use store action
    setSelectedNodeId(node.id); // Use store action
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    // setSelectedNode(null); // Removed, use store action
    setSelectedNodeId(null); // Use store action
  }, [setSelectedNodeId]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const typeAndLabel = event.dataTransfer.getData('application/reactflow');
      
      if (!typeAndLabel) {
        return;
      }
      try {
        const { nodeType, label } = JSON.parse(typeAndLabel);

        if (typeof nodeType === 'undefined' || !nodeType) {
          console.error("Dropped item doesn't have a valid nodeType");
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        const newNodeId = `dndnode_${+new Date()}`;
        const newNode: Node = {
          id: newNodeId,
          type: nodeType,
          position,
          data: { id: newNodeId, label: `${label}` }, // Ensure data.id is set
          width: 180, // Default width
          height: 60, // Default height
        };

        addNode(newNode);
      } catch (error) {
        console.error("Failed to parse dropped data:", error);
      }
    },
    [reactFlowInstance, addNode]
  );

  // --- Add Node On Edge Drop ---
  const onConnectStart = useCallback((_: React.MouseEvent | React.TouchEvent, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current || !reactFlowWrapper.current || !reactFlowInstance) return;

      const targetIsPane = (event.target as HTMLElement).classList.contains('react-flow__pane');

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        // Determine clientX and clientY based on event type
        let clientX, clientY;
        if (event instanceof MouseEvent) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else if (event instanceof TouchEvent && event.touches && event.touches.length > 0) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          return; // Or handle error
        }

        const position = project({
          x: clientX - left,
          y: clientY - top,
        });

        // For simplicity, adding an 'action' node. This could be made configurable.
        const newNodeId = `edgeconnect_${+new Date()}`;
        const newNode: Node = {
          id: newNodeId,
          type: 'action', // Default new node type
          position,
          data: { id: newNodeId, label: 'New Action' },
          width: 180,
          height: 60,
        };
        
        addNode(newNode);

        // Create a new edge to the new node
        const newEdge = {
          id: `e-${connectingNodeId.current}-${newNodeId}`,
          source: connectingNodeId.current,
          target: newNodeId,
          animated: areEdgesAnimated,
        };
        setEdges(addEdge(newEdge, edges));
      }
    },
    [project, addNode, setEdges, edges, areEdgesAnimated, reactFlowInstance] // reactFlowInstance was missing
  );

  // --- Connection Limit & Custom onConnect ---
  const onConnectCustom = useCallback(
    (params: Connection) => {
      const { source, target, sourceHandle, targetHandle } = params;
      if (!source || !target) return; // Should not happen with valid connections

      const sourceNode = nodes.find(node => node.id === source); // nodes from useWorkflowStore()
      const targetNode = nodes.find(node => node.id === target); // nodes from useWorkflowStore()

      if (!sourceNode || !targetNode) {
        console.warn('Source or target node not found');
        return;
      }

      const sourceNodeType = sourceNode.type;
      const targetNodeType = targetNode.type;

      // Check source node limits
      if (sourceNodeType && connectionRules[sourceNodeType]) {
        const rules = connectionRules[sourceNodeType];
        const outgoingEdges = edges.filter(edge => edge.source === source);

        if (rules.nodeOverallSourceMax !== undefined && outgoingEdges.length >= rules.nodeOverallSourceMax) {
          alert(`${sourceNodeType} node can only have ${rules.nodeOverallSourceMax} outgoing connection(s).`);
          return;
        }
        // Check specific source handle limit
        if (sourceHandle && rules.handleSpecific && rules.handleSpecific[sourceHandle] && rules.handleSpecific[sourceHandle].type === 'source') {
          const handleRules = rules.handleSpecific[sourceHandle];
          const handleOutgoingEdges = edges.filter(edge => edge.source === source && edge.sourceHandle === sourceHandle);
          if (handleOutgoingEdges.length >= handleRules.max) {
            alert(`Handle ${sourceHandle} on ${sourceNodeType} node can only have ${handleRules.max} outgoing connection(s).`);
            return;
          }
        }
      }

      // Check target node limits
      if (targetNodeType && connectionRules[targetNodeType]) {
        const rules = connectionRules[targetNodeType];
        const incomingEdges = edges.filter(edge => edge.target === target);

        if (rules.nodeOverallTargetMax !== undefined && incomingEdges.length >= rules.nodeOverallTargetMax) {
          alert(`${targetNodeType} node can only have ${rules.nodeOverallTargetMax} incoming connection(s).`);
          return;
        }
        // Check specific target handle limit
        if (targetHandle && rules.handleSpecific && rules.handleSpecific[targetHandle] && rules.handleSpecific[targetHandle].type === 'target') {
          const handleRules = rules.handleSpecific[targetHandle];
          const handleIncomingEdges = edges.filter(edge => edge.target === target && edge.targetHandle === targetHandle);
          if (handleIncomingEdges.length >= handleRules.max) {
            alert(`Handle ${targetHandle} on ${targetNodeType} node can only have ${handleRules.max} incoming connection(s).`);
            return;
          }
        }
      }

      setEdges(addEdge({ ...params, animated: areEdgesAnimated }, edges));
    },
    [nodes, edges, setEdges, areEdgesAnimated]
  );

  const proOptions = { hideAttribution: true };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ height: '100%', width: '100%' }} ref={reactFlowWrapper} className="flex-grow">
        <ReactFlow
        proOptions={proOptions}

          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnectCustom}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          nodeTypes={nodeTypes} // Pass the module-scope constant directly
          edgeTypes={edgeTypes} // Pass the module-scope constant directly
          fitView
          fitViewOptions={{ maxZoom: 0.75 }}
          attributionPosition="top-right"
          connectionLineStyle={{ stroke: 'var(--foreground)', strokeWidth: 2 }}
          defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: 'var(--foreground)' } }}
          connectionMode={ConnectionMode.Loose}
          connectionRadius={50}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* PropertiesPanel now directly uses the store, so no props are needed here */}
      <PropertiesPanel />
    </div>
  );
}
