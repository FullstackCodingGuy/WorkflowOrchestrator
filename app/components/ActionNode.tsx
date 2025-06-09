import React from 'react';
import { NodeProps } from 'reactflow'; // Import NodeProps

// Update props to use NodeProps and extract necessary data
const ActionNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };
  // const type = data.type || 'Action';
  // const properties = data.properties || {};

  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#2196F3', // Blue color for action
      color: 'white',
      // position: 'absolute',
      // left: position.x,
      // top: position.y,
      cursor: 'move',
    }}>
      <div><strong>{data.label || 'Action'}</strong></div>
      {/* Display other properties from data as needed */}
      {/* {Object.entries(properties).map(([key, value]) => (
        <div key={key}>{key}: {String(value)}</div>
      ))} */}
    </div>
  );
};

export default ActionNode;
