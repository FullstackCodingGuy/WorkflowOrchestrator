'use client';

import React, { useState } from 'react';
import { DiagramType, DIAGRAM_TYPES } from '../config/appConfig';

interface WorkflowTypeOption {
  value: DiagramType;
  label: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface WorkflowTypeSelectorProps {
  currentType: DiagramType;
  onTypeChange: (type: DiagramType) => void;
  compact?: boolean;
}

const workflowTypeOptions: WorkflowTypeOption[] = [
  {
    value: DIAGRAM_TYPES.INTERACTIVE_FLOW,
    label: 'Interactive Flow',
    description: 'Interactive diagrams with dynamic controls and user interactions',
    icon: '🎮',
    color: '#6366f1',
    features: ['Interactive Controls', 'Real-time Updates', 'User Input']
  },
  {
    value: DIAGRAM_TYPES.ANIMATED_WORKFLOW,
    label: 'Animated Workflow',
    description: 'Animated workflows with visual flow progression and timing',
    icon: '🎬',
    color: '#8b5cf6',
    features: ['Animation Controls', 'Flow Visualization', 'Step-by-step']
  },
  {
    value: DIAGRAM_TYPES.PROCESS_FLOW,
    label: 'Process Flow',
    description: 'Standard process flow diagrams for business processes',
    icon: '📊',
    color: '#10b981',
    features: ['Process Steps', 'Decision Points', 'Clean Layout']
  },
  {
    value: DIAGRAM_TYPES.DECISION_TREE,
    label: 'Decision Tree',
    description: 'Decision-based diagrams with conditional branching logic',
    icon: '🌳',
    color: '#f59e0b',
    features: ['Decision Logic', 'Branching', 'Conditional Flow']
  }
];

export function WorkflowTypeSelector({ currentType, onTypeChange, compact = false }: WorkflowTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = workflowTypeOptions.find(option => option.value === currentType);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-background border border-border rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 min-w-[180px]"
          title="Select workflow type"
        >
          <span className="text-lg">{currentOption?.icon}</span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">{currentOption?.label}</span>
            <span className="text-xs text-muted-foreground">Click to change</span>
          </div>
          <svg 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Select Workflow Type</h3>
                <div className="space-y-2">
                  {workflowTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onTypeChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                        option.value === currentType
                          ? 'border-indigo-300 bg-indigo-50 shadow-md'
                          : 'border-border hover:border-indigo-200 hover:bg-muted/50'
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm text-foreground">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {option.features.slice(0, 2).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      {option.value === currentType && (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full card-based selector for expanded view
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Workflow Type</h3>
        <p className="text-sm text-muted-foreground">Select the type of workflow diagram that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workflowTypeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
              option.value === currentType
                ? 'border-indigo-400 bg-indigo-50 shadow-lg ring-2 ring-indigo-200'
                : 'border-border hover:border-indigo-200 bg-background hover:bg-muted/50'
            }`}
          >
            {/* Selection indicator */}
            {option.value === currentType && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-3 mx-auto transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: option.color }}
            >
              {option.icon}
            </div>

            {/* Content */}
            <div className="text-center">
              <h4 className="font-semibold text-sm text-foreground mb-2">{option.label}</h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{option.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap justify-center gap-1">
                {option.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                      option.value === currentType
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-muted text-muted-foreground group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Current selection info */}
      {currentOption && (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: currentOption.color }}
            >
              {currentOption.icon}
            </div>
            <div>
              <h4 className="font-medium text-indigo-900">Current: {currentOption.label}</h4>
              <p className="text-sm text-indigo-700">{currentOption.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
