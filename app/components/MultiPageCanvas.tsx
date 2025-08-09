// MultiPageCanvas.tsx
import React, { useState } from 'react';

export const MultiPageCanvas: React.FC = () => {
  const [pages, setPages] = useState<string[]>(['Page 1']);
  const [activePage, setActivePage] = useState(0);

  return (
    <div>
      <div>
        {pages.map((page, idx) => (
          <button key={page} onClick={() => setActivePage(idx)}>
            {page}
          </button>
        ))}
        <button onClick={() => setPages([...pages, `Page ${pages.length + 1}`])}>
          Add Page
        </button>
      </div>
      <div>
        {/* Render diagram editor for active page */}
        <span>Canvas for {pages[activePage]}</span>
      </div>
    </div>
  );
};