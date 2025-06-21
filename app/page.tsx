"use client";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useState } from 'react'; 
import { MenuIcon, XIcon } from './components/Icons';
import { ReactFlowProvider } from 'reactflow'; // <-- Import ReactFlowProvider
import DiagramEditorPage from "./diagram-editor/page";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ReactFlowProvider> {/* <-- Wrap the entire content with ReactFlowProvider */}
      <DiagramEditorPage />
      
      {/* <div className="flex flex-col h-screen bg-[var(--background)] text-[var(--foreground)]">
        <header 
          className="flex items-center justify-between p-4 shadow-md border-b border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--header-foreground)] sticky top-0 z-50"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-[var(--accent-hover)] hover:text-[var(--accent-foreground)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Toolbar />
            <ThemeSwitcher /> 
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 overflow-auto p-1 bg-[var(--background)]">
            <WorkflowCanvas />
          </main>
        </div>
      </div> */}
    </ReactFlowProvider>
  );
}
