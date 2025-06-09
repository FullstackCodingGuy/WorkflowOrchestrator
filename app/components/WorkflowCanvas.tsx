'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance, // Added specific type for reactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';

import StartNode from './StartNode';
import ActionNode from './ActionNode';
import ConditionNode from './ConditionNode';
import EndNode from './EndNode';
import PropertiesPanel from './PropertiesPanel';

const initialNodes: Node[] = [
  {
    id: 'startNode1',
    type: 'start', // Updated type
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
  end: EndNode,
};

const edgeTypes: EdgeTypes = {
  // customEdge: CustomEdge, // Example for custom edge
};

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null); // Updated type

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeProperties = useCallback((updatedNode: Node) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
    setSelectedNode(updatedNode);
  }, [setNodes]);


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
      const { nodeType, label } = JSON.parse(typeAndLabel);


      // check if the dropped element is valid
      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const newNode: Node = {
        id: `dndnode_\\${+new Date()}`, // Simple unique ID
        type: nodeType,
        position,
        data: { label: `\\${label}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // TODO: Implement node configuration (title, color, conditions) - Partially done with PropertiesPanel
  // TODO: Implement workflow animation

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ height: '100%', width: '100%' }} ref={reactFlowWrapper} className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ maxZoom: 0.75 }} // Set maxZoom to 0.75 for 75% scale
          attributionPosition="top-right"
          connectionLineStyle={{ stroke: 'var(--foreground)', strokeWidth: 2 }} // Use theme variable for connection line
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
