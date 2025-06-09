'use client';

import React from 'react';
import useWorkflowStore from '../store/workflowStore';
import { workflowExamples, WorkflowExample } from './workflowExamples';

interface SidebarProps {
  isOpen: boolean;
}

const controls = [
  { id: 'start', label: 'Start Node', type: 'start' },
  { id: 'action', label: 'Action Node', type: 'action' },
  { id: 'condition', label: 'Condition Node', type: 'condition' },
  { id: 'end', label: 'End Node', type: 'end' },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const { importWorkflow } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleLoadExample = (example: WorkflowExample) => {
    importWorkflow({ nodes: example.nodes, edges: example.edges }, example.layoutDirection);
    console.log(`Loading example: ${example.name}`);
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out overflow-y-auto border-r border-[var(--border-color)] ${isOpen ? 'w-72 p-4' : 'w-0 p-0'}`}
      style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--foreground)' }} // Ensure main text color is --foreground
    >
      {isOpen && (
        <>
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Controls</h3>
          {controls.map((control) => (
            <div
              key={control.id}
              onDragStart={(event) => onDragStart(event, control.type, control.label)}
              draggable
              className="p-3 mb-3 text-sm text-center border border-[var(--border-color)] rounded-lg cursor-grab hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] active:cursor-grabbing transition-colors duration-150 shadow-md hover:shadow-lg bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            >
              {control.label}
            </div>
          ))}

          <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
            <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Workflow Examples</h3>
            {workflowExamples.map((example) => (
              <div 
                key={example.name} 
                className="mb-4 p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] shadow text-[var(--card-foreground)]"
              >
                <h4 className="font-semibold text-md">{example.name}</h4> {/* Inherits --card-foreground */}
                <p className="text-xs text-[var(--muted-foreground)] mt-1 mb-2">{example.description}</p>
                <button
                  onClick={() => handleLoadExample(example)}
                  className="w-full p-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-hover)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]"
                >
                  Load Example
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
