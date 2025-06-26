'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus,
  FileText,
  FolderOpen,
  Save,
  Share2,
  Download,
  X,
  Keyboard,
  File,
  Image,
  FileCode,
  FileX,
  Film,
  Zap
} from 'lucide-react';

interface MenuAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  actions: MenuAction[];
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  onExportGIF: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onNew,
  onOpen,
  onSave,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportPDF,
  onExportGIF,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('share');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const categories: MenuCategory[] = [
    {
      id: 'new',
      label: 'New',
      icon: Plus,
      actions: [
        {
          id: 'new-workflow',
          label: 'Blank Workflow',
          description: 'Create a new workflow from scratch',
          icon: FileText,
          shortcut: 'Ctrl+N',
          action: () => { onNew(); onClose(); }
        },
        {
          id: 'new-template',
          label: 'From Template',
          description: 'Start with a pre-built workflow template',
          icon: File,
          action: () => { onNew(); onClose(); }
        }
      ]
    },
    {
      id: 'open',
      label: 'Open',
      icon: FolderOpen,
      actions: [
        {
          id: 'open-file',
          label: 'Open File',
          description: 'Open an existing workflow file',
          icon: FolderOpen,
          shortcut: 'Ctrl+O',
          action: () => { onOpen(); onClose(); }
        }
      ]
    },
    {
      id: 'save',
      label: 'Save',
      icon: Save,
      actions: [
        {
          id: 'save-file',
          label: 'Save Workflow',
          description: 'Save the current workflow',
          icon: Save,
          shortcut: 'Ctrl+S',
          action: () => { onSave(); onClose(); }
        }
      ]
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      actions: [
        {
          id: 'export-image',
          label: 'Image Export',
          description: 'Export as high-quality PNG image',
          icon: Image,
          shortcut: 'Ctrl+Shift+P',
          action: () => { onExportPNG(); onClose(); }
        },
        {
          id: 'export-vector',
          label: 'SVG Export',
          description: 'Export as scalable vector graphics',
          icon: FileCode,
          shortcut: 'Ctrl+Shift+S',
          action: () => { onExportSVG(); onClose(); }
        },
        {
          id: 'export-document',
          label: 'PDF Export',
          description: 'Export as professional PDF document',
          icon: FileX,
          shortcut: 'Ctrl+Shift+D',
          action: () => { onExportPDF(); onClose(); }
        },
        {
          id: 'export-animation',
          label: 'GIF Export',
          description: 'Export as animated GIF presentation',
          icon: Film,
          shortcut: 'Ctrl+Shift+G',
          action: () => { onExportGIF(); onClose(); }
        },
        {
          id: 'export-config',
          label: 'JSON Export',
          description: 'Export workflow configuration as JSON',
          icon: FileText,
          shortcut: 'Ctrl+Shift+J',
          action: () => { onExportJSON(); onClose(); }
        }
      ]
    }
  ];

  if (!isOpen) return null;

  const activeActions = categories.find(cat => cat.id === activeCategory)?.actions || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div 
        ref={menuRef}
        className="absolute top-16 left-4 bg-white rounded-xl shadow-2xl border border-gray-200 w-[520px] max-h-[420px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900">Share & Export</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-80">
          {/* Left Column - Categories */}
          <div className="w-36 bg-gray-50/50 border-r border-gray-100">
            <nav className="p-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex flex-col items-center p-4 rounded-lg text-sm font-medium transition-all duration-200 mb-2 ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 shadow-sm scale-105'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-102'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    {category.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Column - Actions */}
          <div className="flex-1 p-6">
            <div className="space-y-2">
              {activeActions.map((action) => {
                const Icon = action.icon;
                const isExportAction = action.id.startsWith('export-');
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`w-full flex items-start p-4 rounded-lg text-left transition-all duration-200 group ${
                      action.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : isExportAction
                        ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.02] active:bg-gradient-to-r active:from-blue-100 active:to-purple-100'
                        : 'hover:bg-blue-50 hover:shadow-sm hover:scale-[1.02] active:bg-blue-100'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-4 transition-colors ${
                      isExportAction 
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200' 
                        : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors ${
                        isExportAction 
                          ? 'text-blue-700 group-hover:text-purple-700' 
                          : 'text-gray-600 group-hover:text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-semibold truncate transition-colors ${
                          isExportAction 
                            ? 'text-gray-900 group-hover:text-blue-900' 
                            : 'text-gray-900 group-hover:text-blue-900'
                        }`}>
                          {action.label}
                        </h3>
                        {action.shortcut && (
                          <kbd className={`ml-3 px-2 py-1 text-xs font-mono rounded border transition-colors ${
                            isExportAction 
                              ? 'bg-blue-100 text-blue-700 group-hover:bg-purple-100 group-hover:text-purple-700' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                          }`}>
                            {action.shortcut}
                          </kbd>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed group-hover:text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Help hint */}
            {activeActions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-400">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Press Esc to close
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
