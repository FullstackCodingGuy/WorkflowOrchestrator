# Custom Diagram Editor

A comprehensive diagram editor built from scratch using ReactFlow, featuring animated edges, custom nodes, and an intuitive property panel.

## Features

### 🎨 Visual Elements
- **Custom Nodes**: Beautiful, customizable nodes with icons, colors, and descriptions
- **Animated Edges**: SVG-based animated connections with flowing dots and gradients
- **Property Panel**: Comprehensive properties editor for nodes
- **Interactive Toolbar**: Full-featured toolbar with multiple background options

### ⚡ Core Functionality
- **Drag & Drop**: Intuitive node positioning
- **Connection System**: Easy node-to-node connections
- **Real-time Editing**: Live property updates
- **Save/Load**: Persistent storage using localStorage
- **Keyboard Shortcuts**: Professional keyboard navigation

### 🎯 Advanced Features
- **Animation Control**: Toggle edge animations on/off  
- **Background Variants**: Dots, Lines, and Cross patterns
- **Auto-fit View**: Smart viewport management
- **Multi-selection**: Support for selecting and editing multiple elements
- **Custom Properties**: Add unlimited custom properties to nodes

## Components Overview

### DiagramEditor.tsx (Main Component)
The primary editor component that orchestrates all functionality:
- State management for nodes and edges
- Event handling for user interactions
- Keyboard shortcuts implementation
- Save/load functionality

### CustomNode.tsx
A highly customizable node component featuring:
- Dynamic styling based on properties
- Icon and color customization
- Connection handles (input/output)
- Selection indicators
- Hover effects

### AnimatedSVGEdge.tsx
Advanced edge component with:
- SVG-based animations
- Flowing gradient effects
- Animated dots along the path
- Customizable colors and labels
- Smooth path rendering

### DiagramToolbar.tsx
Comprehensive toolbar providing:
- Node creation and deletion
- View controls (fit, zoom)
- Background pattern selection
- Animation toggles
- Save/load operations
- Properties panel toggle

### NodePropertiesPanel.tsx
Rich properties editor offering:
- Basic property editing (label, description, color, icon)
- Custom property management
- Color palette selection
- Icon library
- Real-time updates

## Usage

### Basic Usage
```typescript
import DiagramEditor from './components/DiagramEditor';

function App() {
  return (
    <div className="h-screen">
      <DiagramEditor />
    </div>
  );
}
```

### Keyboard Shortcuts
- `Ctrl/Cmd + N`: Add new node
- `Ctrl/Cmd + S`: Save diagram
- `Ctrl/Cmd + O`: Load diagram  
- `Ctrl/Cmd + F`: Fit view to content
- `Delete`: Delete selected node
- `Escape`: Deselect all

### Customization Options

#### Node Properties
```typescript
interface DiagramNodeData {
  label: string;           // Display name
  description?: string;    // Optional description
  color?: string;         // Border and accent color
  icon?: string;          // Icon or emoji
  properties?: Record<string, any>; // Custom properties
}
```

#### Edge Properties  
```typescript
interface DiagramEdgeData {
  label?: string;         // Edge label
  animated?: boolean;     // Animation state
  color?: string;        // Edge color
  strokeWidth?: number;  // Line thickness
}
```

## Styling

The editor uses Tailwind CSS for styling with:
- Responsive design principles
- Consistent color palette
- Smooth transitions and animations
- Professional UI components

### Color Palette
- Primary: Blue (`#3b82f6`)
- Success: Green (`#4ade80`) 
- Warning: Orange (`#f59e0b`)
- Danger: Red (`#ef4444`)
- Secondary: Gray (`#64748b`)

## Architecture

### State Management
- Uses ReactFlow's built-in hooks (`useNodesState`, `useEdgesState`)
- Local state for UI controls (panels, selections)
- localStorage for persistence

### Event Flow
1. User interaction triggers event handlers
2. State updates through React hooks
3. ReactFlow handles rendering and layout
4. Custom components respond to state changes

### Type Safety
Comprehensive TypeScript definitions ensure:
- Type-safe property access
- Compile-time error checking
- IntelliSense support
- Robust refactoring capabilities

## Performance Considerations

- **Memoized Components**: Prevents unnecessary re-renders
- **Efficient State Updates**: Minimizes React reconciliation
- **SVG Animations**: Hardware-accelerated graphics
- **Lazy Loading**: Components load only when needed

## Browser Compatibility

Tested and supported on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technical Requirements

- React 18+
- ReactFlow 11+
- TypeScript 4.5+
- Tailwind CSS 3+

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **High Contrast**: Configurable color themes
- **Focus Management**: Proper focus handling

## Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Node grouping and layers
- [ ] Export to various formats (PNG, SVG, PDF)
- [ ] Collaborative editing
- [ ] Plugin architecture
- [ ] Advanced layout algorithms
- [ ] Theme customization
- [ ] Multi-language support

## Contributing

The diagram editor is built with extensibility in mind. Key areas for contribution:

1. **Custom Node Types**: Add specialized node components
2. **Edge Variations**: Create new edge styles and animations  
3. **Layout Algorithms**: Implement auto-layout features
4. **Export Formats**: Add new export capabilities
5. **Themes**: Design new visual themes

## License

This project is part of the WorkflowOrchestrator and follows the same licensing terms.
