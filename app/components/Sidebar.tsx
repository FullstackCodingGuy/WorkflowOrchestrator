'use client';

import React, { useState } from 'react'; // Added useState
import useWorkflowStore from '../store/workflowStore';
import { workflowExamples, WorkflowExample } from './workflowExamples';
import {
  PlayCircleIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  StopCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  // Import other icons if needed for example types
} from './Icons'; // Assuming Icons.tsx is in the same directory or path is adjusted

interface SidebarProps {
  isOpen: boolean;
}

// Define an interface for control items to include icons
interface ControlItem {
  id: string;
  label: string;
  type: string;
  icon: React.ElementType; // For rendering different icons
}

const controls: ControlItem[] = [
  { id: 'start', label: 'Start', type: 'start', icon: PlayCircleIcon },
  { id: 'action', label: 'Action', type: 'action', icon: CogIcon },
  { id: 'condition', label: 'Condition', type: 'condition', icon: QuestionMarkCircleIcon },
  { id: 'end', label: 'End', type: 'end', icon: StopCircleIcon },
];

// Collapsible section component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className="flex items-center justify-between w-full p-2 mb-2 text-left text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]"
      >
        <h3 className="text-md font-semibold">{title}</h3>
        {isSectionOpen ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
      </button>
      {isSectionOpen && <div className="pl-2 border-l-2 border-[var(--border-color)] ml-1">{children}</div>}
    </div>
  );
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const { importWorkflow } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleLoadExample = (example: WorkflowExample) => {
    importWorkflow({ nodes: example.nodes, edges: example.edges }, example.layoutDirection);
    // console.log(`Loading example: ${example.name}`); // Keep for debugging if needed
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out overflow-y-auto border-r border-[var(--border-color)] ${isOpen ? 'w-72 p-4' : 'w-0 p-0'}`}
      style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--foreground)' }}
    >
      {isOpen && (
        <>
          <CollapsibleSection title="Controls" defaultOpen={true}>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {controls.map((control) => {
                const IconComponent = control.icon;
                return (
                  <div
                    key={control.id}
                    onDragStart={(event) => onDragStart(event, control.type, control.label)}
                    draggable
                    className="flex flex-col items-center justify-center p-2 text-xs border border-[var(--border-color)] rounded-md cursor-grab hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] active:cursor-grabbing transition-all duration-150 shadow-sm hover:shadow-md bg-[var(--secondary)] text-[var(--secondary-foreground)] transform hover:scale-105 active:scale-95"
                    title={control.label} // Tooltip for full label
                  >
                    <IconComponent className="w-6 h-6 mb-1" />
                    <span>{control.label}</span>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Workflow Examples" defaultOpen={true}>
            <div className="space-y-2 mt-2">
              {workflowExamples.map((example) => (
                <div 
                  key={example.name} 
                  className="p-3 border border-[var(--border-color)] rounded-lg bg-[var(--card-bg)] shadow-sm text-[var(--card-foreground)] hover:shadow-md transition-shadow duration-150"
                >
                  <h4 className="font-semibold text-sm truncate">{example.name}</h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 mb-2 truncate">{example.description}</p>
                  <button
                    onClick={() => handleLoadExample(example)}
                    className="w-full p-1.5 text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:bg-[var(--primary-hover)] transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)] flex items-center justify-center space-x-1"
                    aria-label={`Load ${example.name} example`}
                  >
                    <PlayCircleIcon className="w-4 h-4" />
                    <span>Load</span>
                  </button>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </>
      )}
    </aside>
  );
}
