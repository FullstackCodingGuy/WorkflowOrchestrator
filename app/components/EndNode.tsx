import React from 'react';
import { NodeProps } from 'reactflow'; // Import NodeProps

// Update props to use NodeProps and extract necessary data
const EndNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };
  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#F44336', // Red color for end
      color: 'white',
      // position: 'absolute',
      // left: position.x,
      // top: position.y,
      cursor: 'move',
    }}>
      {data.label || 'End'}
    </div>
  );
};

export default EndNode;
