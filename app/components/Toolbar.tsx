'use client';

import React, { useRef } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { ImportIcon, ExportIcon, PlayIcon, PauseIcon, RestartIcon, SaveIcon, GifIcon } from './Icons'; // Import GifIcon

export default function Toolbar() {
  const { exportWorkflow, importWorkflow, nodes, edges, setNodes, setEdges } = useWorkflowStore(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onStart = () => console.log('Start animation'); 
  const onPause = () => console.log('Pause animation'); 
  const onRestart = () => console.log('Restart animation'); 

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
          if (Array.isArray(importedData.nodes) && Array.isArray(importedData.edges)) {
            importWorkflow(importedData);
          } else {
            alert('Invalid workflow file format.');
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
  const buttonHoverStyle = "hover:bg-[var(--accent-color)] hover:text-[var(--background)]";
  const buttonTextStyle = "text-[var(--node-color)]"; 
  const buttonBorderStyle = "border border-slate-400";

  return (
    <nav className="flex items-center gap-2">
      <button 
        onClick={onStart} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Start Workflow"
      >
        <PlayIcon className="w-5 h-5" />
        <span>Start</span>
      </button>
      <button 
        onClick={onPause} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Pause Workflow"
      >
        <PauseIcon className="w-5 h-5" />
        <span>Pause</span>
      </button>
      <button 
        onClick={onRestart} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Restart Workflow"
      >
        <RestartIcon className="w-5 h-5" />
        <span>Restart</span>
      </button>
      <button 
        onClick={handleSave} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Save Workflow"
      >
        <SaveIcon className="w-5 h-5" />
        <span>Save</span>
      </button>
      <button 
        onClick={handleExport} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Export Workflow as JSON"
      >
        <ExportIcon className="w-5 h-5" />
        <span>Export JSON</span>
      </button>
      <button 
        onClick={handleExportGif} 
        className={`${buttonBaseStyle} ${buttonTextStyle} ${buttonBorderStyle} ${buttonHoverStyle}`}
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Export Workflow as GIF"
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
        style={{ backgroundColor: 'var(--node-bg)'}}
        title="Import Workflow from JSON"
      >
        <ImportIcon className="w-5 h-5" />
        <span>Import</span>
      </button>
    </nav>
  );
}
