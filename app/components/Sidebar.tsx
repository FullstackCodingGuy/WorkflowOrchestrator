'use client';

import React from 'react';

// TODO: Populate with draggable workflow controls
const controls = [
  { id: 'task', label: 'Task' },
  { id: 'condition', label: 'Condition' },
];

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 p-4 overflow-y-auto border-r border-gray-700 bg-background">
      <h3 className="mb-4 text-lg font-semibold">Controls</h3>
      {controls.map((control) => (
        <div
          key={control.id}
          onDragStart={(event) => onDragStart(event, control.id, control.label)}
          draggable
          className="p-3 mb-2 text-sm text-center border border-gray-600 rounded-md cursor-grab hover:bg-gray-700 active:cursor-grabbing"
        >
          {control.label}
        </div>
      ))}
    </aside>
  );
}
