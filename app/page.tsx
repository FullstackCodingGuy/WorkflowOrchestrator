import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";
import ThemeSwitcher from "./components/ThemeSwitcher"; // Import ThemeSwitcher

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-2 border-b border-gray-700 shadow-md">
        <h1 className="text-xl font-semibold">Workflow Orchestrator</h1>
        <div className="flex items-center gap-4">
          <Toolbar />
          <ThemeSwitcher />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <WorkflowCanvas />
        </main>
        {/* PropertiesPanel is rendered inside WorkflowCanvas */}
      </div>
    </div>
  );
}
