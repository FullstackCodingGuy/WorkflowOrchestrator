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
    onConnect,
    addNode,
  } = useWorkflowStore();

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
    useWorkflowStore.setState((state: WorkflowState) => ({ // Added explicit type for state
      nodes: state.nodes.map((node: Node) => (node.id === updatedNode.id ? updatedNode : node)), // Added explicit type for node
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
        
        const newNode: Node = {
          id: `dndnode_\\${+new Date()}`,
          type: nodeType,
          position,
          data: { label: `\\${label}` },
        };

        addNode(newNode);
      } catch (error) {
        console.error("Failed to parse dropped data:", error);
      }
    },
    [reactFlowInstance, addNode]
  );

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
          fitViewOptions={{ maxZoom: 0.75 }}
          attributionPosition="top-right"
          connectionLineStyle={{ stroke: 'var(--foreground)', strokeWidth: 2 }}
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
