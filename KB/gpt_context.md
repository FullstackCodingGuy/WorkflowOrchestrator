# Workflow Orchestrator - Complete Development Instructions & Context

## 📋 **PROJECT OVERVIEW**

**Project Name**: Workflow Orchestrator  
**Tech Stack**: Next.js 15.1.6, TypeScript, ReactFlow, Tailwind CSS  
**Architecture**: Modern React with hooks, modular components, centralized state management  
**Purpose**: Advanced workflow diagram editor with presentation capabilities  

---

## 🎯 **CORE OBJECTIVES & EXPECTATIONS**

### **Primary Goals:**
1. **Modern UI/UX Design**: Clean, intuitive, professional interface
2. **Workflow Editing**: Full-featured diagram creation and editing
3. **Presentation Mode**: Full-screen presentation capabilities
4. **Code Quality**: Zero errors, clean architecture, maintainable code
5. **User Experience**: Smooth, responsive, accessibility-focused

### **Quality Standards:**
- ✅ **Zero Build Errors**: Every change must compile successfully
- ✅ **Zero ESLint Warnings**: Clean, consistent code style
- ✅ **TypeScript Compliance**: Proper typing throughout
- ✅ **Performance Optimized**: Fast loading and smooth interactions
- ✅ **Responsive Design**: Works on all screen sizes

---

## 🏗️ **ARCHITECTURAL PRINCIPLES**

### **Component Organization:**
```
app/components/
├── PropertyPanel/          # Property editing system
├── SidebarPanels/         # Sidebar organization
├── DiagramEditor.tsx      # Main editor component
├── DiagramToolbar.tsx     # Toolbar with controls
├── PresentationView.tsx   # Full-screen presentation
├── WorkflowNode.tsx       # Custom node components
├── WorkflowEdge.tsx       # Custom edge components
└── reactFlowConfig.ts     # Shared ReactFlow configuration
```

### **Configuration Management:**
- **Centralized Defaults**: All styling defaults in `app/config/appConfig.ts`
- **Template System**: Workflow templates in `workflowTemplates.ts`
- **Shared Configuration**: ReactFlow settings in `reactFlowConfig.ts`

### **State Management:**
- **React Hooks**: useState, useCallback, useEffect for local state
- **Zustand Store**: Global state management in `workflowStore.ts`
- **ReactFlow State**: Built-in node/edge state management

---

## 🎨 **DESIGN SYSTEM & UI REQUIREMENTS**

### **Visual Design Principles:**
1. **Modern & Clean**: Minimal, professional appearance
2. **Consistent Styling**: Unified color scheme and typography
3. **Accessible**: Proper contrast, keyboard navigation
4. **Responsive**: Mobile-first approach
5. **Intuitive**: Clear visual hierarchy and navigation

### **Color Palette:**
- **Background**: Light, subtle tones
- **Primary**: Professional blue tones
- **Secondary**: Muted grays
- **Accent**: Subtle highlights
- **Error/Warning**: Standard semantic colors

### **Component Standards:**
- **Buttons**: Consistent sizing, hover states, disabled states
- **Inputs**: Proper validation, clear labeling
- **Panels**: Smooth animations, proper z-index management
- **Icons**: Consistent style, proper sizing

---

## 🔧 **SPECIFIC FEATURE REQUIREMENTS**

### **1. Property Panel System**
#### **Architecture:**
- **Modular Design**: Separate components for different property types
- **Tab System**: Properties and Style tabs
- **Dynamic Forms**: Context-aware form generation
- **Real-time Updates**: Immediate visual feedback

#### **Components Required:**
- `PropertyPanel.tsx` - Main container
- `TabNavigation.tsx` - Tab switching
- `PropertyForm.tsx` - Form wrapper
- `PropertiesTab.tsx` - Node/edge properties
- `StyleTab.tsx` - Styling controls
- `PropertyGroup.tsx` - Grouped form sections
- `ColorPicker.tsx` - Custom color selection
- `EdgeValuesInput.tsx` - Edge value inputs
- `KeyValueInput.tsx` - Key-value pair inputs

#### **Features:**
- Collapsible sections
- Scrollable content
- Persistent state
- Validation feedback
- Keyboard shortcuts

### **2. Toolbar System**
#### **Main Toolbar:**
- **File Menu**: VS Code-style dropdown (New, Open, Save, Clear, Present)
- **Add Node**: Context-aware node creation
- **Fit View**: Zoom to fit all nodes
- **Workflow Controls**: Play, Pause, Restart, Debug
- **Presentation Button**: Launch full-screen mode

#### **Sub Toolbar:**
- **Sidebar Toggles**: Left/right panel controls
- **Background Patterns**: Dots and Grid options only
- **Settings**: Snap to grid, grid size, show controls
- **MiniMap Toggle**: Show/hide minimap
- **Diagram Type**: Global diagram type selector
- **Keyboard Help**: Shortcuts reference

### **3. Background Pattern System**
#### **Supported Patterns:**
- **Dots**: Subtle dots with 32px spacing, 2.5px size
- **Grid/Lines**: Clean grid lines with 24px spacing, 1px line width
- **Color**: `#cbd5e1` (subtle, non-distracting)

#### **Technical Requirements:**
- Consistent across editor and presentation modes
- Fallback handling for unsupported patterns
- Responsive sizing
- Performance optimized

### **4. Node System**
#### **Node Types:**
- **Start Node**: Green, rounded, flow entry point
- **Action Node**: Blue, rectangular, process steps
- **Condition Node**: Yellow, diamond, decision points
- **End Node**: Red, rounded, flow termination

#### **Node Features:**
- **Inline Editing**: Click to edit titles
- **Resizable**: Drag handles when selected
- **Custom Styling**: Color, size, border customization
- **Properties Panel**: Context-aware property editing
- **Template Integration**: Use centralized templates

### **5. Edge System**
#### **Edge Types:**
- **Standard Edge**: Smooth curves, arrow markers
- **Workflow Edge**: Animated flow indicators
- **Custom Styling**: Color, width, style customization

#### **Edge Features:**
- **Inline Label Editing**: Click to edit labels
- **Connection Validation**: Proper node connection
- **Style Consistency**: Match overall design
- **Animation Support**: Optional flow animation

### **6. Presentation Mode**
#### **Requirements:**
- **Full-screen Modal**: Overlay entire screen
- **Workflow Controls**: Play, pause, restart, debug
- **Navigation**: Keyboard shortcuts
- **Background Matching**: Same patterns as editor
- **Escape Handling**: Close with Escape key

#### **Features:**
- Fit view on open
- Keyboard navigation
- Control visibility
- MiniMap support
- Smooth transitions

### **7. Sidebar System**
#### **Left Sidebar:**
- **Template Library**: Workflow templates
- **Explorer**: File/project navigation
- **Component Panels**: Organized in `SidebarPanels/`

#### **Right Sidebar:**
- **Property Panel**: Context-aware property editing
- **Auto-open**: When nodes/edges selected
- **Persistent State**: Remember open/closed state

### **8. Keyboard Shortcuts**
#### **Global Shortcuts:**
- `Ctrl+N`: Add Node
- `Shift+Ctrl+N`: New Workflow
- `Ctrl+S`: Save
- `Ctrl+O`: Open
- `Ctrl+F`: Fit View
- `Ctrl+P`: Presentation Mode
- `Ctrl+M`: Toggle MiniMap
- `Delete`: Delete selected
- `?`: Show keyboard help
- `Escape`: Close modals

#### **Help System:**
- **Modal Dialog**: Comprehensive shortcuts list
- **Categorized**: Grouped by functionality
- **Searchable**: Easy to find specific shortcuts
- **Accessible**: Keyboard navigation

---

## 📦 **COMPONENT SPECIFICATIONS**

### **DiagramEditor.tsx**
#### **Responsibilities:**
- Main ReactFlow integration
- Node/edge state management
- Background pattern rendering
- Toolbar integration
- Sidebar coordination
- Keyboard event handling

#### **Key Features:**
- ReactFlow configuration
- Node/edge creation/deletion
- Background variant switching
- Presentation mode launching
- Property panel integration
- Keyboard shortcuts

### **DiagramToolbar.tsx**
#### **Interface Requirements:**
```typescript
interface DiagramToolbarProps {
  onAddNode: () => void;
  onFitView: () => void;
  onNew: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  backgroundVariant: BackgroundVariant;
  onBackgroundVariantChange: (variant: BackgroundVariant) => void;
  showMiniMap: boolean;
  onMiniMapToggle: (show: boolean) => void;
  // ... other props
}
```

#### **Layout:**
- **Top Bar**: File menu, add node, fit view, workflow controls, presentation
- **Bottom Bar**: Sidebar toggles, background patterns, settings, help

### **PropertyPanel/**
#### **Modular Architecture:**
- Each component has single responsibility
- Reusable form controls
- Consistent styling
- Proper TypeScript interfaces
- Error boundaries

#### **State Management:**
- Custom hooks for form handling
- Persistent panel state
- Real-time updates
- Validation logic

---

## 🎛️ **CONFIGURATION REQUIREMENTS**

### **appConfig.ts Structure:**
```typescript
export const NODE_DEFAULTS = {
  start: { color: '#10b981', backgroundColor: '#f0fdf4' },
  action: { color: '#3b82f6', backgroundColor: '#eff6ff' },
  condition: { color: '#f59e0b', backgroundColor: '#fffbeb' },
  end: { color: '#ef4444', backgroundColor: '#fef2f2' }
};

export const EDGE_DEFAULTS = {
  color: '#64748b',
  width: 2,
  animated: false
};

export const DIAGRAM_TYPES = {
  BASIC_FLOW: 'Basic Flow Diagram',
  WORKFLOW_ANIMATION: 'Workflow Animation Diagram',
  // ... other types
};
```

### **Template System:**
- Centralized template creation
- Consistent node/edge styling
- Reusable across components
- Easy to extend

---

## 🔍 **DEVELOPMENT STANDARDS**

### **Code Quality Requirements:**
1. **TypeScript**: Strict typing, no `any` types
2. **ESLint**: Zero warnings, consistent formatting
3. **Performance**: Optimized renders, memoization where needed
4. **Accessibility**: ARIA labels, keyboard navigation
5. **Error Handling**: Proper error boundaries and validation

### **Testing Requirements:**
- Build must pass without errors
- Lint must pass without warnings
- Manual testing of all features
- Cross-browser compatibility
- Responsive design testing

### **Documentation Standards:**
- Clear component documentation
- Interface specifications
- Usage examples
- README files for complex features
- Changelog maintenance

---

## 🎯 **SPECIFIC TECHNICAL REQUIREMENTS**

### **Background Pattern Implementation:**
- **Only Dots and Grid**: No Cross pattern
- **Subtle Coloring**: `#cbd5e1` for non-distracting appearance
- **Responsive Sizing**: Adapt to different screen sizes
- **Consistent Rendering**: Same in editor and presentation

### **Node Resizing:**
- **ReactFlow NodeResizer**: Use built-in resizing
- **Visible When Selected**: Show resize handles on selection
- **Min/Max Constraints**: Reasonable size limits
- **Smooth Interaction**: Responsive drag handling

### **Inline Editing:**
- **Click to Edit**: Intuitive editing activation
- **Enter to Save**: Keyboard completion
- **Escape to Cancel**: Cancel editing
- **Visual Feedback**: Clear editing state

### **File Menu System:**
- **VS Code Style**: Dropdown with consistent styling
- **Confirmation Dialogs**: For destructive actions
- **Toast Notifications**: Success/error feedback
- **Keyboard Shortcuts**: Consistent with global shortcuts

---

## 🚀 **DEPLOYMENT & MAINTENANCE**

### **Build Process:**
```bash
npm run build    # Must pass without errors
npm run lint     # Must pass without warnings
npm run dev      # Development server
```

### **Version Control:**
- Semantic versioning
- Detailed commit messages
- Feature branch workflow
- Comprehensive changelog

### **Performance Monitoring:**
- Bundle size optimization
- Render performance
- Memory usage
- Load time optimization

---

## 🎨 **UI/UX EXPECTATIONS**

### **Visual Hierarchy:**
1. **Primary Actions**: Prominent, easy to find
2. **Secondary Actions**: Available but not distracting
3. **Contextual Actions**: Show when relevant
4. **Feedback**: Immediate response to user actions

### **Interaction Design:**
- **Intuitive**: Follow common UI patterns
- **Responsive**: Immediate feedback
- **Consistent**: Same behavior across components
- **Accessible**: Keyboard and screen reader support

### **Animation & Transitions:**
- **Subtle**: Enhance without distraction
- **Purposeful**: Communicate state changes
- **Performant**: Smooth on all devices
- **Optional**: Respect user preferences

---

## 📝 **COMMUNICATION PROTOCOLS**

### **When Making Changes:**
1. **Understand Requirements**: Clarify before implementing
2. **Plan Architecture**: Think through component structure
3. **Implement Incrementally**: Small, testable changes
4. **Test Thoroughly**: Build, lint, manual testing
5. **Document Changes**: Update changelog and docs

### **Quality Checks:**
- Always run build and lint
- Test all affected functionality
- Verify responsive design
- Check keyboard navigation
- Validate TypeScript types

### **Error Handling:**
- Fix all build errors before proceeding
- Address all ESLint warnings
- Handle edge cases gracefully
- Provide meaningful error messages

---

## 🔄 **ITERATION GUIDELINES**

### **Development Cycle:**
1. **Analyze Request**: Understand full scope
2. **Plan Implementation**: Component structure, file changes
3. **Execute Changes**: Implement with quality focus
4. **Validate**: Build, lint, test
5. **Document**: Update changelog and context

### **Continuous Improvement:**
- Refactor when needed
- Optimize performance
- Enhance user experience
- Maintain code quality

---

## 📚 **KNOWLEDGE BASE**

### **Key Dependencies:**
- **ReactFlow**: Diagram rendering and interaction
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety and development experience
- **Next.js**: Framework and build system

### **Custom Hooks:**
- `useTheme`: Theme management
- `usePropertyForm`: Property panel form handling
- `usePanelPersistence`: Panel state persistence

### **Utility Functions:**
- Template creation helpers
- Color manipulation utilities
- Validation functions
- Event handlers

---

## 🎖️ **SUCCESS CRITERIA**

### **Technical Success:**
- Zero build errors
- Zero ESLint warnings
- Full TypeScript compliance
- Optimal performance scores

### **User Experience Success:**
- Intuitive interface
- Smooth interactions
- Responsive design
- Accessible features

### **Feature Completeness:**
- All requested features implemented
- Edge cases handled
- Error states managed
- Documentation complete

---

## 📞 **SUPPORT & MAINTENANCE**

### **Issue Resolution:**
1. **Reproduce Issue**: Understand the problem
2. **Analyze Root Cause**: Find the source
3. **Plan Solution**: Consider impact and alternatives
4. **Implement Fix**: With proper testing
5. **Verify Resolution**: Confirm fix works

### **Feature Requests:**
1. **Clarify Requirements**: Understand full scope
2. **Assess Impact**: Consider architecture implications
3. **Plan Implementation**: Design before coding
4. **Execute with Quality**: Maintain standards
5. **Document Changes**: Update all relevant docs

---

This document serves as the complete instruction set for the Workflow Orchestrator project. It captures all requirements, expectations, technical specifications, and quality standards established through our development process. Use this as the definitive reference for all future development work.
