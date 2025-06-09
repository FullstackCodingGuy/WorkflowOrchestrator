'use client';

import React, { useRef, useState } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { ImportIcon, ExportIcon, PlayIcon, PauseIcon, RestartIcon, SaveIcon, GifIcon, LayoutTreeIcon, LayoutHorizontalIcon, LoadIcon } from './Icons';
import html2canvas from 'html2canvas';
import GIF from 'gif.js';

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
    alert('Starting GIF export... This might take a moment.');

    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) {
      alert('Could not find React Flow viewport to capture.');
      setIsExportingGif(false);
      return;
    }

    try {
      // Ensure the worker script is available in the public folder
      // You might need to manually copy gif.worker.js from node_modules/gif.js/dist/ to your public folder
      const workerScriptPath = '/gif.worker.js'; 

      const canvas = await html2canvas(viewport, {
        logging: false,
        useCORS: true,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        scale: 1,
      });
      
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: workerScriptPath,
        background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        width: canvas.width,
        height: canvas.height,
      });

      gif.addFrame(canvas, { delay: 200 }); // Single frame for now

      gif.on('finished', (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'workflow.gif';
        link.click();
        URL.revokeObjectURL(link.href); // Clean up blob URL
        setIsExportingGif(false);
        alert('GIF exported successfully!');
      });

      gif.on('progress', (p) => {
        console.log(`GIF export progress: ${Math.round(p * 100)}%`);
      });

      gif.render();

    } catch (error) {
      console.error('Error exporting GIF:', error);
      alert('Failed to export GIF. Check console and ensure gif.worker.js is in the public folder.');
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

  return (
    <nav className="flex items-center gap-2 p-2 bg-[var(--toolbar-bg)] rounded-lg shadow-md">
      <button 
        onClick={handleToggleAnimation} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title={areEdgesAnimated ? "Stop Animation" : "Start Animation"}
      >
        {areEdgesAnimated ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        <span>{areEdgesAnimated ? "Stop" : "Start"} Anim</span>
      </button>
      <button 
        onClick={handleRestart} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Restart Workflow"
      >
        <RestartIcon className="w-5 h-5" />
        <span>Restart</span>
      </button>
      <button 
        onClick={() => applyLayout('TB')} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Apply Tree Layout (Top-to-Bottom)"
      >
        <LayoutTreeIcon className="w-5 h-5" /> 
        <span>Tree</span>
      </button>
      <button 
        onClick={() => applyLayout('LR')} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Apply Horizontal Layout (Left-to-Right)"
      >
        <LayoutHorizontalIcon className="w-5 h-5" />
        <span>Horizontal</span>
      </button>
      <div className="h-6 border-l border-[var(--border-color)] mx-1"></div> {/* Vertical Separator */}
      <button 
        onClick={handleSave} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Save Workflow to LocalStorage"
      >
        <SaveIcon className="w-5 h-5" />
        <span>Save</span>
      </button>
      <button 
        onClick={handleLoad} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Load Workflow from LocalStorage"
      >
        <LoadIcon className="w-5 h-5" /> 
        <span>Load</span>
      </button>
      <button 
        onClick={handleExport} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Export Workflow as JSON"
      >
        <ExportIcon className="w-5 h-5" />
        <span>Export JSON</span>
      </button>
      <button 
        onClick={handleExportGif} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle} ${isExportingGif ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title={isExportingGif ? "Exporting GIF..." : "Export Workflow as GIF"}
        disabled={isExportingGif}
      >
        <GifIcon className="w-5 h-5" />
        <span>{isExportingGif ? "Exporting..." : "Export GIF"}</span>
      </button>
      <input 
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button 
        onClick={handleImportClick} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Import Workflow from JSON"
      >
        <ImportIcon className="w-5 h-5" />
        <span>Import JSON</span>
      </button>
    </nav>
  );
}
