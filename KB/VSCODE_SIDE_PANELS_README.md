# VSCode-like Side Panels Implementation

A comprehensive implementation of VSCode-style collapsible side panels for both left and right sides of the diagram editor, featuring accordion sections and responsive design.

## 🎯 **Core Features**

### **Visual Design**
- **VSCode-inspired UI** - Clean, professional interface matching VSCode aesthetics
- **Collapsible Panels** - Smooth slide-in/out animations from both sides
- **Accordion Sections** - Expandable/collapsible content sections within panels
- **Responsive Design** - Mobile-friendly with overlay behavior on small screens
- **Custom Scrollbars** - Styled scrollbars matching the overall design

### **Functionality**
- **Dual-side Support** - Independent left and right panels
- **Toggle Buttons** - Floating toggle buttons when panels are closed
- **State Management** - Individual section expand/collapse states
- **Keyboard Shortcuts** - Integration with existing keyboard navigation
- **Performance Optimized** - Smooth animations without layout shifts

## 🏗️ **Architecture**

### **Component Structure**

```
DiagramEditor
├── SidePanel (Left)
│   ├── Explorer Section
│   ├── Outline Section  
│   └── Files Section
├── SidePanel (Right)
│   ├── Properties Section
│   ├── Settings Section
│   └── Diagram Stats Section
├── PanelToggleButton (Left)
└── PanelToggleButton (Right)
```

### **Key Components**

#### **1. SidePanel.tsx**
Main panel container with accordion functionality:
- **Fixed positioning** for overlay behavior
- **Smooth transitions** for show/hide animations
- **Header controls** (collapse all, expand all, close)
- **Scrollable content** with custom scrollbar styling
- **Mobile overlay** with backdrop click to close

#### **2. PanelContent.tsx** 
Left panel content components:
- **ExplorerPanel** - Node tree view with CRUD operations
- **OutlinePanel** - Hierarchical diagram overview
- **FileExplorer** - File management and recent files

#### **3. RightPanelContent.tsx**
Right panel content components:
- **PropertiesContent** - Node property editor
- **SettingsContent** - Global diagram settings
- **DiagramStatsContent** - Statistics and performance tips

## 📱 **Responsive Behavior**

### **Desktop (≥1024px)**
- Panels slide in from sides
- Canvas automatically adjusts margins
- Both panels can be open simultaneously

### **Tablet (768px - 1023px)**  
- Panels overlay the canvas
- Backdrop overlay for focus management
- One panel open at a time recommended

### **Mobile (<768px)**
- Full overlay behavior
- Touch-friendly interactions
- Swipe gestures for panel control

## 🎨 **Styling System**

### **CSS Custom Properties**
```css
/* Panel-specific variables */
--panel-bg: #f9fafb;
--panel-border: #e5e7eb;
--panel-header-bg: #f3f4f6;
--panel-scrollbar-thumb: #cbd5e1;
```

### **Animation Classes**
```css
.panel-slide-in-left { /* Slide from left */ }
.panel-slide-in-right { /* Slide from right */ }
.accordion-content { /* Smooth accordion transitions */ }
.panel-scrollbar { /* Custom scrollbar styling */ }
```

### **Tailwind Integration**
- Consistent spacing with Tailwind scale
- Responsive breakpoints alignment
- Color palette integration
- Typography scaling

## ⚙️ **Configuration**

### **Panel Sections Configuration**
```typescript
const leftPanelSections: PanelSection[] = [
  {
    id: 'explorer',
    title: 'Explorer',
    icon: '📁',
    defaultOpen: true,
    content: <ExplorerPanel {...props} />
  },
  // ... more sections
];
```

### **Panel Properties**
```typescript
interface SidePanelProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  sections: PanelSection[];
  width?: number; // Default: 280px
  className?: string;
}
```

### **Section Properties**
```typescript
interface PanelSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}
```

## 🔧 **Integration Guide**

### **1. State Management**
```typescript
const [leftPanelOpen, setLeftPanelOpen] = useState(false);
const [rightPanelOpen, setRightPanelOpen] = useState(false);
```

### **2. Canvas Margin Adjustment**
```typescript
className={`flex-1 transition-all duration-300 ${
  leftPanelOpen ? 'ml-80' : 'ml-0'
} ${
  rightPanelOpen ? 'mr-80' : 'mr-0'
}`}
```

### **3. Panel Integration**
```typescript
<SidePanel
  side="left"
  isOpen={leftPanelOpen}
  onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
  sections={leftPanelSections}
  width={280}
/>
```

## 🎮 **User Interactions**

### **Panel Control**
- **Toggle Buttons** - Click floating buttons to open panels
- **Header Close** - X button in panel header to close
- **Accordion Headers** - Click section headers to expand/collapse
- **Collapse All/Expand All** - Bulk operations in panel header

### **Content Interactions**
- **Node Selection** - Click nodes in explorer to select in canvas
- **Property Editing** - Real-time property updates in right panel
- **File Operations** - Save/load/clear actions in file explorer
- **Settings Changes** - Instant application of setting changes

### **Mobile Interactions**
- **Backdrop Click** - Close panel by clicking outside
- **Swipe Gestures** - Swipe to close panels (future enhancement)
- **Touch Scrolling** - Smooth touch scrolling in panel content

## 📊 **Performance Considerations**

### **Optimization Strategies**
- **Memoized Components** - Prevent unnecessary re-renders
- **Lazy Content Loading** - Content renders only when sections expand
- **Efficient State Updates** - Minimal state changes for smooth animations
- **CSS Transforms** - Hardware-accelerated animations

### **Memory Management**
- **Component Cleanup** - Proper cleanup of event listeners
- **State Normalization** - Efficient state structure
- **Render Optimization** - Conditional rendering based on visibility

## ✨ **Advanced Features**

### **Accessibility**
- **Keyboard Navigation** - Full keyboard control support
- **Screen Reader** - ARIA labels and descriptions
- **Focus Management** - Proper focus handling during transitions
- **High Contrast** - Support for high contrast modes

### **Customization**
- **Theming Support** - CSS custom properties for easy theming
- **Panel Width** - Configurable panel widths
- **Section Ordering** - Dynamic section reordering
- **Custom Icons** - Support for custom section icons

### **Future Enhancements**
- [ ] **Drag & Drop** - Reorder sections within panels
- [ ] **Resizable Panels** - User-adjustable panel widths
- [ ] **Panel Docking** - Detach panels to separate windows
- [ ] **Search** - Global search across all panel content
- [ ] **Mini Mode** - Collapsed panel with icons only
- [ ] **Panel Memory** - Remember panel states across sessions

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Panel not sliding smoothly** - Check CSS transitions and transform properties
2. **Content overflow** - Verify scrollbar implementation and max-height settings
3. **Mobile overlay issues** - Ensure z-index layering and backdrop functionality
4. **State synchronization** - Check state management between panels and canvas

### **Performance Issues**
1. **Slow animations** - Reduce animation duration or use CSS transforms
2. **Memory leaks** - Verify proper cleanup of event listeners
3. **Render thrashing** - Implement proper memoization and conditional rendering

This VSCode-like side panel system provides a professional, feature-rich interface that enhances the diagram editor's usability while maintaining excellent performance and accessibility standards.
