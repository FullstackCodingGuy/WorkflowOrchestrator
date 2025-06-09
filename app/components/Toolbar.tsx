'use client';

import React, { useRef } from 'react';
import useWorkflowStore from '../store/workflowStore';

export default function Toolbar() {
  const { exportWorkflow, importWorkflow } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onStart = () => console.log('Start animation');
  const onPause = () => console.log('Pause animation');
  const onRestart = () => console.log('Restart animation');

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

  return (
    <nav className="flex items-center gap-2">
      <button 
        onClick={onStart} 
        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Start
      </button>
      <button onClick={onPause} className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
        Pause
      </button>
      <button onClick={onRestart} className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
        Restart
      </button>
      <button 
        onClick={handleExport} 
        className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Export JSON
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
        className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Import JSON
      </button>
    </nav>
  );
}
