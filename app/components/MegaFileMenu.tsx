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
  // Recent files state (session only)
  const [recentFiles, setRecentFiles] = useState<Array<{ name: string; date: string; size: string }>>([
    { name: 'Workflow_1.json', date: '2 hours ago', size: '12 KB' },
    { name: 'Process_Flow.json', date: '1 day ago', size: '8 KB' },
    { name: 'Decision_Tree.json', date: '3 days ago', size: '15 KB' },
    { name: 'MyDiagram.json', date: '5 days ago', size: '10 KB' },
    { name: 'Demo.json', date: '1 week ago', size: '7 KB' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('new');
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
    <button className={`
      px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
      border border-gray-200 rounded-sm transition-all duration-150 
      flex items-center space-x-2 min-w-[80px] justify-center
      shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      ${isOpen ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
      ${className}
    `}>
      <span>File</span>
      <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="absolute top-full left-0 z-50 mt-1 overflow-hidden shadow-2xl">
          <div className="bg-white border border-gray-200 rounded-sm w-[800px]">
            {/* Header Strip */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">File</h2>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span>Navigate with arrow keys</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Press Esc to close</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 bg-white min-h-[450px]">
              {/* Left Column - First Level Menu */}
              <div className="bg-gray-50 border-r border-gray-200">
                <div className="p-4 space-y-1">
                  {/* New Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'new' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('new')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New</span>
                  </div>

                  {/* Open Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'open' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('open')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    <span>Open</span>
                  </div>

                  {/* Save Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'save' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('save')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save</span>
                  </div>

                  {/* Share Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'share' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('share')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share & Export</span>
                  </div>

                  {/* Tools Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'tools' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('tools')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Tools</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-300 my-3"></div>

                  {/* Recent Section */}
                  <div
                    className={`w-full text-left px-4 py-3 rounded-sm text-sm font-medium transition-all duration-150 cursor-pointer flex items-center space-x-3 ${
                      activeSection === 'recent' 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSection('recent')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Recent</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Second Level Content */}
              <div className="bg-white p-6">
                {/* New Section Content */}
                {activeSection === 'new' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Document</h3>
                      <p className="text-sm text-gray-600 mb-6">Choose how you want to start your workflow design.</p>
                    </div>

                    {/* Blank Canvas */}
                    <div
                      onClick={() => handleTemplateSelect('blank')}
                      className="group p-6 rounded-sm border border-gray-200 hover:border-blue-300 
                                hover:bg-blue-50 cursor-pointer transition-all duration-200 
                                hover:shadow-lg bg-white"
                      onMouseEnter={() => setHoveredTemplate('blank')}
                      onMouseLeave={() => setHoveredTemplate(null)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 
                                      rounded-lg flex items-center justify-center text-white 
                                      group-hover:scale-105 transition-transform duration-200">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">Blank Canvas</h4>
                          <p className="text-sm text-gray-600 mt-1">Start with an empty workspace and build your workflow from scratch</p>
                        </div>
                      </div>
                    </div>

                    {/* Templates */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-800 mb-3">Templates</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div
                          onClick={() => handleTemplateSelect('basic-workflow')}
                          className="group p-4 rounded-sm border border-gray-200 hover:border-green-300 
                                    hover:bg-green-50 cursor-pointer transition-all duration-200 bg-white"
                          onMouseEnter={() => setHoveredTemplate('basic-workflow')}
                          onMouseLeave={() => setHoveredTemplate(null)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 
                                          rounded-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 group-hover:text-green-700">Basic Sequential Flow</div>
                              <div className="text-sm text-gray-600">Simple linear workflow with start, action, and end nodes</div>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleTemplateSelect('conditional-workflow')}
                          className="group p-4 rounded-sm border border-gray-200 hover:border-amber-300 
                                    hover:bg-amber-50 cursor-pointer transition-all duration-200 bg-white"
                          onMouseEnter={() => setHoveredTemplate('conditional-workflow')}
                          onMouseLeave={() => setHoveredTemplate(null)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 
                                          rounded-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 group-hover:text-amber-700">Decision-Based Flow</div>
                              <div className="text-sm text-gray-600">Workflow with decision points and branching logic</div>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => handleTemplateSelect('animated-basic')}
                          className="group p-4 rounded-sm border border-gray-200 hover:border-purple-300 
                                    hover:bg-purple-50 cursor-pointer transition-all duration-200 bg-white"
                          onMouseEnter={() => setHoveredTemplate('animated-basic')}
                          onMouseLeave={() => setHoveredTemplate(null)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 
                                          rounded-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 group-hover:text-purple-700">Animated Workflow</div>
                              <div className="text-sm text-gray-600">Enhanced workflow with motion effects and transitions</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Open Section Content */}
                {activeSection === 'open' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Open Document</h3>
                      <p className="text-sm text-gray-600 mb-6">Open an existing workflow from your device.</p>
                    </div>

                    <div
                      onClick={() => handleMenuItemClick(onLoad)}
                      className="group p-6 rounded-sm border border-gray-200 hover:border-blue-300 
                                hover:bg-blue-50 cursor-pointer transition-all duration-200 
                                hover:shadow-lg bg-white"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 
                                      rounded-lg flex items-center justify-center text-white 
                                      group-hover:scale-105 transition-transform duration-200">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">Browse Files</h4>
                          <p className="text-sm text-gray-600 mt-1">Open a workflow file from your computer</p>
                          <p className="text-xs text-gray-500 mt-2">Keyboard shortcut: Ctrl+O</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Section Content */}
                {activeSection === 'save' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Save Document</h3>
                      <p className="text-sm text-gray-600 mb-6">Save your current workflow to your device.</p>
                    </div>

                    <div
                      onClick={() => handleMenuItemClick(onSave)}
                      className="group p-6 rounded-sm border border-gray-200 hover:border-green-300 
                                hover:bg-green-50 cursor-pointer transition-all duration-200 
                                hover:shadow-lg bg-white"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 
                                      rounded-lg flex items-center justify-center text-white 
                                      group-hover:scale-105 transition-transform duration-200">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-700">Save Workflow</h4>
                          <p className="text-sm text-gray-600 mt-1">Save your current workflow as a JSON file</p>
                          <p className="text-xs text-gray-500 mt-2">Keyboard shortcut: Ctrl+S</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Share Section Content */}
                {activeSection === 'share' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Share & Export</h3>
                      <p className="text-sm text-gray-600 mb-6">Present your workflow or export in different formats.</p>
                    </div>

                    <div className="space-y-3">
                      <div
                        onClick={() => handleMenuItemClick(onOpenPresentationView)}
                        className="group p-4 rounded-sm border border-gray-200 hover:border-blue-300 
                                  hover:bg-blue-50 cursor-pointer transition-all duration-200 bg-white"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 
                                        rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0h8M5 8h14M5 12h14M5 16h14" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 group-hover:text-blue-700">Presentation Mode</div>
                            <div className="text-sm text-gray-600">View your workflow in fullscreen presentation mode</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tools Section Content */}
                {activeSection === 'tools' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tools & Actions</h3>
                      <p className="text-sm text-gray-600 mb-6">Additional tools and workflow management options.</p>
                    </div>

                    <div className="space-y-3">
                      <div
                        onClick={() => handleMenuItemClick(onClear)}
                        className="group p-4 rounded-sm border border-gray-200 hover:border-red-300 
                                  hover:bg-red-50 cursor-pointer transition-all duration-200 bg-white"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 
                                        rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 group-hover:text-red-700">Clear Canvas</div>
                            <div className="text-sm text-gray-600">Remove all nodes and start over</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Section Content */}
                {activeSection === 'recent' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Files</h3>
                      <p className="text-sm text-gray-600 mb-6">Quickly access your recently opened workflows.</p>
                    </div>

                    <div className="space-y-2">
                      {recentFiles.map((file, idx) => (
                        <div key={file.name}
                             className="group p-3 rounded-sm hover:bg-gray-50 cursor-pointer 
                                       transition-colors duration-150 border border-transparent 
                                       hover:border-gray-200"
                             onClick={() => { handleMenuItemClick(onLoad); setIsOpen(false); }}>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 
                                          rounded-sm flex items-center justify-center text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-800 group-hover:text-blue-700">{file.name}</div>
                              <div className="text-sm text-gray-600">{file.date} • {file.size}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>💡 Tip: Click on menu items to explore options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">N</kbd>
                  <span>for new document</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
