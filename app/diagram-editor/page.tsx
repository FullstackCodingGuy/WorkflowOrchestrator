'use client';

import dynamic from 'next/dynamic';

// Dynamically import DiagramEditor to prevent SSR issues with ReactFlow
const DiagramEditor = dynamic(() => import('../components/DiagramEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading Workflow Editor...</p>
      </div>
    </div>
  ),
});

export default function DiagramEditorPage() {
  return (
    <div className="h-screen">
      <DiagramEditor />
    </div>
  );
}
