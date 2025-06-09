'use client';

import React from 'react';

export default function Toolbar() {
  // TODO: Implement start, pause, restart functionality
  const onStart = () => console.log('Start animation');
  const onPause = () => console.log('Pause animation');
  const onRestart = () => console.log('Restart animation');

  return (
    <nav className="flex items-center gap-2">
      <button onClick={onStart} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Start
      </button>
      <button onClick={onPause} className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
        Pause
      </button>
      <button onClick={onRestart} className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
        Restart
      </button>
    </nav>
  );
}
