import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeToolbar } from '@reactflow/node-toolbar';
import { NodeResizer } from '@reactflow/node-resizer';

const EndNode: React.FC<NodeProps> = ({ id, data, selected }) => {
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
        <button onClick={() => console.log(`Finalize ${id}`)} title="Finalize">🏁</button>
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
        {data.label || 'End'}
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-target-top`} // Unique handle ID
          style={{ background: 'var(--handle-bg)' }}
        />
        {/* Optional: Left handle for EndNode if multiple inputs are allowed */}
        {/* <Handle
          type="target"
          position={Position.Left}
          id={`${id}-target-left`}
          style={{ background: 'var(--handle-bg)' }}
        /> */}
      </div>
    </>
  );
};

export default EndNode;
