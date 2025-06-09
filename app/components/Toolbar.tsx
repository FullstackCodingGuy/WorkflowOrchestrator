'use client';

import React, { useRef } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { ImportIcon, ExportIcon, PlayIcon, PauseIcon, RestartIcon, SaveIcon, GifIcon, LayoutTreeIcon, LayoutHorizontalIcon } from './Icons';

export default function Toolbar() {
  const { 
    exportWorkflow, 
    importWorkflow, 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    areEdgesAnimated, 
    toggleEdgeAnimation,
    applyLayout,
  } = useWorkflowStore(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleAnimation = () => {
    toggleEdgeAnimation();
  };

  const handleRestart = () => {
    console.log('Restarting workflow');
    setNodes([
      {
        id: 'startNode_reset_1', // Ensure unique ID on reset
        type: 'start',
        data: { id: 'startNode_reset_1', label: 'Start' },
        position: { x: 250, y: 5 },
        width: 180,
        height: 60,
      },
    ]);
    setEdges([]);
    // Optionally, reset animation state if desired
    // if (areEdgesAnimated) {
    //   toggleEdgeAnimation();
    // }
  };

  const handleSave = () => {
    console.log('Save workflow:', { nodes, edges });
    alert('Workflow state logged to console. Implement actual save logic here.');
  };

  const handleExportGif = () => {
    // Placeholder for GIF export functionality
    console.log('Export to GIF clicked');
    alert('Export to GIF functionality not yet implemented.');
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
          // Validate basic structure, importWorkflow in store does more detailed checks
          if (importedData && typeof importedData === 'object' && importedData.nodes && importedData.edges) {
            importWorkflow(importedData, 'TB'); // Default to TB layout on import, or make it selectable
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
  const buttonHoverStyle = "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"; // Using accent and accent-foreground for hover
  const buttonTextStyle = "text-[var(--foreground)]"; // Changed from --node-color to --foreground for better theme adaptability
  const buttonBorderStyle = "border border-[var(--border-color)]"; // Using CSS variable for border

  return (
    <nav className="flex items-center gap-2 p-2 bg-[var(--toolbar-bg)] rounded-lg shadow-md">
      <button 
        onClick={handleToggleAnimation} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }} // Using secondary for button background
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
        title="Save Workflow (Placeholder)"
      >
        <SaveIcon className="w-5 h-5" />
        <span>Save</span>
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
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--secondary)' }}
        title="Export Workflow as GIF (Placeholder)"
      >
        <GifIcon className="w-5 h-5" />
        <span>Export GIF</span>
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
