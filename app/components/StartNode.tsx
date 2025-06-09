import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow'; // Import Handle and Position

// Update props to use NodeProps and extract necessary data
const StartNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };

  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #4CAF50', // Border color matching background
      borderRadius: '8px',
      background: '#4CAF50', // Green color for start
      color: 'white',
      cursor: 'move',
      textAlign: 'center', // Center text
    }}>
      {data.label || 'Start'} {/* Display label from data */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="start-source"
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default StartNode;
