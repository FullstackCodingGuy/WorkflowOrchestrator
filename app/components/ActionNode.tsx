import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeToolbar } from '@reactflow/node-toolbar';
import useWorkflowStore from '../store/workflowStore'; // Import the store

const ActionNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId } = useWorkflowStore(); // Get actions

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={150} // Adjusted minWidth
        minHeight={60}  // Adjusted minHeight
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
        padding: '15px 25px', // Slightly more padding
        border: '1px solid var(--node-border)',
        borderRadius: '8px',
        background: 'var(--node-bg)', 
        color: 'var(--node-color)',
        cursor: 'move',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column', // Allow content to stack if needed
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        <div><strong>{data.label || 'Action'}</strong></div>
        {/* You can add more data display here, e.g., data.description */}
        {/* <p style={{ fontSize: '0.8em', margin: '5px 0 0 0' }}>{data.description || 'No description'}</p> */}
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-target-top`} // Unique handle ID
          style={{ background: 'var(--handle-bg)' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-source-bottom`} // Unique handle ID
          style={{ background: 'var(--handle-bg)' }}
        />
        {/* Optional: Left/Right handles for more complex flows */}
        {/* <Handle
          type="target"
          position={Position.Left}
          id={`${id}-target-left`}
          style={{ background: 'var(--handle-bg)' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-source-right`}
          style={{ background: 'var(--handle-bg)' }}
        /> */}
      </div>
    </>
  );
};

export default ActionNode;
