'use client';

import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

// TODO: Populate with draggable workflow controls
const controls = [
  { id: 'start', label: 'Start Node', type: 'start' }, // Added type for clarity
  { id: 'action', label: 'Action Node', type: 'action' },
  { id: 'condition', label: 'Condition Node', type: 'condition' },
  { id: 'end', label: 'End Node', type: 'end' },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out overflow-y-auto bg-opacity-80 backdrop-blur-md ${isOpen ? 'w-64 p-4' : 'w-0 p-0'}`}
      style={{ backgroundColor: 'var(--node-bg)', color: 'var(--node-color)' }}
    >
      {isOpen && (
        <>
          <h3 className="mb-4 text-lg font-semibold">Controls</h3>
          {controls.map((control) => (
            <div
              key={control.id}
              onDragStart={(event) => onDragStart(event, control.type, control.label)}
              draggable
              className="p-3 mb-3 text-sm text-center border border-slate-400 rounded-lg cursor-grab hover:bg-[var(--accent-color)] hover:text-[var(--background)] active:cursor-grabbing transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              {control.label}
            </div>
          ))}
        </>
      )}
    </aside>
  );
}
