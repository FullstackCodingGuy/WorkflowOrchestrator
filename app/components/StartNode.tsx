import React from 'react';
import { NodeProps } from 'reactflow'; // Import NodeProps

// Update props to use NodeProps and extract necessary data
const StartNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // position is now available as xPos and yPos directly from NodeProps if using React Flow v11+
  // For older versions or if passing position via data:
  // const position = data.position || { x: xPos, y: yPos }; 

  return (
    <div style={{
      padding: '10px 20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: '#4CAF50', // Green color for start
      color: 'white',
      // position: 'absolute', // React Flow handles positioning
      // left: position.x,
      // top: position.y,
      cursor: 'move',
    }}>
      {data.label || 'Start'} {/* Display label from data */}
    </div>
  );
};

export default StartNode;
