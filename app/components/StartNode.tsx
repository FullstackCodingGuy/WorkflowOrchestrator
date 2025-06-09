import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow'; // Corrected imports
import { NodeResizer } from '@reactflow/node-resizer'; // Corrected imports
import { NodeToolbar } from '@reactflow/node-toolbar'; // Corrected imports
import useWorkflowStore, { NodeData } from '../store/workflowStore'; // Import NodeData
import { useShallow } from 'zustand/shallow'; // Import useShallow
import { SettingsIcon, DuplicateIcon, TrashIcon } from './Icons'; // Corrected Icon imports

const StartNode: React.FC<NodeProps<NodeData>> = ({ data, selected, id }) => {
  const { setSelectedNodeId, duplicateNode, deleteNode } = useWorkflowStore(
    useShallow((state) => ({ 
      setSelectedNodeId: state.setSelectedNodeId,
      duplicateNode: state.duplicateNode,
      deleteNode: state.deleteNode,
    }))
  );

  const nodeStyle: React.CSSProperties = {
    background: data.backgroundColor || 'var(--node-bg-start)',
    color: data.fontColor || 'var(--node-color-start)',
    border: selected ? '2px solid var(--accent)' : '2px solid var(--node-border-start)',
    borderRadius: '0.5rem', // Match Tailwind rounded-lg
    padding: '0.75rem', // Match Tailwind p-3
    width: '100%', // Ensure it takes full width of resizable container
    height: '100%', // Ensure it takes full height of resizable container
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-md)', // Match Tailwind shadow-md
  };

  const labelStyle: React.CSSProperties = {
    color: data.fontColor || 'var(--node-color-start)',
    fontSize: '1.125rem', // Match Tailwind text-lg
    fontWeight: '600', // Match Tailwind font-semibold
  };

  return (
    <>
      <NodeResizer 
        minWidth={100} 
        minHeight={40} 
        isVisible={selected} 
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
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
          title="Edit Properties"
        >
          <SettingsIcon className="w-4 h-4 text-[var(--foreground)]" />
        </button>
        <button 
          onClick={() => duplicateNode(id)} 
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
          title="Duplicate Node"
        >
          <DuplicateIcon className="w-4 h-4 text-[var(--foreground)]" />
        </button>
        <button 
          onClick={() => deleteNode(id)} 
          className="p-1 rounded hover:bg-[var(--accent-muted)] transition-colors"
          title="Delete Node"
        >
          <TrashIcon className="w-4 h-4 text-[var(--destructive)]" />
        </button>
      </NodeToolbar>
      <div 
        style={nodeStyle}
        onClick={() => setSelectedNodeId(id)}
      >
        <div style={labelStyle}>{data.label || 'Start'}</div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        id={`${id}-source`} 
        className="!bg-[var(--handle-color)] !w-3 !h-3 !border-2 !border-[var(--handle-border-color)] !rounded-full hover:!ring-2 hover:!ring-[var(--accent)] transition-all duration-150"
        style={{ right: '-6px' }}
      />
    </>
  );
};

export default React.memo(StartNode);
