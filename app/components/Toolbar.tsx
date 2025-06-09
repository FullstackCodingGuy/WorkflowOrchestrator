'use client';

import React, { useRef, useState } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { ImportIcon, ExportIcon, PlayIcon, PauseIcon, RestartIcon, SaveIcon, GifIcon, LayoutTreeIcon, LayoutHorizontalIcon, LoadIcon } from './Icons';
import html2canvas from 'html2canvas';
import GIF from 'gif.js';

interface ToolbarButtonConfig {
  id: string;
  label?: string | ((isExportingGif?: boolean, areEdgesAnimated?: boolean) => string);
  icon?: React.ReactElement;
  onClick?: () => void;
  title?: string | ((isExportingGif?: boolean, areEdgesAnimated?: boolean) => string);
  isDisabled?: boolean | ((isExportingGif?: boolean) => boolean);
  style?: React.CSSProperties;
  className?: string | ((isExportingGif?: boolean) => string); // Allow function for className
  type?: 'button' | 'separator';
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

  const handleToggleAnimation = () => {
    toggleEdgeAnimation();
  };

  const handleRestart = () => {
    console.log('Restarting workflow');
    setNodes([
      {
        id: 'startNode_reset_1',
        type: 'start',
        data: { id: 'startNode_reset_1', label: 'Start' },
        position: { x: 250, y: 5 },
        width: 180,
        height: 60,
      },
    ]);
    setEdges([]);
  };

  const handleSave = () => {
    saveWorkflowToLocalStorage();
    alert('Workflow saved to LocalStorage!');
  };

  const handleLoad = () => {
    loadWorkflowFromLocalStorage();
    alert('Workflow loaded from LocalStorage!');
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

  const buttonBaseStyle = "p-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] flex items-center justify-center gap-2 text-sm font-medium";
  const buttonHoverStyle = "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]";
  const buttonTextStyle = "text-[var(--foreground)]";
  const buttonBorderStyle = "border border-[var(--border-color)]";
  const commonButtonStyle = `${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`;

  const toolbarActions: ToolbarButtonConfig[] = [
    {
      id: 'animate',
      label: (isExportingGif, areEdgesAnimated) => areEdgesAnimated ? "Stop Anim" : "Start Anim",
      icon: areEdgesAnimated ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />,
      onClick: handleToggleAnimation,
      title: (isExportingGif, areEdgesAnimated) => areEdgesAnimated ? "Stop Animation" : "Start Animation",
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'restart',
      label: "Restart",
      icon: <RestartIcon className="w-5 h-5" />,
      onClick: handleRestart,
      title: "Restart Workflow",
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'layout-tb',
      label: "Tree",
      icon: <LayoutTreeIcon className="w-5 h-5" />,
      onClick: () => applyLayout('TB'),
      title: "Apply Tree Layout (Top-to-Bottom)",
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'layout-lr',
      label: "Horizontal",
      icon: <LayoutHorizontalIcon className="w-5 h-5" />,
      onClick: () => applyLayout('LR'),
      title: "Apply Horizontal Layout (Left-to-Right)",
      style: { backgroundColor: 'var(--secondary)' },
    },
    { id: 'separator1', type: 'separator' },
    {
      id: 'save',
      label: "Save",
      icon: <SaveIcon className="w-5 h-5" />,
      onClick: handleSave,
      title: "Save Workflow to LocalStorage",
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'load',
      label: "Load",
      icon: <LoadIcon className="w-5 h-5" />,
      onClick: handleLoad,
      title: "Load Workflow from LocalStorage",
      style: { backgroundColor: 'var(--secondary)' },
    },
    { id: 'separator2', type: 'separator' },    
    {
      id: 'export-json',
      label: "Export JSON",
      icon: <ExportIcon className="w-5 h-5" />,
      onClick: handleExport,
      title: "Export Workflow as JSON",
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'export-gif',
      label: (isExportingGif) => isExportingGif ? "Exporting..." : "Export GIF",
      icon: <GifIcon className="w-5 h-5" />,
      onClick: handleExportGif,
      title: (isExportingGif) => isExportingGif ? "Exporting GIF..." : "Export Workflow as GIF",
      isDisabled: (isExportingGif) => !!isExportingGif, 
      className: (isExportingGif) => isExportingGif ? 'opacity-50 cursor-not-allowed' : '', // Keep as function
      style: { backgroundColor: 'var(--secondary)' },
    },
    {
      id: 'import-json',
      label: "Import JSON",
      icon: <ImportIcon className="w-5 h-5" />,
      onClick: handleImportClick,
      title: "Import Workflow from JSON",
      style: { backgroundColor: 'var(--secondary)' },
    },
  ];

  return (
    <nav className="flex items-center gap-2 p-2 bg-[var(--toolbar-bg)] rounded-lg">
      {toolbarActions.map((action) => {
        if (action.type === 'separator') {
          return <div key={action.id} className="h-6 border-l border-[var(--border-color)] mx-1"></div>;
        }

        // Ensure onClick, icon, and label are defined for buttons before trying to use them
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
            className={`${commonButtonStyle} ${dynamicClassName || ''}`}
            style={action.style}
            title={currentTitle}
            disabled={currentDisabled}
          >
            {action.icon}
            <span>{currentLabel}</span>
          </button>
        );
      })}
      <input 
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </nav>
  );
}
