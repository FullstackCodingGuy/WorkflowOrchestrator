import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeToolbar } from '@reactflow/node-toolbar'; // Corrected import
import useWorkflowStore from '../store/workflowStore'; // Import the store

const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId } = useWorkflowStore(); // Get actions

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={50}
        lineClassName="!border-[var(--primary)]"
        handleClassName="!bg-[var(--primary)] w-2 h-2 rounded-none"
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align="end"
        offset={8}
      >
        {/* Updated Toolbar Actions */}
        <button 
          onClick={() => setSelectedNodeId(id)} 
          title="Edit Properties"
          className="p-1 hover:bg-[var(--background-modifier-hover)] rounded"
        >
          ⚙️
        </button>
        <button 
          onClick={() => duplicateNode(id)} 
          title="Duplicate Node"
          className="p-1 hover:bg-[var(--background-modifier-hover)] rounded"
        >
          📄
        </button>
        <button 
          onClick={() => deleteNode(id)} 
          title="Delete Node"
          className="p-1 hover:bg-[var(--background-modifier-hover)] rounded"
        >
          🗑️
        </button>
      </NodeToolbar>
      <div style={{
        padding: '10px 20px',
        border: '1px solid var(--node-border)',
        borderRadius: '8px',
        background: 'var(--node-bg)',
        color: 'var(--node-color)',
        cursor: 'move',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        {data.label || 'Start'}
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-source-bottom`}
          style={{ background: 'var(--handle-bg)' }}
        />
      </div>
    </>
  );
};

export default StartNode;
