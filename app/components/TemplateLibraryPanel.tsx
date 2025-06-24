'use client';

import React, { useState, useRef } from 'react';
import { workflowTemplates, WorkflowTemplate } from './workflowTemplates';
import { PlayCircleIcon, ChevronDownIcon, ChevronRightIcon } from './Icons';

interface TemplateLibraryPanelProps {
  onLoadExample?: (template: WorkflowTemplate) => void;
}

export function TemplateLibraryPanel({ onLoadExample }: TemplateLibraryPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Business Workflows']));
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPopoverHovered, setIsPopoverHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setHoveredTemplate(null);
    setIsPopoverHovered(false);
  };

  const handleMouseEnter = (template: WorkflowTemplate, event: React.MouseEvent) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverWidth = 320;
    const popoverHeight = 200; // Estimated popover height
    
    // Calculate horizontal position
    let x = rect.right + 10; // Default to right side
    if (rect.right + popoverWidth + 20 > viewportWidth) {
      x = rect.left - popoverWidth - 10; // Flip to left side
    }
    
    // Calculate vertical position - center on the card
    let y = rect.top + (rect.height / 2) - (popoverHeight / 2);
    
    // Ensure popover doesn't go off screen vertically
    if (y < 10) {
      y = 10;
    } else if (y + popoverHeight > viewportHeight - 10) {
      y = viewportHeight - popoverHeight - 10;
    }
    
    setPopoverPosition({ x, y });
    setHoveredTemplate(template.name);
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the popover, but allow it to be cancelled
    hideTimeoutRef.current = setTimeout(() => {
      if (!isPopoverHovered) {
        setHoveredTemplate(null);
      }
    }, 150); // 150ms delay to allow moving to popover
  };

  const handlePopoverMouseEnter = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsPopoverHovered(true);
  };

  const handlePopoverMouseLeave = () => {
    setIsPopoverHovered(false);
    setHoveredTemplate(null);
  };

  return (
    <div className="space-y-2">
      {Object.entries(categorizedTemplates).map(([category, templates]) => (
        <div key={category} className="border border-border rounded">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full p-2 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-foreground">
                {category}
              </span>
              <span className="text-xs text-muted bg-secondary px-1.5 py-0.5 rounded">
                {templates.length}
              </span>
            </div>
            {expandedCategories.has(category) ? (
              <ChevronDownIcon className="w-3 h-3 text-muted" />
            ) : (
              <ChevronRightIcon className="w-3 h-3 text-muted" />
            )}
          </button>

          {/* Category Content */}
          {expandedCategories.has(category) && (
            <div className="border-t border-border">
              <div className="p-1 space-y-1">
                {templates.map((template) => (
                  <div 
                    key={template.name} 
                    className="p-2 rounded hover:bg-secondary/30 transition-colors cursor-pointer relative"
                    onMouseEnter={(e) => handleMouseEnter(template, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs text-foreground truncate">
                          {template.name}
                        </h4>
                      </div>
                      <div className="flex items-center text-xs text-muted ml-2 space-x-1">
                        <span>{template.nodes.length}n</span>
                        <span>•</span>
                        <span>{template.edges.length}e</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Footer Info */}
      <div className="text-center pt-1 border-t border-border">
        <p className="text-xs text-muted">
          {workflowTemplates.length} templates
        </p>
      </div>

      {/* Popover */}
      {hoveredTemplate && (
        <div 
          className="fixed z-50 bg-white border border-border rounded-lg shadow-xl p-4 w-80"
          style={{
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y}px`
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
        >
          {(() => {
            const template = workflowTemplates.find(t => t.name === hoveredTemplate);
            if (!template) return null;
            
            return (
              <div className="space-y-3">
                {/* Header */}
                <div className="border-b border-border pb-2">
                  <h4 className="font-semibold text-sm text-foreground line-clamp-2">
                    {template.name}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-xs text-muted">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{template.nodes.length} nodes</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{template.edges.length} edges</span>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <p className="text-xs text-muted leading-relaxed">
                    {template.description}
                  </p>
                </div>
                
                {/* Action */}
                <div className="pt-1">
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="btn btn-sm btn-primary w-full flex items-center justify-center space-x-2 hover:bg-primary-hover transition-colors"
                  >
                    <PlayCircleIcon className="w-4 h-4" />
                    <span>Load Template</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
