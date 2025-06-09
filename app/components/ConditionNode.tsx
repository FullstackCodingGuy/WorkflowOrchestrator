import React from 'react';
import { NodeProps } from 'reactflow'; // Import NodeProps

// Update props to use NodeProps and extract necessary data
const ConditionNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };

  return (
    <div style={{
      padding: '15px',
      border: '1px solid #ccc',
      // borderRadius: '0', // Diamond shape is harder with pure CSS
      background: '#FFC107', // Amber color for condition
      color: 'black',
      // position: 'absolute',
      // left: position.x,
      // top: position.y,
      cursor: 'move',
      textAlign: 'center',
      width: '120px', // Adjust as needed
      height: '80px', // Adjust as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {data.label || 'Condition'}
    </div>
  );
};

export default ConditionNode;
