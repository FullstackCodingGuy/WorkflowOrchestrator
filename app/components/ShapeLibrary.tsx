// ShapeLibrary.tsx
import React from 'react';

const shapes = [
  { name: 'Rectangle', icon: '▭' },
  { name: 'Ellipse', icon: '◯' },
  { name: 'Diamond', icon: '◇' },
  { name: 'Arrow', icon: '→' },
  // Add more shapes as needed
];

export const ShapeLibrary: React.FC = () => (
  <div>
    <h3>Shape Library</h3>
    <div style={{ display: 'flex', gap: '1rem' }}>
      {shapes.map(shape => (
        <button key={shape.name} title={shape.name}>
          {shape.icon}
        </button>
      ))}
    </div>
  </div>
);