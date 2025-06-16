'use client';

import React, { useRef, useState, useEffect } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { ImportIcon, ExportIcon, PlayIcon, PauseIcon, RestartIcon, SaveIcon, GifIcon, LayoutTreeIcon, LayoutHorizontalIcon, LoadIcon, ChevronDownIcon, SettingsIcon, PresentationIcon, VisualEditorIcon } from './Icons';
import html2canvas from 'html2canvas';
import GIF from 'gif.js';
import dynamic from 'next/dynamic';
import { APP_COLORS } from '../config/appConfig';

// Dynamically import RevealEditor to avoid SSR issues with reveal.js
const RevealEditor = dynamic(() => import('./RevealEditor'), { ssr: false });
const PresentationEditor = dynamic(() => import('./PresentationEditor'), { ssr: false });

// Define a type for extensible app settings
interface AppSettings {
  hideMinimap: boolean;
  // Add more settings here as needed
}

const SETTINGS_STORAGE_KEY = 'workflow_app_settings';

function loadSettingsFromStorage(): AppSettings {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore parse error, fallback to default
      }
    }
  }
  return { hideMinimap: false };
}

// Interface for toolbar button configuration
interface ToolbarButtonConfig {
  id: string;
  label?: string | ((isExportingGif?: boolean, areEdgesAnimated?: boolean) => string);
  icon?: React.ReactElement;
  onClick?: () => void;
  title?: string | ((isExportingGif?: boolean, areEdgesAnimated?: boolean) => string);
  isDisabled?: boolean | ((isExportingGif?: boolean) => boolean);
  style?: React.CSSProperties;
  className?: string | ((isExportingGif?: boolean) => string);
  type?: 'button' | 'separator' | 'dropdown';
  dropdownActions?: ToolbarButtonConfig[];
}

export default function Toolbar() {
  const { 
    exportWorkflow, 
    importWorkflow, 
    setNodes, 
    setEdges, 
    areEdgesAnimated, 
    toggleEdgeAnimation,
    applyLayout,
    saveWorkflowToLocalStorage,
    loadWorkflowFromLocalStorage,
  } = useWorkflowStore(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportingGif, setIsExportingGif] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [showRevealEditor, setShowRevealEditor] = useState(false);
  const [showPresentationEditor, setShowPresentationEditor] = useState(false);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  // Ref for the container of the currently open dropdown.
  const dropdownContainerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        // If the click is outside the current dropdown's container, close it.
        // The trigger button's own onClick will handle reopening if the same trigger is clicked.
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Effect runs once to attach/detach listener

  // In Toolbar, fire a custom event when settings change
  useEffect(() => {
    const event = new CustomEvent('appsettings:update', { detail: { hideMinimap: settings.hideMinimap } });
    window.dispatchEvent(event);
  }, [settings.hideMinimap]);

  const handleToggleAnimation = () => {
    toggleEdgeAnimation();
  };

  const handleRestart = () => {
    // Find all start nodes
    const nodes = useWorkflowStore.getState().nodes;
    const edges = useWorkflowStore.getState().edges;
    const startNodeIds = nodes.filter(n => n.type === 'start').map(n => n.id);
    // Find the first edge whose source is a start node
    const firstEdgeIdx = edges.findIndex(e => startNodeIds.includes(e.source));
    setEdges(
      edges.map((e, i) => ({
        ...e,
        animated: i === firstEdgeIdx,
        data: {
          ...(e.data || {}),
          completed: false,
        },
      }))
    );
  };

  const handleSave = () => {
    saveWorkflowToLocalStorage();
    alert('Workflow saved to LocalStorage!');
  };

  const handleLoad = () => {
    loadWorkflowFromLocalStorage();
    alert('Workflow loaded from LocalStorage!');
  };

  const handlePresentationClick = () => {
    setShowRevealEditor(true);
  };

  const handleOpenPresentationEditor = () => {
    setShowPresentationEditor(true);
  };

  const handleExportGif = async () => {
    setIsExportingGif(true);
    alert('Starting animated GIF export... This might take a moment and capture for a few seconds.');

    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) {
      alert('Could not find React Flow viewport to capture.');
      setIsExportingGif(false);
      return;
    }

    try {
      const workerScriptPath = '/gif.worker.js';
      const numFrames = 15; // Capture 15 frames
      const frameDelay = 100; // 100ms delay between frames (10 FPS)

      const initialCanvas = await html2canvas(viewport, {
        logging: false,
        useCORS: true,
        background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
      });

      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: workerScriptPath,
        background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        width: initialCanvas.width,
        height: initialCanvas.height,
        dither: 'FloydSteinberg', // Optional: improves color quantization
      });

      // Function to capture a single frame
      const captureFrame = () => {
        return html2canvas(viewport, {
          logging: false,
          useCORS: true,
          background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        });
      };

      // Add initial frame immediately
      gif.addFrame(initialCanvas, { delay: frameDelay });
      let framesCaptured = 1;
      console.log(`GIF export: Frame ${framesCaptured}/${numFrames} captured.`);

      // Capture subsequent frames
      const frameInterval = setInterval(async () => {
        if (framesCaptured >= numFrames) {
          clearInterval(frameInterval);
          console.log('All frames captured. Rendering GIF...');
          gif.render();
          return;
        }

        try {
          const canvas = await captureFrame();
          gif.addFrame(canvas, { delay: frameDelay, copy: true }); // Use copy: true for subsequent frames
          framesCaptured++;
          console.log(`GIF export: Frame ${framesCaptured}/${numFrames} captured.`);
        } catch (frameError) {
          console.error('Error capturing a frame:', frameError);
          // Optionally, stop the process or skip the frame
        }
      }, frameDelay);


      gif.on('finished', (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'workflow_animated.gif';
        link.click();
        URL.revokeObjectURL(link.href);
        setIsExportingGif(false);
        alert('Animated GIF exported successfully!');
      });

      gif.on('progress', (p) => {
        // Progress is for the rendering phase after all frames are added
        console.log(`GIF rendering progress: ${Math.round(p * 100)}%`);
      });

      // Note: gif.render() is called after all frames are captured in the interval

    } catch (error) {
      console.error('Error exporting animated GIF:', error);
      alert('Failed to export animated GIF. Check console.');
      setIsExportingGif(false);
    }
  };

  const handleExport = () => {
    const workflowData = exportWorkflow();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(workflowData, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'workflow.json';
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData && typeof importedData === 'object' && importedData.nodes && importedData.edges) {
            importWorkflow(importedData, 'TB');
          } else {
            alert('Invalid workflow file format. Missing nodes or edges array.');
          }
        } catch (error) {
          console.error('Error parsing imported JSON:', error);
          alert('Failed to import workflow. Ensure the file is valid JSON.');
        }
      };
      reader.readAsText(file);
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  // Define base styles for buttons
  const buttonBaseStyle = "p-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] flex items-center justify-center gap-2 text-sm font-medium";
  
  // Styles for general toolbar buttons (including dropdown triggers)
  const commonButtonStyle = `${buttonBaseStyle} text-[var(--foreground)] border border-[var(--border-color)] bg-[var(--secondary)] hover:bg-[var(--primary-hover)] hover:text-[var(--primary-foreground)]`;

  // Styles for dropdown items (buttons within the dropdown panel)
  const dropdownItemStyle = `${buttonBaseStyle} w-full justify-start text-left px-3 py-2 text-[var(--card-foreground)] hover:bg-[var(--secondary-hover)] hover:text-[var(--secondary-foreground)]`;


  const toolbarActions: ToolbarButtonConfig[] = [
    {
      id: 'animate',
      label: (isExportingGif, areEdgesAnimated) => areEdgesAnimated ? "Stop" : "Start",
      icon: areEdgesAnimated ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />,
      onClick: handleToggleAnimation,
      title: (isExportingGif, areEdgesAnimated) => areEdgesAnimated ? "Stop Edge Animation" : "Start Edge Animation",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    {
      id: 'restart',
      label: "Restart",
      icon: <RestartIcon className="w-5 h-5" />,
      onClick: handleRestart,
      title: "Restart Workflow",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    {
      id: 'layout-dropdown',
      label: "Layout",
      icon: <LayoutTreeIcon className="w-5 h-5" />, // Using LayoutTreeIcon as main for dropdown
      type: 'dropdown',
      title: "Change Layout",
      // No 'style' prop here, commonButtonStyle will be applied to the trigger
      dropdownActions: [
        {
          id: 'layout-tb-dd',
          label: "Tree Layout",
          icon: <LayoutTreeIcon className="w-4 h-4 mr-2" />,
          onClick: () => applyLayout('TB'),
          title: "Apply Tree Layout (Top-to-Bottom)",
        },
        {
          id: 'layout-lr-dd',
          label: "Horizontal Layout",
          icon: <LayoutHorizontalIcon className="w-4 h-4 mr-2" />,
          onClick: () => applyLayout('LR'),
          title: "Apply Horizontal Layout (Left-to-Right)",
        },
      ]
    },
    { id: 'separator1', type: 'separator' },
    {
      id: 'save',
      label: "Save",
      icon: <SaveIcon className="w-5 h-5" />,
      onClick: handleSave,
      title: "Save Workflow to LocalStorage",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    {
      id: 'load',
      label: "Load",
      icon: <LoadIcon className="w-5 h-5" />,
      onClick: handleLoad,
      title: "Load Workflow from LocalStorage",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    { id: 'separator2', type: 'separator' },    
    {
      id: 'export-dropdown',
      label: "Export",
      icon: <ExportIcon className="w-5 h-5" />,
      type: 'dropdown',
      // No specific style, will use commonButtonStyle for the trigger button
      title: "Export Workflow",
      dropdownActions: [
        {
          id: 'export-json',
          label: "Export JSON",
          icon: <ExportIcon className="w-4 h-4 mr-2" />, // Smaller icon for dropdown
          onClick: handleExport,
          title: "Export Workflow as JSON",
        },
        {
          id: 'export-gif',
          label: (isExportingGif) => isExportingGif ? "Exporting GIF..." : "Export GIF",
          icon: <GifIcon className="w-4 h-4 mr-2" />, // Smaller icon for dropdown
          onClick: handleExportGif,
          title: (isExportingGif) => isExportingGif ? "Exporting GIF..." : "Export Workflow as GIF",
          isDisabled: (isExportingGif) => !!isExportingGif,
          className: (isExportingGif) => isExportingGif ? 'opacity-50 cursor-not-allowed' : '',
        },
      ]
    },
    {
      id: 'import-json',
      label: "Import JSON",
      icon: <ImportIcon className="w-5 h-5" />,
      onClick: handleImportClick,
      title: "Import Workflow from JSON",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    { id: 'separator3', type: 'separator' },
    {
      id: 'presentation',
      label: "Presentation",
      icon: <PresentationIcon className="w-5 h-5" />,
      onClick: handlePresentationClick,
      title: "Open Presentation Editor",
      // No 'style' prop here, commonButtonStyle will be applied
    },
    {
      id: 'visual-editor',
      label: "Visual Editor",
      icon: <VisualEditorIcon className="w-5 h-5" />,
      onClick: handleOpenPresentationEditor,
      title: "Open Visual Presentation Editor",
    },
  ];

  return (
    <nav className="flex items-center gap-2 p-2 bg-[var(--toolbar-bg)] rounded-lg">
      {toolbarActions.map((action) => {
        if (action.type === 'separator') {
          return <div key={action.id} className="h-6 border-l border-[var(--border-color)] mx-1"></div>;
        }

        if (action.type === 'dropdown') {
          return (
            <div 
              key={action.id} 
              className="relative" 
              ref={openDropdown === action.id ? dropdownContainerRef : null} // Assign ref to the active dropdown's container
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === action.id ? null : action.id)}
                className={commonButtonStyle} // Dropdown trigger uses common button style
                title={typeof action.title === 'function' ? action.title(isExportingGif, areEdgesAnimated) : action.title}
              >
                {action.icon}
                <span className="hidden sm:inline">{typeof action.label === 'function' ? action.label(isExportingGif, areEdgesAnimated) : action.label}</span>
                <ChevronDownIcon className="w-4 h-4 ml-1 hidden sm:inline" />
              </button>
              {openDropdown === action.id && action.dropdownActions && (
                <div 
                  className={`absolute ${action.id === 'export-dropdown' || action.id === 'layout-dropdown' ? 'left-0' : 'right-0'} mt-2 w-56 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-md shadow-lg z-50 py-1`}
                >
                  {action.dropdownActions.map(ddAction => {
                    if (!ddAction.onClick || !ddAction.label) return null;
                    const currentLabel = typeof ddAction.label === 'function' ? ddAction.label(isExportingGif, areEdgesAnimated) : ddAction.label;
                    const currentTitle = typeof ddAction.title === 'function' ? ddAction.title(isExportingGif, areEdgesAnimated) : ddAction.title;
                    const currentDisabled = typeof ddAction.isDisabled === 'function' ? ddAction.isDisabled(isExportingGif) : ddAction.isDisabled;
                    const dynamicClassName = typeof ddAction.className === 'function' ? ddAction.className(isExportingGif) : ddAction.className;
                    
                    return (
                      <button
                        key={ddAction.id}
                        onClick={() => {
                          ddAction.onClick?.();
                          setOpenDropdown(null); 
                        }}
                        title={currentTitle}
                        disabled={currentDisabled}
                        // Use dropdownItemStyle for styling, remove individual border, ensure transparent bg
                        className={`${dropdownItemStyle} ${dynamicClassName || ''} ${currentDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ border: 'none', backgroundColor: 'transparent', ...ddAction.style }} 
                      >
                        {ddAction.icon && <span className="mr-2">{ddAction.icon}</span>}
                        {currentLabel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        // Regular button
        if (!action.onClick || !action.icon || !action.label) {
          // This case should ideally not be reached if separators are handled correctly
          // and button configs are complete. Log an error or return null.
          console.error(`Toolbar action ${action.id} is missing required properties for a button.`);
          return null; 
        }

        const currentLabel = typeof action.label === 'function' ? action.label(isExportingGif, areEdgesAnimated) : action.label;
        const currentTitle = typeof action.title === 'function' ? action.title(isExportingGif, areEdgesAnimated) : action.title;
        const currentDisabled = typeof action.isDisabled === 'function' ? action.isDisabled(isExportingGif) : action.isDisabled;
        const dynamicClassName = typeof action.className === 'function' ? action.className(isExportingGif) : action.className;

        return (
          <button 
            key={action.id}
            onClick={action.onClick} 
            className={`${commonButtonStyle} ${dynamicClassName || ''}`} // Regular buttons use commonButtonStyle
            title={currentTitle}
            disabled={currentDisabled}
          >
            {action.icon}
            <span className="hidden sm:inline">{currentLabel}</span> 
          </button>
        );
      })}
      {/* Render uploaded file input (hidden) */}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleFileChange} />
      
      {/* Render Settings Modal if needed */}
      {showSettings && (
        <ProfileModal 
          onClose={() => setShowSettings(false)}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      {/* Render RevealEditor if needed */}
      {showRevealEditor && (
        <RevealEditor onClose={() => setShowRevealEditor(false)} />
      )}

      {/* Render PresentationEditor if needed */}
      {showPresentationEditor && (
        <PresentationEditor onClose={() => setShowPresentationEditor(false)} />
      )}
    </nav>
  );
}

// ProfileModal with tab layout and extensible app settings
const ProfileModal = ({ onClose, settings, setSettings }: { onClose: () => void, settings: AppSettings, setSettings: React.Dispatch<React.SetStateAction<AppSettings>> }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'appsettings'>('profile');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--background)] rounded-lg shadow-xl w-full max-w-md p-0 relative">
        <div className="flex justify-between items-center border-b border-[var(--border-color)] px-6 py-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex border-b border-[var(--border-color)] bg-[var(--secondary)]">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'profile' ? 'bg-[var(--background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'preferences' ? 'bg-[var(--background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'appsettings' ? 'bg-[var(--background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}
            onClick={() => setActiveTab('appsettings')}
          >
            App Settings
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <input className="w-full p-2 rounded border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)]" value="User" readOnly />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="w-full p-2 rounded border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)]" value="user@email.com" readOnly />
              </div>
            </div>
          )}
          {activeTab === 'preferences' && (
            <div>
              <div className="mb-4 text-sm text-[var(--muted-foreground)]">Preferences options coming soon...</div>
            </div>
          )}
          {activeTab === 'appsettings' && (
            <div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hideMinimap}
                    onChange={e => setSettings(prev => ({ ...prev, hideMinimap: e.target.checked }))}
                    className="form-checkbox h-4 w-4 text-[var(--primary)] border-[var(--border-color)] rounded"
                  />
                  <span className="text-sm">Hide Minimap</span>
                </label>
              </div>
              {/* Add more boolean switches or settings here for extensibility */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
