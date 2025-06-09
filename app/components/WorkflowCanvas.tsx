'use client';

import React, { useCallback, useRef, useState } from 'react'; // Removed useEffect as it's not used
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  ConnectionMode, // Added
  useReactFlow, // Added
  addEdge, // Added from reactflow
  Connection, // Added from reactflow
} from 'reactflow';
import 'reactflow/dist/style.css';

import StartNode from './StartNode';
import ActionNode from './ActionNode';
import ConditionNode from './ConditionNode';
import EndNode from './EndNode';
import PropertiesPanel from './PropertiesPanel';
import useWorkflowStore, { WorkflowState } from '../store/workflowStore'; // Import the store and its type

const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
  end: EndNode,
};

const edgeTypes: EdgeTypes = {};

export default function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    // onConnect, // We'll use a custom onConnect for advanced features
    addNode,
    setEdges, // Added to use in custom onConnect
    areEdgesAnimated, // Added to maintain animation state
  } = useWorkflowStore();

  const { project } = useReactFlow(); // For projecting screen to flow coordinates
  const connectingNodeId = useRef<string | null>(null); // To store the source node id when starting a connection

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeProperties = useCallback((updatedNode: Node) => {
    useWorkflowStore.setState((state: WorkflowState) => ({
      nodes: state.nodes.map((node: Node) => (node.id === updatedNode.id ? updatedNode : node)),
    }));
    setSelectedNode(updatedNode);
  }, []);

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
      // Example: Limit 'start' node to 1 outgoing connection
      if (params.source) {
        const sourceNode = nodes.find(node => node.id === params.source);
        if (sourceNode?.type === 'start') {
          const outgoingEdges = edges.filter(edge => edge.source === params.source);
          if (outgoingEdges.length >= 1) {
            console.warn('Start node can only have one outgoing connection.');
            alert('Start node can only have one outgoing connection.');
            return;
          }
        }
      }
      // Example: Limit 'end' node to 1 incoming connection
      if (params.target) {
        const targetNode = nodes.find(node => node.id === params.target);
        if (targetNode?.type === 'end') {
          const incomingEdges = edges.filter(edge => edge.target === params.target);
          if (incomingEdges.length >= 1) {
            console.warn('End node can only have one incoming connection.');
            alert('End node can only have one incoming connection.');
            return;
          }
        }
      }
      // Add specific handle connection limits here if needed
      // e.g., if (params.sourceHandle === 'a' && params.targetHandle === 'b') { ... }

      setEdges(addEdge({ ...params, animated: areEdgesAnimated }, edges));
    },
    [nodes, edges, setEdges, areEdgesAnimated]
  );


  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ height: '100%', width: '100%' }} ref={reactFlowWrapper} className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // onConnect={onConnect} // Use custom onConnect
          onConnect={onConnectCustom} // Use the new custom onConnect
          onConnectStart={onConnectStart} // Add Node on Edge Drop
          onConnectEnd={onConnectEnd} // Add Node on Edge Drop
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ maxZoom: 0.75 }}
          attributionPosition="top-right"
          connectionLineStyle={{ stroke: 'var(--foreground)', strokeWidth: 2 }}
          connectionMode={ConnectionMode.Loose} // Easy Connect / Proximity Connect
          connectionRadius={50} // Proximity radius
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
      <PropertiesPanel selectedNode={selectedNode} onUpdateNode={updateNodeProperties} />
    </div>
  );
}
