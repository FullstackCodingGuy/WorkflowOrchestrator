import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeToolbar } from '@reactflow/node-toolbar'; // Corrected import

const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
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
        <button onClick={() => console.log(`Toolbar action 1 for ${id}`)} title="Action 1">⚙️</button>
        <button onClick={() => console.log(`Toolbar action 2 for ${id}`)} title="Action 2">🗑️</button>
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
