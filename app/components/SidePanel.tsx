import React, { useState, useRef, useEffect } from 'react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Simple auto-scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    let scrollInterval: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      
      // Clear existing interval
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }

      // Auto-scroll up
      if (mouseY < 50 && container.scrollTop > 0) {
        scrollInterval = setInterval(() => {
          if (container.scrollTop <= 0) {
            if (scrollInterval) clearInterval(scrollInterval);
            return;
          }
          container.scrollTop -= 3;
        }, 16);
      }
      // Auto-scroll down
      else if (mouseY > rect.height - 50 && 
               container.scrollTop < container.scrollHeight - container.clientHeight) {
        scrollInterval = setInterval(() => {
          if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
            if (scrollInterval) clearInterval(scrollInterval);
            return;
          }  
          container.scrollTop += 3;
        }, 16);
      }
    };

    const handleMouseLeave = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    };

    const handleScroll = () => {
      setShowScrollToTop(container.scrollTop > 200);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('scroll', handleScroll);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
      
      // Auto-scroll to the expanded section after a brief delay
      setTimeout(() => {
        const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (sectionElement && scrollContainerRef.current) {
          sectionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 100);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          fixed ${side === 'left' ? 'left-0' : 'right-0'} h-full
          panel border-${side === 'left' ? 'r' : 'l'}
          transition-all duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
          ${className}
        `}
        style={{ 
          width: `${width}px`,
          top: '48px', // Position under headerbar (toolbar height)
          height: 'calc(100vh - 48px - 28px)', // Account for toolbar and status bar
        }}
      >
        {/* Panel Header */}
        <div className="panel-header h-12 flex items-center justify-between px-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide">
              {side === 'left' ? 'Explorer' : 'Properties'}
            </h2>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-0.5">
            {/* Collapse All */}
            <button
              onClick={collapseAllSections}
              className="btn btn-icon btn-xs btn-ghost"
              title="Collapse All"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            {/* Expand All */}
            <button
              onClick={expandAllSections}
              className="btn btn-icon btn-xs btn-ghost"
              title="Expand All"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            {/* Close Panel */}
            <button
              onClick={onToggle}
              className="btn btn-icon btn-xs btn-ghost"
              title="Close Panel"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Panel Content - Scrollable with Enhanced Auto-Scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto panel-scrollbar smooth-scroll relative"
        >
          
          {sections.map((section) => (
            <div key={section.id} className="border-b border-border last:border-b-0" data-section-id={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{section.icon}</span>
                  <span className="text-xs font-medium text-muted group-hover:text-foreground uppercase tracking-wide">
                    {section.title}
                  </span>
                </div>
                
                {/* Chevron */}
                <svg
                  className={`w-3 h-3 text-muted group-hover:text-foreground transition-all duration-200 ${
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
          
          {/* Scroll to Top Button */}
          {showScrollToTop && (
            <button
              onClick={scrollToTop}
              className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary-hover transition-all duration-200 flex items-center justify-center"
              title="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
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
  label?: string;
}

export function PanelToggleButton({ 
  side, 
  isOpen, 
  onToggle, 
  label = 'Panel' 
}: PanelToggleButtonProps) {
  const getIcon = () => {
    if (side === 'left') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      );
    }
  };

  return (
    <button
      onClick={onToggle}
      className={`
        fixed bottom-8 z-50
        ${side === 'left' ? 'left-2' : 'right-2'}
        ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        btn btn-sm btn-secondary shadow-soft-lg
        flex flex-col items-center space-y-1 min-h-[60px] w-8
      `}
      title={`${isOpen ? 'Close' : 'Open'} ${label}`}
    >
      {getIcon()}
      <span className="text-[9px] font-medium text-muted writing-mode-vertical-lr transform rotate-180 leading-none">
        {label}
      </span>
    </button>
  );
}
