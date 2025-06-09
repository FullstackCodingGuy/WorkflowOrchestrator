import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow'; // Import Handle and Position

// Update props to use NodeProps and extract necessary data
const ConditionNode: React.FC<NodeProps> = ({ id, data, xPos, yPos }) => {
  // const position = data.position || { x: xPos, y: yPos };

  return (
    <div style={{
      padding: '15px',
      border: '1px solid #FFC107', // Border color matching background
      // borderRadius: '0', // Diamond shape is harder with pure CSS
      background: '#FFC107', // Amber color for condition
      color: 'black',
      cursor: 'move',
      textAlign: 'center',
      width: '120px', // Adjust as needed
      height: '80px', // Adjust as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {data.label || 'Condition'}
      <Handle
        type="target"
        position={Position.Top}
        id="condition-target"
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="condition-source-true" // Example for a 'true' path
        style={{ background: '#555', bottom: -5, left: '30%' }} // Adjust positioning
      />
      {/* You could add another source handle for a 'false' path
      <Handle
        type="source"
        position={Position.Bottom}
        id="condition-source-false"
        style={{ background: '#555', bottom: -5, left: '70%' }}
      />
      */}
    </div>
  );
};

export default ConditionNode;
