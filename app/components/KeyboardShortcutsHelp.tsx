'use client';

import React from 'react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'File Operations',
      shortcuts: [
        { key: 'Ctrl+N', description: 'Add New Node (context-aware)' },
        { key: 'Shift+Ctrl+N', description: 'New Workflow (clear all)' },
        { key: 'Ctrl+O', description: 'Open/Load Workflow' },
        { key: 'Ctrl+S', description: 'Save Workflow' },
      ]
    },
    {
      category: 'View & Navigation',
      shortcuts: [
        { key: 'Ctrl+F', description: 'Fit View to Content' },
        { key: 'Ctrl+M', description: 'Toggle MiniMap' },
        { key: 'Ctrl+P', description: 'Open Presentation View' },
        { key: 'Escape', description: 'Clear Selection & Close Panels' },
      ]
    },
    {
      category: 'Node Operations',
      shortcuts: [
        { key: 'Delete', description: 'Delete Selected Node' },
        { key: 'Click + Drag', description: 'Move Node' },
        { key: 'Double Click', description: 'Edit Node (inline editing)' },
        { key: 'Click Node Border', description: 'Resize Node (drag handles)' },
      ]
    },
    {
      category: 'Workflow Controls',
      shortcuts: [
        { key: 'Space', description: 'Play/Pause Workflow Animation' },
        { key: 'R', description: 'Restart Workflow' },
        { key: 'D', description: 'Debug Mode Toggle' },
      ]
    },
    {
      category: 'Edge Operations',
      shortcuts: [
        { key: 'Click & Drag from Node', description: 'Create Connection' },
        { key: 'Double Click Edge', description: 'Edit Edge Label' },
        { key: 'Select Edge + Delete', description: 'Remove Connection' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted mt-1">Master your workflow with these shortcuts</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost text-muted hover:text-foreground"
            title="Close (Escape)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map((shortcut, shortcutIndex) => (
                    <div key={shortcutIndex} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted">{shortcut.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut.key.split('+').map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && <span className="text-xs text-muted">+</span>}
                            <kbd className="px-2 py-1 text-xs font-mono bg-muted/20 border border-border rounded text-foreground">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>💡 Tip: Most shortcuts work globally when the editor is focused</span>
            <span>Press <kbd className="px-1 py-0.5 bg-muted/20 border border-border rounded font-mono">Escape</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
