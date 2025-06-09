import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeToolbar } from '@reactflow/node-toolbar';
import useWorkflowStore, { NodeData } from '../store/workflowStore';
import { useShallow } from 'zustand/shallow';
import { SettingsIcon, DuplicateIcon, TrashIcon } from './Icons';

const ActionNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const { deleteNode, duplicateNode, setSelectedNodeId } = useWorkflowStore(
    useShallow((state) => ({
      deleteNode: state.deleteNode,
      duplicateNode: state.duplicateNode,
      setSelectedNodeId: state.setSelectedNodeId,
    }))
  );

  const nodeStyle: React.CSSProperties = {
    background: data.backgroundColor || 'var(--node-bg-action)',
    color: data.fontColor || 'var(--node-color-action)',
    border: selected ? '2px solid var(--accent)' : '2px solid var(--node-border-action)',
    borderRadius: '0.375rem', // Match Tailwind rounded-md
    padding: '0.75rem 1.25rem', // Match Tailwind p-3 px-5
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-md)',
  };

  const labelStyle: React.CSSProperties = {
    color: data.fontColor || 'var(--node-color-action)',
    fontWeight: '600', // Match Tailwind font-semibold
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={150}
        minHeight={60}
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
        <div style={labelStyle}><strong>{data.label || 'Action'}</strong></div>
        <Handle
          type="target"
          position={Position.Top}
          id={`${id}-target`}
          className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
          style={{ top: '-6px' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-source`}
          className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
          style={{ bottom: '-6px' }}
        />
      </div>
    </>
  );
};

export default React.memo(ActionNode);
