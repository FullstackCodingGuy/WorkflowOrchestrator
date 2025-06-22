'use client';

import React, { useState } from 'react';
import { workflowExamples, WorkflowExample } from './workflowExamples_new';
import { PlayCircleIcon, ChevronDownIcon, ChevronRightIcon } from './Icons';

interface WorkflowExamplesPanelProps {
  onLoadExample?: (example: WorkflowExample) => void;
}

export function WorkflowExamplesPanel({ onLoadExample }: WorkflowExamplesPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Business Workflows']));

  // Group examples by category based on name patterns
  const categorizedExamples = workflowExamples.reduce((acc, example) => {
    let category = 'Business Workflows'; // Default category
    
    // Categorize based on example name patterns
    if (example.name.toLowerCase().includes('approval') || 
        example.name.toLowerCase().includes('decision')) {
      category = 'Approval Processes';
    } else if (example.name.toLowerCase().includes('data') || 
               example.name.toLowerCase().includes('processing')) {
      category = 'Data Processing';
    } else if (example.name.toLowerCase().includes('user') || 
               example.name.toLowerCase().includes('customer')) {
      category = 'User Workflows';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(example);
    return acc;
  }, {} as Record<string, WorkflowExample[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleLoadExample = (example: WorkflowExample) => {
    if (onLoadExample) {
      onLoadExample(example);
    }
  };

  return (
    <div className="space-y-3">
      {Object.entries(categorizedExamples).map(([category, examples]) => (
        <div key={category} className="border border-border rounded-lg">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors rounded-t-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-foreground">
                {category}
              </span>
              <span className="text-xs text-muted bg-secondary px-2 py-0.5 rounded-full">
                {examples.length}
              </span>
            </div>
            {expandedCategories.has(category) ? (
              <ChevronDownIcon className="w-4 h-4 text-muted" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-muted" />
            )}
          </button>

          {/* Category Content */}
          {expandedCategories.has(category) && (
            <div className="border-t border-border">
              <div className="p-2 space-y-2">
                {examples.map((example) => (
                  <div 
                    key={example.name} 
                    className="card p-3 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">
                        {example.name}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-muted ml-2">
                        <span>📊</span>
                        <span>{example.nodes.length}n</span>
                        <span>🔗</span>
                        <span>{example.edges.length}e</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      {example.description}
                    </p>
                    
                    <button
                      onClick={() => handleLoadExample(example)}
                      className="btn btn-xs btn-primary w-full flex items-center justify-center space-x-1.5"
                      aria-label={`Load ${example.name} example`}
                    >
                      <PlayCircleIcon className="w-3 h-3" />
                      <span>Load Example</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Footer Info */}
      <div className="text-center pt-2 border-t border-border">
        <p className="text-xs text-muted">
          {workflowExamples.length} example{workflowExamples.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}
