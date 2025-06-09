'use client'; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import useWorkflowStore from '../store/workflowStore';
import { Node } from 'reactflow';

// Define a more specific type for the data we expect and want to edit
interface EditableNodeData {
  label?: string;
  fontColor?: string;
  backgroundColor?: string;
  // Add other specific editable properties here
  [key: string]: any; // Allow other properties
}

const PropertiesPanel: React.FC = () => {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const nodes = useWorkflowStore((state) => state.nodes);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId); // To clear selection

  const [selectedNode, setSelectedNode] = useState<Node<EditableNodeData> | null>(null);
  const [formData, setFormData] = useState<EditableNodeData>({});

  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId) as Node<EditableNodeData> | undefined;
      setSelectedNode(node || null);
      if (node) {
        setFormData({
          label: node.data.label || '',
          fontColor: node.data.fontColor || '#000000', // Default to black
          backgroundColor: node.data.backgroundColor || '#ffffff', // Default to white
          // Initialize other properties from node.data if they exist
        });
      }
    } else {
      setSelectedNode(null);
      setFormData({});
    }
  }, [selectedNodeId, nodes]);

  if (!selectedNode) {
    return (
      <aside 
        className="w-72 p-4 border-l border-[var(--border-color)] bg-[var(--sidebar-bg)] text-[var(--foreground)] h-full overflow-y-auto"
      >
        <p className="text-sm text-[var(--muted-foreground)]">Select a node to see its properties.</p>
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
      if (selectedNode.data[name as keyof EditableNodeData] !== value) {
         updateNodeData(selectedNodeId, { [name]: value });
      }
    }
  };


  // Common input styling
  const inputClassName = "w-full p-2 rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-colors";
  const labelClassName = "block text-sm font-medium mb-1 text-[var(--muted-foreground)]";

  return (
    <aside 
      className="w-72 p-4 border-l border-[var(--border-color)] bg-[var(--sidebar-bg)] text-[var(--foreground)] h-full overflow-y-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Properties</h3>
        <button 
          onClick={() => setSelectedNodeId(null)} 
          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          title="Deselect Node"
        >
          Close
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

export default PropertiesPanel;
