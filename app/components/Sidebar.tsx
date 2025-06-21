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
    <div className="mb-3">
      <button
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className="btn btn-ghost w-full justify-between p-2 h-8 text-xs font-medium"
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
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {controls.map((control) => {
                const IconComponent = control.icon;
                return (
                  <div
                    key={control.id}
                    onDragStart={(event) => onDragStart(event, control.type, control.label)}
                    draggable
                    className="card flex flex-col items-center justify-center p-2 text-xs cursor-grab hover:bg-accent hover:text-accent-foreground active:cursor-grabbing transition-all duration-150 transform hover:scale-105 active:scale-95 min-h-[60px]"
                    title={control.label}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-medium leading-tight text-center">{control.label}</span>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Workflow Examples" defaultOpen={true}>
            <div className="space-y-1.5 mt-2">
              {workflowExamples.map((example) => (
                <div 
                  key={example.name} 
                  className="card card-content p-2.5"
                >
                  <h4 className="font-semibold text-xs truncate">{example.name}</h4>
                  <p className="text-[10px] text-muted mt-1 mb-2 truncate leading-tight">{example.description}</p>
                  <button
                    onClick={() => handleLoadExample(example)}
                    className="btn btn-xs btn-primary w-full"
                    aria-label={`Load ${example.name} example`}
                  >
                    <PlayCircleIcon className="w-3 h-3" />
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
