"use client";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useState } from 'react'; 
import { MenuIcon, XIcon } from './components/Icons'; // Corrected path to components/Icons

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-3 shadow-lg bg-opacity-80 backdrop-blur-md border-b border-[var(--accent-color)]" style={{ backgroundColor: 'var(--node-bg)', color: 'var(--node-color)' }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Workflow Orchestrator</h1>
        </div>
        <div className="flex items-center gap-4">
          <Toolbar />
          <ThemeSwitcher />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-1" style={{ backgroundColor: 'var(--background)' }}>
          <WorkflowCanvas />
        </main>
      </div>
    </div>
  );
}
