import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeToolbar } from '@reactflow/node-toolbar'; // Correct import for NodeToolbar
import { NodeResizer } from '@reactflow/node-resizer'; // Correct import for NodeResizer

const ConditionNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  return (
    <>
      <NodeResizer // Using NodeResizer directly
        isVisible={selected}
        minWidth={100}
        minHeight={70}
        lineClassName="!border-[var(--primary)]"
        handleClassName="!bg-[var(--primary)] w-2 h-2 rounded-none"
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align="end"
        offset={8}
      >
        <button onClick={() => console.log(`Configure condition ${id}`)} title="Configure">⚙️</button>
        <button onClick={() => console.log(`Info ${id}`)} title="Info">ℹ️</button>
      </NodeToolbar>
      <div style={{
        padding: '15px',
        border: '1px solid var(--node-border)',
        borderRadius: '4px', // Standard border radius, actual diamond shape is complex
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
        // For a visual hint of a diamond, you could use a ::before pseudo-element with a transform,
        // but for resizability and simplicity, a styled rectangle is more practical here.
      }}>
        {data.label || 'Condition'}
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-target-top`} // Unique handle ID
          style={{ background: 'var(--handle-bg)' }}
        />
        <Handle
          type="source"
          position={Position.Right} // True path (example)
          id={`${id}-source-right-true`} // Unique handle ID
          style={{ background: 'var(--handle-bg)', top: '35%' }} // Adjusted position
        />
        <Handle
          type="source"
          position={Position.Bottom} // False path (example)
          id={`${id}-source-bottom-false`} // Unique handle ID
          style={{ background: 'var(--handle-bg)', left: '50%' }} // Adjusted position
        />
        {/* <Handle
          type="source"
          position={Position.Left} // Could be another path or just for symmetry
          id={`${id}-source-left-alt`}
          style={{ background: 'var(--handle-bg)', top: '65%' }}
        /> */}
      </div>
    </>
  );
};

export default ConditionNode;
