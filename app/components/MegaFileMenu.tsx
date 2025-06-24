import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  category: 'basic' | 'animated';
}

interface MegaFileMenuProps {
  onNew: () => void;
  onNewTemplate: (templateId: string) => void;
  onLoad: () => void;
  onSave: () => void;
  onClear: () => void;
  onOpenPresentationView: () => void;
  className?: string;
}

export function MegaFileMenu({
  onNew,
  onNewTemplate,
  onLoad,
  onSave,
  onClear,
  onOpenPresentationView,
  className = ''
}: MegaFileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'new'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Diagram templates
  const diagramTemplates: DiagramTemplate[] = [
    {
      id: 'basic-workflow',
      name: 'Basic Workflow',
      description: 'Simple sequential workflow with standard nodes',
      category: 'basic',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZjhmYWZjIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzEwYjk4MSIvPgo8dGV4dCB4PSI0MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdGFydDwvdGV4dD4KPGxpbmUgeDE9IjYwIiB5MT0iMzUiIHgyPSI4MCIgeTI9IjM1IiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSI4MCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiMzYjgyZjYiLz4KPHR4dCB4PSIxMDAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWN0aW9uPC90ZXh0Pgo8bGluZSB4MT0iMTIwIiB5MT0iMzUiIHgyPSIxNDAiIHkyPSIzNSIgc3Ryb2tlPSIjNjM2NmYxIiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2VmNDQ0NCIvPgo8dGV4dCB4PSIxNjAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RW5kPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjgwIiBmaWxsPSIjNjM2NmYxIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmFzaWMgV29ya2Zsb3c8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjNmI3Mjg5IiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW1wbGUgc2VxdWVudGlhbCBmbG93PC90ZXh0Pgo8L3N2Zz4='
    },
    {
      id: 'conditional-workflow',
      name: 'Conditional Workflow',
      description: 'Workflow with decision points and branching logic',
      category: 'basic',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmVmM2M3Ii8+CjxyZWN0IHg9IjgwIiB5PSIxMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjI1IiByeD0iNCIgZmlsbD0iIzEwYjk4MSIvPgo8dGV4dCB4PSIxMDAiIHk9IjI4IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3RhcnQ8L3RleHQ+CjxsaW5lIHgxPSIxMDAiIHkxPSIzNSIgeDI9IjEwMCIgeTI9IjUwIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMiIvPgo8cG9seWdvbiBwb2ludHM9Ijg1LDUwIDExNSw1MCA5MCw3NSIgZmlsbD0iI2Y1OWUwYiIvPgo8dGV4dCB4PSIxMDAiIHk9IjY1IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db25kaXRpb248L3RleHQ+CjxsaW5lIHgxPSI4NSIgeTE9IjYyIiB4Mj0iNTAiIHkyPSI5MCIgc3Ryb2tlPSIjNjM2NmYxIiBzdHJva2Utd2lkdGg9IjIiLz4KPGxpbmUgeDE9IjExNSIgeTE9IjYyIiB4Mj0iMTUwIiB5Mj0iOTAiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjMwIiB5PSI5MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjI1IiByeD0iNCIgZmlsbD0iIzNiODJmNiIvPgo8dGV4dCB4PSI1MCIgeT0iMTA4IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BY3Rpb24gQTwvdGV4dD4KPHJlY3QgeD0iMTMwIiB5PSI5MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjI1IiByeD0iNCIgZmlsbD0iIzNiODJmNiIvPgo8dGV4dCB4PSIxNTAiIHk9IjEwOCIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWN0aW9uIEI8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTM1IiBmaWxsPSIjZjU5ZTBiIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29uZGl0aW9uYWwgRmxvdzwvdGV4dD4KPC9zdmc+'
    },
    {
      id: 'animated-basic',
      name: 'Animated Basic Flow',
      description: 'Basic workflow with animated edges and transitions',
      category: 'animated',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmJmZGZmIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzEwYjk4MSIvPgo8dGV4dCB4PSI0MCIgeT0iNDAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdGFydDwvdGV4dD4KPGxpbmUgeDE9IjYwIiB5MT0iMzUiIHgyPSI4MCIgeTI9IjM1IiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ij4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgdmFsdWVzPSIwOzEwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgo8L2xpbmU+CjxjaXJjbGUgY3g9IjcwIiBjeT0iMzUiIHI9IjMiIGZpbGw9IiNmNTllMGIiPgogIDxhbmltYXRlIG1vdGlvbiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+CiAgICA8bXBhdGggcGF0aD0iTTYwLDM1IEw4MCwzNSIvPgogIDwvYW5pbWF0ZU1vdGlvbj4KPC9jaXJjbGU+CjxyZWN0IHg9IjgwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iIzNiODJmNiIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWN0aW9uPC90ZXh0Pgo8bGluZSB4MT0iMTIwIiB5MT0iMzUiIHgyPSIxNDAiIHkyPSIzNSIgc3Ryb2tlPSIjNjM2NmYxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjUsNSI+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIHZhbHVlcz0iMDsxMCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9saW5lPgo8Y2lyY2xlIGN4PSIxMzAiIGN5PSIzNSIgcj0iMyIgZmlsbD0iI2Y1OWUwYiI+CiAgPGFuaW1hdGVNb3Rpb24gZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIxcyI+CiAgICA8bXBhdGggcGF0aD0iTTEyMCwzNSBMMTQwLDM1Ii8+CiAgPC9hbmltYXRlTW90aW9uPgo8L2NpcmNsZT4KPHJlY3QgeD0iMTQwIiB5PSIyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2VmNDQ0NCIvPgo8dGV4dCB4PSIxNjAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RW5kPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjgwIiBmaWxsPSIjNjM2NmYxIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QW5pbWF0ZWQgRmxvdzwvdGV4dD4KPHR4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0iIzZiNzI4OSIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2l0aCBtb3Rpb24gZWZmZWN0czwvdGV4dD4KPC9zdmc+'
    },
    {
      id: 'animated-complex',
      name: 'Advanced Animated Flow',
      description: 'Complex workflow with multiple animations and effects',
      category: 'animated',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZmJmZGZmIi8+CjxyZWN0IHg9Ijc1IiB5PSI1IiB3aWR0aD0iNTAiIGhlaWdodD0iMjUiIHJ4PSI0IiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMjMiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdGFydDwvdGV4dD4KPGxpbmUgeDE9IjEwMCIgeTE9IjMwIiB4Mj0iMTAwIiB5Mj0iNDUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtZGFzaGFycmF5PSI4LDQiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiB2YWx1ZXM9IjA7MTIiIGR1cj0iMS41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9saW5lPgo8cG9seWdvbiBwb2ludHM9Ijc1LDQ1IDEyNSw0NSAxMDAsNzAiIGZpbGw9IiNmNTllMGIiIG9wYWNpdHk9IjAuOSI+CiAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgdmFsdWVzPSIxOzEuMTsxIiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgo8L3BvbHlnb24+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNob2ljZTwvdGV4dD4KPGxpbmUgeDE9Ijc1IiB5MT0iNTciIHgyPSI0MCIgeTI9Ijg1IiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWRhc2hhcnJheT0iNiw0Ij4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgdmFsdWVzPSIwOzEwIiBkdXI9IjEuMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CjwvbGluZT4KPGxpbmUgeDE9IjEyNSIgeTE9IjU3IiB4Mj0iMTYwIiB5Mj0iODUiIHN0cm9rZT0iIzYzNjZmMSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtZGFzaGFycmF5PSI2LDQiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiB2YWx1ZXM9IjA7MTAiIGR1cj0iMS4ycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjVzIi8+CjwvbGluZT4KPHJlY3QgeD0iMTAiIHk9Ijg1IiB3aWR0aD0iNjAiIGhlaWdodD0iMjUiIHJ4PSI0IiBmaWxsPSIjM2I4MmY2Ij4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjAuNzsxOzAuNyIgZHVyPSIzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9yZWN0Pgo8dGV4dCB4PSI0MCIgeT0iMTAzIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSI5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9jZXNzIEE8L3RleHQ+CjxyZWN0IHg9IjEzMCIgeT0iODUiIHdpZHRoPSI2MCIgaGVpZ2h0PSIyNSIgcng9IjQiIGZpbGw9IiMzYjgyZjYiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC43OzE7MC43IiBkdXI9IjNzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjEuNXMiLz4KPC9yZWN0Pgo8dGV4dCB4PSIxNjAiIHk9IjEwMyIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iOSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvY2VzcyBCPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjEzNSIgZmlsbD0iIzYzNjZmMSIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFkdmFuY2VkIEFuaW1hdGVkPC90ZXh0Pgo8L3N2Zz4='
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection('main');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (activeSection === 'new') {
          setActiveSection('main');
        } else {
          setIsOpen(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, activeSection]);

  const handleNewClick = () => {
    setActiveSection('new');
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'blank') {
      onNew();
    } else {
      onNewTemplate(templateId);
    }
    setIsOpen(false);
    setActiveSection('main');
  };

  const handleBackToMain = () => {
    setActiveSection('main');
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
    setActiveSection('main');
  };

  const trigger = (
    <button className={`btn btn-sm btn-ghost text-foreground hover:bg-secondary ${className}`}>
      <span>File</span>
      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Mega Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[600px]">
          
          {/* Main Menu */}
          {activeSection === 'main' && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Main Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">File Operations</h3>
                  
                  {/* New */}
                  <div
                    onClick={handleNewClick}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">New Workflow</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Create from templates</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 font-mono">Shift+Ctrl+N</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                  {/* Open */}
                  <div
                    onClick={() => handleMenuItemClick(onLoad)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Open...</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Load existing workflow</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Ctrl+O</span>
                  </div>

                  {/* Save */}
                  <div
                    onClick={() => handleMenuItemClick(onSave)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Save</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Save current workflow</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Ctrl+S</span>
                  </div>
                </div>

                {/* Right Column - Additional Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tools & Export</h3>
                  
                  {/* Presentation View */}
                  <div
                    onClick={() => handleMenuItemClick(onOpenPresentationView)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0h8M5 8h14M5 12h14M5 16h14" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Presentation View</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Present workflow</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">Ctrl+P</span>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                  {/* Clear All */}
                  <div
                    onClick={() => handleMenuItemClick(onClear)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300">Clear All</div>
                        <div className="text-sm text-red-500 dark:text-red-500">Remove all nodes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Template Selection */}
          {activeSection === 'new' && (
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBackToMain}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Template</h3>
                </div>
              </div>

              {/* Basic Templates */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic Workflows</h4>
                
                {/* Blank Workflow Option */}
                <div
                  onClick={() => handleTemplateSelect('blank')}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-all group mb-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                        Blank Workflow
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Start with an empty canvas
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:ring-2 group-hover:ring-green-300 dark:group-hover:ring-green-600 transition-all h-24 flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {diagramTemplates.filter(t => t.category === 'basic').map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {template.description}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:ring-2 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all">
                        <Image
                          src={template.image}
                          alt={template.name}
                          width={200}
                          height={96}
                          className="w-full h-24 object-cover"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animated Templates */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Animated Workflows</h4>
                <div className="grid grid-cols-2 gap-3">
                  {diagramTemplates.filter(t => t.category === 'animated').map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {template.description}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700 group-hover:ring-2 group-hover:ring-purple-300 dark:group-hover:ring-purple-600 transition-all">
                        <Image
                          src={template.image}
                          alt={template.name}
                          width={200}
                          height={96}
                          className="w-full h-24 object-cover"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
