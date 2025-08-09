'use client';

import React, { useState } from 'react';
import { WorkflowTypeSelector } from './WorkflowTypeSelector';
import { DiagramType, DIAGRAM_TYPES } from '../config/appConfig';

export function WorkflowTypeDemo() {
  const [selectedType, setSelectedType] = useState<DiagramType>(DIAGRAM_TYPES.INTERACTIVE_FLOW);
  const [viewMode, setViewMode] = useState<'compact' | 'full'>('compact');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Smart Workflow Type Selector</h1>
        <p className="text-muted-foreground text-lg">
          A modern, intuitive replacement for the dropdown workflow type selector in the main toolbar.
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-foreground">View Mode:</span>
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('compact')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'compact'
                ? 'bg-indigo-500 text-white'
                : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            Compact (Toolbar)
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'full'
                ? 'bg-indigo-500 text-white'
                : 'bg-background text-foreground hover:bg-muted'
            }`}
          >
            Full (Setup)
          </button>
        </div>
      </div>

      {/* Workflow Type Selector */}
      <div className="border border-border rounded-xl p-6 bg-background">
        <WorkflowTypeSelector
          currentType={selectedType}
          onTypeChange={setSelectedType}
          compact={viewMode === 'compact'}
        />
      </div>

      {/* Features Demo */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Key Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Visual icon-based selection with color coding</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Detailed descriptions and feature lists</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Compact mode for toolbar integration</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Full card-based view for setup wizards</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Smooth animations and hover effects</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 font-bold">✓</span>
              <span>Clear selection indicators</span>
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">📊 Current Selection</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-lg">
                {viewMode === 'compact' ? '🎮' : getWorkflowIcon(selectedType)}
              </div>
              <div>
                <div className="font-medium text-foreground">{selectedType}</div>
                <div className="text-sm text-muted-foreground">Active workflow type</div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">Benefits Over Dropdown:</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• More intuitive visual selection</div>
                <div>• Better UX with descriptions</div>
                <div>• Mobile-friendly design</div>
                <div>• Accessible keyboard navigation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-3">🔧 Integration Details</h3>
        <div className="text-sm text-indigo-800 space-y-2">
          <p>
            <strong>Toolbar Integration:</strong> The compact mode is designed to replace the existing dropdown 
            in the DiagramToolbar component, providing a more modern and intuitive selection experience.
          </p>
          <p>
            <strong>Setup Wizard:</strong> The full card-based view can be used in onboarding flows, 
            settings panels, or dedicated workflow creation pages.
          </p>
          <p>
            <strong>Responsive Design:</strong> Both modes are fully responsive and work well on desktop, 
            tablet, and mobile devices.
          </p>
        </div>
      </div>
    </div>
  );
}

function getWorkflowIcon(type: DiagramType): string {
  switch (type) {
    case DIAGRAM_TYPES.INTERACTIVE_FLOW:
      return '🎮';
    case DIAGRAM_TYPES.ANIMATED_WORKFLOW:
      return '🎬';
    case DIAGRAM_TYPES.PROCESS_FLOW:
      return '📊';
    case DIAGRAM_TYPES.DECISION_TREE:
      return '🌳';
    default:
      return '📋';
  }
}
