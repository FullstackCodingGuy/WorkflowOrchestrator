// ImageEmbedder.tsx
import React, { useRef } from 'react';

export const ImageEmbedder: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Image embedding logic will go here
      alert(`Selected image: ${file.name}`);
    }
  };

  return (
    <div>
      <h3>Image Embedder</h3>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
    </div>
  );
};