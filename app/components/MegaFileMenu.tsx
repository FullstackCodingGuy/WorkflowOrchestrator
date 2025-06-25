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
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
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
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === 'blank') {
      onNew();
    } else {
      onNewTemplate(templateId);
    }
    setIsOpen(false);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
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
        <div className="absolute top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden min-w-[800px] max-w-[900px]">
          
          {/* Single Unified View */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              
              {/* Left Column - Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                
                {/* Quick New Templates */}
                <div
                  onClick={() => handleTemplateSelect('blank')}
                  className="flex items-center p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all group border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                  onMouseEnter={() => setHoveredTemplate('blank')}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Blank Canvas</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Start fresh</div>
                  </div>
                </div>

                <div
                  onClick={() => handleTemplateSelect('basic-workflow')}
                  className="flex items-center p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-all group border border-transparent hover:border-green-200 dark:hover:border-green-700"
                  onMouseEnter={() => setHoveredTemplate('basic-workflow')}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">Basic Flow</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Simple process</div>
                  </div>
                </div>

                <div
                  onClick={() => handleTemplateSelect('conditional-workflow')}
                  className="flex items-center p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer transition-all group border border-transparent hover:border-amber-200 dark:hover:border-amber-700"
                  onMouseEnter={() => setHoveredTemplate('conditional-workflow')}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">Decision Flow</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">With branches</div>
                  </div>
                </div>

                <div
                  onClick={() => handleTemplateSelect('animated-basic')}
                  className="flex items-center p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all group border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                  onMouseEnter={() => setHoveredTemplate('animated-basic')}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Animated Flow</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">With motion</div>
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

                {/* File Operations */}
                <div
                  onClick={() => handleMenuItemClick(onLoad)}
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Open File</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ctrl+O</div>
                  </div>
                </div>

                <div
                  onClick={() => handleMenuItemClick(onSave)}
                  className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Save</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ctrl+S</div>
                  </div>
                </div>
              </div>

              {/* Center Column - Template Preview */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-[400px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  {hoveredTemplate ? (
                    <div className="text-center">
                      {hoveredTemplate === 'blank' && (
                        <div className="space-y-4">
                          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Blank Canvas</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Start with an empty workspace and build your workflow from scratch. Perfect for unique processes that don't fit standard templates.</p>
                          </div>
                        </div>
                      )}
                      
                      {hoveredTemplate === 'basic-workflow' && (
                        <div className="space-y-4">
                          <div className="w-full h-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center space-x-4">
                            <div className="w-16 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-medium">Start</div>
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="w-16 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-medium">Action</div>
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="w-16 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-medium">End</div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Sequential Flow</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">A simple linear workflow with start, action, and end nodes. Ideal for straightforward processes.</p>
                          </div>
                        </div>
                      )}

                      {hoveredTemplate === 'conditional-workflow' && (
                        <div className="space-y-4">
                          <div className="w-full h-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs">Start</div>
                              <div className="w-16 h-6 bg-amber-500 rounded flex items-center justify-center text-white text-xs">Decision</div>
                              <div className="flex space-x-8">
                                <div className="w-12 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">Yes</div>
                                <div className="w-12 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">No</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Conditional Branching</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Decision-based workflow with branching paths. Perfect for approval processes and conditional logic.</p>
                          </div>
                        </div>
                      )}

                      {hoveredTemplate === 'animated-basic' && (
                        <div className="space-y-4">
                          <div className="w-full h-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center space-x-4">
                            <div className="w-16 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-medium animate-pulse">Start</div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <div className="w-16 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-medium animate-pulse">End</div>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Animated Workflow</h4>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Enhanced workflow with smooth animations and visual effects. Great for presentations and demos.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <p className="text-lg font-medium">Hover over a template to preview</p>
                      <p className="text-sm mt-1">See how each workflow type looks before creating</p>
                    </div>
                  )}
                </div>

                {/* Quick Access Footer */}
                <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleMenuItemClick(onOpenPresentationView)}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0h8M5 8h14M5 12h14M5 16h14" />
                      </svg>
                      <span>Present</span>
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                    <button
                      onClick={() => handleMenuItemClick(onClear)}
                      className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Use keyboard shortcuts for faster access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
