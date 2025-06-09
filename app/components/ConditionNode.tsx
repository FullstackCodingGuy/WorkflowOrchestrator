import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeToolbar } from '@reactflow/node-toolbar';
import { NodeResizer } from '@reactflow/node-resizer';
import useWorkflowStore, { NodeData } from '../store/workflowStore';
import { useShallow } from 'zustand/shallow';
import { SettingsIcon, DuplicateIcon, TrashIcon } from './Icons';

const ConditionNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId } = useWorkflowStore(
    useShallow((state) => ({
      deleteNode: state.deleteNode,
      duplicateNode: state.duplicateNode,
      setSelectedNodeId: state.setSelectedNodeId,
    }))
  );

  const nodeStyle: React.CSSProperties = {
    background: data.backgroundColor || 'var(--node-bg-condition)',
    color: data.fontColor || 'var(--node-color-condition)',
    border: selected ? '2px solid var(--accent)' : '2px solid var(--node-border-condition)',
    borderRadius: '0.375rem', // Diamond shape is complex, using rounded rect for now
    padding: '0.75rem',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-md)',
    // transform: 'rotate(45deg)', // This would make content hard to read
  };

  const labelStyle: React.CSSProperties = {
    color: data.fontColor || 'var(--node-color-condition)',
    // transform: 'rotate(-45deg)', // Counter-rotate if node is rotated
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={70}
        lineClassName="border-[var(--accent)]"
        handleClassName="bg-[var(--accent)] w-2 h-2 rounded-full"
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex gap-1 p-1 bg-[var(--background-offset)] border border-[var(--border-color)] rounded-md shadow-lg"
      >
        <button
          onClick={() => setSelectedNodeId(id)}
          title="Edit Properties"
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
        >
          <SettingsIcon className="w-4 h-4 text-[var(--foreground)]" />
        </button>
        <button
          onClick={() => duplicateNode(id)}
          title="Duplicate Node"
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
        >
          <DuplicateIcon className="w-4 h-4 text-[var(--foreground)]" />
        </button>
        <button
          onClick={() => deleteNode(id)}
          title="Delete Node"
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
        >
          <TrashIcon className="w-4 h-4 text-[var(--destructive)]" />
        </button>
      </NodeToolbar>
      <div 
        style={nodeStyle}
        onClick={() => setSelectedNodeId(id)}
      >
        <div style={labelStyle}>{data.label || 'Condition'}</div>
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-target`}
          className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
          style={{ top: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-source-true`}
          className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
          style={{ right: '-6px', top: '35%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-source-false`}
          className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
          style={{ bottom: '-6px' }}
        />
      </div>
    </>
  );
};

export default React.memo(ConditionNode);
