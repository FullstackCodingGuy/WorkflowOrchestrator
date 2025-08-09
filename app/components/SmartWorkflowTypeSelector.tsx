'use client';

import React, { useState } from 'react';
import { DiagramType, DIAGRAM_TYPES } from '../config/appConfig';

interface WorkflowTypeOption {
  value: DiagramType;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  useCases: string[];
}

interface SmartWorkflowTypeSelectorProps {
  currentType: DiagramType;
  onTypeChange: (type: DiagramType) => void;
  onClose?: () => void;
  mode?: 'modal' | 'inline' | 'compact';
  showUseCases?: boolean;
}

const workflowTypeOptions: WorkflowTypeOption[] = [
  {
    value: DIAGRAM_TYPES.INTERACTIVE_FLOW,
    label: 'Interactive Flow Diagram',
    shortLabel: 'Interactive',
    description: 'Dynamic diagrams with user interactions, real-time controls, and responsive feedback for complex workflows',
    icon: '🎮',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    features: ['Interactive Controls', 'Real-time Updates', 'User Input', 'Dynamic Feedback'],
    useCases: ['User Workflows', 'Interactive Demos', 'Training Materials', 'Customer Journeys']
  },
  {
    value: DIAGRAM_TYPES.ANIMATED_WORKFLOW,
    label: 'Animated Workflow Diagram',
    shortLabel: 'Animated',
    description: 'Animated workflows with visual flow progression, timing controls, and step-by-step execution visualization',
    icon: '🎬',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-600',
    features: ['Animation Controls', 'Flow Visualization', 'Step-by-step', 'Timing Control'],
    useCases: ['Process Training', 'Presentations', 'System Demos', 'Educational Content']
  },
  {
    value: DIAGRAM_TYPES.PROCESS_FLOW,
    label: 'Process Flow Diagram',
    shortLabel: 'Process',
    description: 'Clean, professional process flow diagrams for business processes, documentation, and standard workflows',
    icon: '📊',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    features: ['Process Steps', 'Decision Points', 'Clean Layout', 'Documentation'],
    useCases: ['Business Processes', 'SOPs', 'Documentation', 'Compliance']
  },
  {
    value: DIAGRAM_TYPES.DECISION_TREE,
    label: 'Decision Tree Diagram',
    shortLabel: 'Decision',
    description: 'Decision-based diagrams with conditional branching logic, perfect for troubleshooting and decision processes',
    icon: '🌳',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    features: ['Decision Logic', 'Branching', 'Conditional Flow', 'Rule-based'],
    useCases: ['Troubleshooting', 'Decision Support', 'Expert Systems', 'Diagnostics']
  }
];

export function SmartWorkflowTypeSelector({ 
  currentType, 
  onTypeChange, 
  onClose,
  mode = 'inline',
  showUseCases = true
}: SmartWorkflowTypeSelectorProps) {
  const [hoveredOption, setHoveredOption] = useState<DiagramType | null>(null);
  const currentOption = workflowTypeOptions.find(option => option.value === currentType);

  if (mode === 'compact') {
    return (
      <div className="flex items-center space-x-1">
        {workflowTypeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            onMouseEnter={() => setHoveredOption(option.value)}
            onMouseLeave={() => setHoveredOption(null)}
            className={`relative group flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
              option.value === currentType
                ? 'border-indigo-400 bg-indigo-50 shadow-md'
                : 'border-border hover:border-indigo-300 hover:bg-muted/50'
            }`}
            title={option.description}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="text-sm font-medium text-foreground hidden md:inline">
              {option.shortLabel}
            </span>
            {option.value === currentType && (
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            )}
            
            {/* Tooltip */}
            {hoveredOption === option.value && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-black text-white text-xs rounded-lg p-3 shadow-xl z-50">
                <div className="font-medium mb-1">{option.label}</div>
                <div className="opacity-90">{option.description}</div>
                <div className="absolute -top-1 left-4 w-2 h-2 bg-black rotate-45" />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  const isModal = mode === 'modal';

  return (
    <div className={isModal ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' : 'w-full'}>
      <div className={`${isModal ? 'bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto' : ''}`}>
        {/* Header */}
        <div className={`${isModal ? 'p-6 border-b border-border' : 'mb-6'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose Workflow Type</h2>
              <p className="text-muted-foreground">
                Select the type of workflow diagram that best fits your project needs
              </p>
            </div>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className={`${isModal ? 'p-6' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflowTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onTypeChange(option.value);
                  if (isModal && onClose) onClose();
                }}
                className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl text-left ${
                  option.value === currentType
                    ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg ring-2 ring-indigo-200'
                    : 'border-border hover:border-indigo-200 bg-background hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/10'
                }`}
              >
                {/* Selection indicator */}
                {option.value === currentType && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative">
                  {/* Icon and title */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-1">{option.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors duration-200 ${
                            option.value === currentType
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                              : 'bg-muted text-muted-foreground border-border group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  {showUseCases && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Perfect for:</h4>
                      <div className="space-y-1">
                        {option.useCases.map((useCase, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Current selection summary */}
          {currentOption && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
                  style={{ backgroundColor: currentOption.color }}
                >
                  {currentOption.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-indigo-900 mb-1">
                    Selected: {currentOption.label}
                  </h3>
                  <p className="text-indigo-700 text-sm">{currentOption.description}</p>
                </div>
                <div className="text-indigo-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
