// LayerManager.tsx
import React, { useState } from 'react';

export const LayerManager: React.FC = () => {
  const [layers, setLayers] = useState<string[]>(['Layer 1']);
  const [activeLayer, setActiveLayer] = useState(0);

  return (
    <div>
      <h3>Layer Manager</h3>
      <div>
        {layers.map((layer, idx) => (
          <button key={layer} onClick={() => setActiveLayer(idx)}>
            {layer}
          </button>
        ))}
        <button onClick={() => setLayers([...layers, `Layer ${layers.length + 1}`])}>
          Add Layer
        </button>
      </div>
      <div>
        <span>Active Layer: {layers[activeLayer]}</span>
        {/* Group/Ungroup logic will go here */}
      </div>
    </div>
  );
};