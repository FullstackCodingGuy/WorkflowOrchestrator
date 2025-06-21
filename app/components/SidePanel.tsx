import React, { useState } from 'react';

export interface PanelSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

interface SidePanelProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  sections: PanelSection[];
  width?: number;
  className?: string;
}

export function SidePanel({ 
  side, 
  isOpen, 
  onToggle, 
  sections, 
  width = 280, 
  className = '' 
}: SidePanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(s => s.defaultOpen).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set());
  };

  const expandAllSections = () => {
    setExpandedSections(new Set(sections.map(s => s.id)));
  };

  return (
    <>
      {/* Panel Container */}
      <div
        className={`
          fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full
          bg-gray-50 border-${side === 'left' ? 'r' : 'l'} border-gray-200
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
          ${className}
        `}
        style={{ width: `${width}px` }}
      >
        {/* Panel Header */}
        <div className="h-14 flex items-center justify-between px-3 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {side === 'left' ? 'Explorer' : 'Properties'}
            </h2>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-1">
            {/* Collapse All */}
            <button
              onClick={collapseAllSections}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Collapse All"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            {/* Expand All */}
            <button
              onClick={expandAllSections}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Expand All"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            {/* Close Panel */}
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-gray-200 transition-colors"
              title="Close Panel"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Panel Content - Scrollable */}
        <div className="flex-1 overflow-y-auto panel-scrollbar">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-200 last:border-b-0">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{section.icon}</span>
                  <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                    {section.title}
                  </span>
                </div>
                
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    expandedSections.has(section.id) ? 'rotate-90' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Section Content */}
              <div
                className={`
                  accordion-content overflow-hidden
                  ${expandedSections.has(section.id) ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="p-3 bg-white">
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panel Footer */}
        <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-center">
          <div className="text-xs text-gray-500">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}

// Toggle Button Component
interface PanelToggleButtonProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  icon?: string;
  label?: string;
}

export function PanelToggleButton({ 
  side, 
  isOpen, 
  onToggle, 
  icon = '📋', 
  label = 'Panel' 
}: PanelToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-1/2 -translate-y-1/2 z-50
        ${side === 'left' ? 'left-2' : 'right-2'}
        ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        bg-white border border-gray-300 rounded-lg shadow-lg
        px-2 py-3 hover:bg-gray-50 transition-all duration-200
        flex flex-col items-center space-y-1
      `}
      title={`${isOpen ? 'Close' : 'Open'} ${label}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium text-gray-600 writing-mode-vertical-lr transform rotate-180">
        {label}
      </span>
    </button>
  );
}
