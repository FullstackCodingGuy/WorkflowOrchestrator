import React from 'react';
import { DropdownMenu } from './DropdownMenu';

interface FileMenuProps {
  onNew: () => void;
  onLoad: () => void;
  onSave: () => void;
  onClear: () => void;
  onOpenPresentationView: () => void;
  className?: string;
}

export function FileMenu({
  onNew,
  onLoad,
  onSave,
  onClear,
  onOpenPresentationView,
  className = ''
}: FileMenuProps) {
  const fileMenuItems = [
    {
      id: 'new',
      label: 'New Workflow',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      shortcut: 'Shift+Ctrl+N',
      onClick: onNew,
    },
    {
      id: 'separator1',
      label: '',
      onClick: () => {},
      separator: true,
    },
    {
      id: 'load',
      label: 'Open...',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      shortcut: 'Ctrl+O',
      onClick: onLoad,
    },
    {
      id: 'save',
      label: 'Save',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      shortcut: 'Ctrl+S',
      onClick: onSave,
    },
    {
      id: 'separator2',
      label: '',
      onClick: () => {},
      separator: true,
    },
    {
      id: 'present',
      label: 'Open Presentation View',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0h8M5 8h14M5 12h14M5 16h14" />
        </svg>
      ),
      shortcut: 'Ctrl+P',
      onClick: onOpenPresentationView,
    },
    {
      id: 'separator3',
      label: '',
      onClick: () => {},
      separator: true,
    },
    {
      id: 'clear',
      label: 'Clear All',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      onClick: onClear,
    },
  ];

  const trigger = (
    <button className={`btn btn-sm btn-ghost text-foreground hover:bg-secondary ${className}`}>
      <span>File</span>
      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <DropdownMenu 
      trigger={trigger} 
      items={fileMenuItems}
      position="left"
    />
  );
}
