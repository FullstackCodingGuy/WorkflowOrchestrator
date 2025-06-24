# Sidebar Panels Components

This folder contains all sidebar panel components for the workflow diagram editor. The components are organized to provide a clean separation of concerns for different sidebar functionalities.

## Component Structure

```
SidebarPanels/
├── index.ts                    # Main exports for clean imports
├── SidePanel.tsx              # Generic sidebar container component
├── TemplateLibraryPanel.tsx   # Template library with workflow examples
├── ExplorerPanelContent.tsx   # Node explorer and outline panels
└── README.md                  # This documentation
```

## Components

### 1. SidePanel.tsx
**Purpose**: Generic sidebar container that can be used for both left and right panels.

**Features**:
- Collapsible sections with expand/collapse functionality
- Smooth animations and transitions
- Scroll-to-top functionality for long content
- Configurable width and positioning (left/right)
- Section-based organization with icons and titles

**Usage**:
```tsx
import { SidePanel, PanelSection } from './SidebarPanels';

const sections: PanelSection[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    icon: '📁',
    content: <ExplorerPanel />,
    defaultOpen: true
  }
];

<SidePanel
  side="left"
  isOpen={isLeftPanelOpen}
  onToggle={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
  sections={sections}
  width={280}
/>
```

### 2. TemplateLibraryPanel.tsx
**Purpose**: Displays workflow templates in a categorized, searchable format.

**Features**:
- Template categorization (Business, Approval, Data Processing, etc.)
- Hover popovers with template details
- Smart positioning to prevent overflow
- One-click template loading
- Template statistics (node/edge counts)

**Usage**:
```tsx
import { TemplateLibraryPanel } from './SidebarPanels';

<TemplateLibraryPanel 
  onLoadExample={(template) => loadWorkflowTemplate(template)}
/>
```

### 3. ExplorerPanelContent.tsx
**Purpose**: Node explorer, outline view, and file explorer functionality.

**Features**:
- Node list with selection and deletion
- Outline view for workflow structure
- File explorer for project files
- Add node functionality
- Visual selection indicators

**Components Exported**:
- `ExplorerPanel`: Main node explorer
- `OutlinePanel`: Workflow outline view  
- `FileExplorer`: File system explorer

## Import Usage

### Clean Imports
```tsx
// Import all sidebar components from the main index
import { 
  SidePanel, 
  PanelSection, 
  TemplateLibraryPanel, 
  ExplorerPanel 
} from './SidebarPanels';
```

### Individual Imports
```tsx
// Import specific components if needed
import { SidePanel } from './SidebarPanels/SidePanel';
import { TemplateLibraryPanel } from './SidebarPanels/TemplateLibraryPanel';
```

## Integration with DiagramEditor

The sidebar panels are integrated into the main DiagramEditor component:

```tsx
// Left panel sections
const leftPanelSections: PanelSection[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    icon: '📁',
    content: <ExplorerPanel nodes={nodes} ... />,
    defaultOpen: true
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: '📋',
    content: <TemplateLibraryPanel onLoadExample={loadExample} />,
    defaultOpen: false
  }
];
```

## Styling

Each component uses Tailwind CSS classes for styling and maintains consistency with the overall application design. The components are responsive and work well in different screen sizes.

## Dependencies

- React (hooks: useState, useRef, useEffect)
- Tailwind CSS for styling
- ReactFlow for diagram integration
- Custom Icons component for consistent iconography
