'use client';

import React, { useState } from 'react';
import { workflowTemplates, WorkflowTemplate } from './workflowTemplates';
import { PlayCircleIcon, ChevronDownIcon, ChevronRightIcon } from './Icons';

interface TemplateLibraryPanelProps {
  onLoadExample?: (template: WorkflowTemplate) => void;
}

export function TemplateLibraryPanel({ onLoadExample }: TemplateLibraryPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Business Workflows']));

  // Group templates by category based on name patterns
  const categorizedTemplates = workflowTemplates.reduce((acc, template) => {
    let category = 'Business Workflows'; // Default category
    
    // Categorize based on template name patterns
    if (template.name.toLowerCase().includes('approval') || 
        template.name.toLowerCase().includes('decision')) {
      category = 'Approval Processes';
    } else if (template.name.toLowerCase().includes('data') || 
               template.name.toLowerCase().includes('processing')) {
      category = 'Data Processing';
    } else if (template.name.toLowerCase().includes('user') || 
               template.name.toLowerCase().includes('customer')) {
      category = 'User Workflows';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, WorkflowTemplate[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleLoadTemplate = (template: WorkflowTemplate) => {
    if (onLoadExample) {
      onLoadExample(template);
    }
  };

  return (
    <div className="space-y-3">
      {Object.entries(categorizedTemplates).map(([category, templates]) => (
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
                {templates.length}
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
                {templates.map((template) => (
                  <div 
                    key={template.name} 
                    className="card p-3 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">
                        {template.name}
                      </h4>
                      <div className="flex items-center space-x-1 text-xs text-muted ml-2">
                        <span>📊</span>
                        <span>{template.nodes.length}n</span>
                        <span>🔗</span>
                        <span>{template.edges.length}e</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted mb-3 leading-relaxed">
                      {template.description}
                    </p>
                    
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="btn btn-xs btn-primary w-full flex items-center justify-center space-x-1.5"
                      aria-label={`Load ${template.name} template`}
                    >
                      <PlayCircleIcon className="w-3 h-3" />
                      <span>Load Template</span>
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
          {workflowTemplates.length} template{workflowTemplates.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}
