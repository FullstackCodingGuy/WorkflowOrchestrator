import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow'; // Import Handle and Position

// Update props to use NodeProps and extract necessary data
const EndNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };
  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #F44336', // Border color matching background
      borderRadius: '8px',
      background: '#F44336', // Red color for end
      color: 'white',
      cursor: 'move',
      textAlign: 'center',
    }}>
      {data.label || 'End'}
      <Handle
        type="target"
        position={Position.Top}
        id="end-target"
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default EndNode;
