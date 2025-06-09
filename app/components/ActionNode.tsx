import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow'; // Import Handle and Position

// Update props to use NodeProps and extract necessary data
const ActionNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };
  // const type = data.type || 'Action';
  // const properties = data.properties || {};

  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #2196F3', // Border color matching background
      borderRadius: '8px',
      background: '#2196F3', // Blue color for action
      color: 'white',
      cursor: 'move',
      textAlign: 'center',
    }}>
      <div><strong>{data.label || 'Action'}</strong></div>
      <Handle
        type="target"
        position={Position.Top}
        id="action-target"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="action-source"
        style={{ background: '#555' }}
      />
      {/* Display other properties from data as needed */}
      {/* {Object.entries(properties).map(([key, value]) => (
        <div key={key}>{key}: {String(value)}</div>
      ))} */}
    </div>
  );
};

export default ActionNode;
