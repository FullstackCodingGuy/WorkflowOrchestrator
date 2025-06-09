'use client'; // Ensure this is a client component

import React, { useState, useEffect } from 'react';
import useWorkflowStore from '../store/workflowStore'; // Removed NodeData import
import { useShallow } from 'zustand/shallow';

// Define a more specific type for the data we expect and want to edit
interface EditableNodeData {
  label?: string;
  fontColor?: string;
  backgroundColor?: string;
  // Add other specific editable properties here
  // [key: string]: any; // Allow other properties - Removed for better type safety
}

export default function PropertiesPanel() {
  const { selectedNodeId, nodes, updateNodeData, setSelectedNodeId: deselectNode } = useWorkflowStore(
    useShallow(state => ({
      selectedNodeId: state.selectedNodeId,
      nodes: state.nodes,
      updateNodeData: state.updateNodeData,
      setSelectedNodeId: state.setSelectedNodeId, // Fetch setSelectedNodeId for deselecting
    }))
  );

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  const [formData, setFormData] = useState<EditableNodeData>({});

  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        // Initialize formData with values from node.data if they exist,
        // otherwise, use the desired defaults for the panel inputs.
        setFormData({
          label: node.data.label || '',
          fontColor: node.data.fontColor || '#000000', // Default for panel input if not set
          backgroundColor: node.data.backgroundColor || '#f5f5f5', // Default to whitesmoke for panel input if not set
        });
      }
    } else {
      setFormData({});
    }
  }, [selectedNodeId, nodes]); // formData is intentionally not a dependency to avoid loops with its own setters

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-[var(--sidebar-bg)] p-4 border-l border-[var(--border-color)] text-[var(--foreground)]">
        <h3 className="text-lg font-semibold mb-4 text-[var(--foreground)]">Properties</h3>
        <p className="text-sm text-[var(--muted-foreground)]">Select a node to view and edit its properties.</p>
      </aside>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Update immediately for color pickers
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, { [name]: value });
    }
  };
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (selectedNodeId) {
      // Avoid updating if the value hasn't actually changed for text inputs
      if (selectedNode.data[name as keyof Omit<EditableNodeData, 'id'>] !== value) {
         updateNodeData(selectedNodeId, { [name]: value });
      }
    }
  };


  // Common input styling
  const inputClassName = "w-full p-2 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition-colors";
  const labelClassName = "block text-sm font-medium mb-1 text-[var(--muted-foreground)]";

  return (
    <aside className="w-80 bg-[var(--sidebar-bg)] p-6 border-l border-[var(--border-color)] text-[var(--foreground)] shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Edit Node</h3>
        <button 
          onClick={() => deselectNode(null)} // Use the fetched setSelectedNodeId (aliased as deselectNode)
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          title="Close Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div>
        <label htmlFor="nodeId" className={labelClassName}>ID (Name):</label>
        <input 
          type="text" 
          id="nodeId" 
          value={selectedNode.id} 
          readOnly 
          disabled 
          className={`${inputClassName} opacity-70 cursor-not-allowed`}
        />
      </div>
      <div>
        <label htmlFor="nodeType" className={labelClassName}>Type:</label>
        <input 
          type="text" 
          id="nodeType" 
          value={selectedNode.type || 'N/A'} 
          readOnly 
          disabled 
          className={`${inputClassName} opacity-70 cursor-not-allowed`}
        />
      </div>
      <div>
        <label htmlFor="label" className={labelClassName}>Label (Display):</label>
        <input
          type="text"
          id="label"
          name="label"
          value={formData.label || ''}
          onChange={handleInputChange}
          onBlur={handleBlur} // Update on blur to avoid too many re-renders
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="fontColor" className={labelClassName}>Font Color:</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            id="fontColor"
            name="fontColor"
            value={formData.fontColor || '#000000'}
            onChange={handleColorChange} // Update immediately
            className="w-8 h-8 p-0 border-none rounded cursor-pointer"
          />
          <input
            type="text"
            name="fontColor"
            value={formData.fontColor || '#000000'}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${inputClassName} flex-grow`}
            placeholder="#000000"
          />
        </div>
      </div>
      <div>
        <label htmlFor="backgroundColor" className={labelClassName}>Background Color:</label>
         <div className="flex items-center gap-2">
          <input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={formData.backgroundColor || '#ffffff'}
            onChange={handleColorChange} // Update immediately
            className="w-8 h-8 p-0 border-none rounded cursor-pointer"
          />
          <input
            type="text"
            name="backgroundColor"
            value={formData.backgroundColor || '#ffffff'}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${inputClassName} flex-grow`}
            placeholder="#ffffff"
          />
        </div>
      </div>

      {/* Future: Add more specific fields based on node type if needed */}
      {/* Example:
      {selectedNode.type === 'condition' && (
        <div>
          <label htmlFor="conditionExpression" className={labelClassName}>Condition Expression:</label>
          <textarea
            id="conditionExpression"
            name="conditionExpression" // Ensure this matches a key in EditableNodeData if used
            value={formData.conditionExpression || ''}
            onChange={(e) => setFormData(prev => ({...prev, conditionExpression: e.target.value}))}
            onBlur={(e) => selectedNodeId && updateNodeData(selectedNodeId, { conditionExpression: e.target.value })}
            className={`${inputClassName} h-24`}
          />
        </div>
      )}
      */}
    </aside>
  );
};
