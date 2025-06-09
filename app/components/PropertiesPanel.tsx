import React from 'react';
import { Node } from 'reactflow'; // Import Node type

interface PropertiesPanelProps {
  selectedNode: Node | null; // Use Node type from React Flow
  onUpdateNode: (updatedNode: Node) => void; // Callback to update node properties
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <aside style={{ width: '250px', padding: '10px', borderLeft: '1px solid #eee', height: '100%' }}>
        <p>Select a node to see its properties.</p>
      </aside>
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'label') {
      onUpdateNode({ ...selectedNode, data: { ...selectedNode.data, label: value } });
    } else {
      // Handle other properties if they are directly on the node or in node.data.properties
      const currentProperties = selectedNode.data.properties || {};
      onUpdateNode({
        ...selectedNode,
        data: {
          ...selectedNode.data,
          properties: { ...currentProperties, [name]: value },
        },
      });
    }
  };

  return (
    <aside style={{ width: '250px', padding: '10px', borderLeft: '1px solid #eee', height: '100%', overflowY: 'auto' }}>
      <h3>Properties</h3>
      <div>
        <label htmlFor="nodeId">ID: </label>
        <input type="text" id="nodeId" value={selectedNode.id} readOnly disabled />
      </div>
      <div>
        <label htmlFor="nodeType">Type: </label>
        <input type="text" id="nodeType" value={selectedNode.type} readOnly disabled />
      </div>
      <div>
        <label htmlFor="nodeLabel">Label: </label>
        <input
          type="text"
          id="nodeLabel"
          name="label" // Add name attribute for handler
          value={selectedNode.data.label || ''}
          onChange={handleInputChange}
        />
      </div>

      {/* Editable fields for custom properties stored in data.properties */}
      <h4>Custom Properties:</h4>
      {selectedNode.data.properties && Object.entries(selectedNode.data.properties).map(([key, value]) => (
        <div key={key}>
          <label htmlFor={`prop-${key}`}>{key}: </label>
          <input
            type="text"
            id={`prop-${key}`}
            name={key} // Add name attribute for handler
            value={String(value)}
            onChange={handleInputChange}
          />
        </div>
      ))}
      {!selectedNode.data.properties || Object.keys(selectedNode.data.properties).length === 0 && (
        <p>No custom properties for this node.</p>
      )}

      {/* Add more specific fields based on node type if needed */}
      {/* For example:
      {selectedNode.type === 'action' && (
        <div>
          <label htmlFor="actionType">Action Type: </label>
          <input type="text" id="actionType" name="actionType" value={selectedNode.data.actionType || ''} onChange={handleInputChange} />
        </div>
      )}
      */}
    </aside>
  );
};

export default PropertiesPanel;
