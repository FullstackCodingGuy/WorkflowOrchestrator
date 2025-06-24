"use client";
import dynamic from 'next/dynamic';

// Dynamically import ReactFlowProvider and DiagramEditorPage to prevent SSR issues
const ReactFlowProvider = dynamic(
  () => import('reactflow').then((mod) => ({ default: mod.ReactFlowProvider })),
  { ssr: false }
);

const DiagramEditorPage = dynamic(() => import("./diagram-editor/page"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading Workflow Orchestrator...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <ReactFlowProvider>
      <DiagramEditorPage />
    </ReactFlowProvider>
  );
}
