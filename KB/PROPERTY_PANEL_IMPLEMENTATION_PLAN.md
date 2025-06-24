# 🎯 Property Panel System - Complete Implementation Plan

## ✅ **FINAL CONFIRMED SPECIFICATIONS**

### **Panel Behavior:**
- **Auto-open:** When node/edge is selected
- **Auto-hide:** When clicking outside panel or canvas background
- **Empty state:** Show global diagram properties when nothing selected
- **Smart focus:** Panel stays open while editing, closes on canvas interaction

### **Property Presets:**
- **Hybrid approach:** Built-in global presets + diagram-specific custom presets
- **Extensible system:** Users can create, save, and share presets
- **Smart defaults:** Material Design colors, common workflow node types

### **Feature Implementation:**
- **Complete feature set:** All advanced features in first release
- **Progressive enhancement:** Core features work, advanced features enhance

### **Responsive Design:**
- **Desktop (≥1024px):** Full sidebar panel with resize
- **Tablet (768-1023px):** Collapsible sidebar with compact mode
- **Mobile (≤767px):** Bottom sheet modal with swipe gestures

---

## 🏗️ **COMPLETE TECHNICAL ARCHITECTURE**

### **1. Component Structure (Final)**

```typescript
📦 app/components/PropertyPanel/
├── 🎯 PropertyPanel.tsx                    // Main container + auto-open/close logic
├── 📱 ResponsivePropertyPanel.tsx          // Responsive wrapper (sidebar/modal)
├── 📋 PropertyPanelHeader.tsx              // Header with tools and collapse
├── 🏷️ TabNavigation.tsx                   // Responsive tab interface
├── 📝 PropertyForm.tsx                     // Local state form wrapper
├── 🎨 PropertyPanel.module.css             // Responsive animations & styles
├── 📁 tabs/
│   ├── OverviewTab.tsx                    // Essential properties (Node/Edge)
│   ├── PropertiesTab.tsx                  // Custom properties + data
│   ├── StyleTab.tsx                       // Visual styling controls
│   ├── AdvancedTab.tsx                    // Position, metadata, technical
│   └── DiagramTab.tsx                     // Global diagram properties
├── 🔧 controls/
│   ├── LabelInput.tsx                     // Focus-safe input with validation
│   ├── ColorPicker.tsx                    // Advanced color selection
│   ├── IconSelector.tsx                   // Icon picker with categories
│   ├── NumberInput.tsx                    // Numeric input with constraints
│   ├── SelectInput.tsx                    // Searchable dropdown
│   ├── TextAreaInput.tsx                  // Auto-resize textarea
│   ├── PropertyGroup.tsx                  // Collapsible sections
│   ├── PropertySearch.tsx                 // Search/filter component
│   └── BulkEditControls.tsx              // Multi-selection tools
├── 🎨 presets/
│   ├── PropertyPresets.tsx                // Preset management system
│   ├── PresetSelector.tsx                 // Preset picker interface
│   ├── BuiltinPresets.ts                  // Default presets library
│   └── CustomPresets.tsx                  // User preset management
├── 📱 mobile/
│   ├── MobilePropertyPanel.tsx            // Mobile bottom sheet
│   ├── TabletPropertyPanel.tsx            // Tablet optimized version
│   └── TouchGestures.tsx                  // Swipe and touch handlers
├── 🔍 features/
│   ├── PropertySearch.tsx                 // Advanced search functionality
│   ├── BulkEditor.tsx                     // Multi-selection editing
│   ├── PropertyTemplates.tsx              // Template system
│   ├── PropertyValidation.tsx             // Validation engine
│   └── PropertyRelationships.tsx          // Dependency management
└── 📊 hooks/
    ├── usePropertyPanel.ts                // Main panel state management
    ├── usePropertyForm.ts                 // Form state with local updates
    ├── useAutoPanel.ts                    // Auto-open/close behavior
    ├── useResponsivePanel.ts              // Responsive behavior
    ├── usePropertyPresets.ts              // Preset management
    ├── useBulkEdit.ts                     // Multi-selection logic
    ├── usePropertySearch.ts               // Search and filtering
    └── usePanelPersistence.ts             // State persistence
```

### **2. State Management Strategy (Complete)**

```typescript
// Main Panel State
interface PropertyPanelState {
  // Visibility & Layout
  isOpen: boolean;
  isCollapsed: boolean;
  width: number;
  activeTab: TabType;
  isCompactMode: boolean;
  
  // Selection & Content
  selectedItems: (Node | Edge)[];
  selectionType: 'none' | 'single' | 'multiple';
  showGlobalProperties: boolean;
  
  // Features
  searchQuery: string;
  filteredProperties: string[];
  bulkEditMode: boolean;
  previewMode: boolean;
  
  // Responsive
  deviceType: 'mobile' | 'tablet' | 'desktop';
  panelMode: 'sidebar' | 'modal' | 'bottomSheet';
}

// Local Form State (Prevents Focus Loss)
interface PropertyFormState {
  localData: Record<string, any>;
  originalData: Record<string, any>;
  isDirty: boolean;
  isValidating: boolean;
  errors: Record<string, ValidationError>;
  pendingUpdates: Record<string, any>;
}

// Auto Panel Behavior
interface AutoPanelBehavior {
  autoOpenOnSelect: boolean;
  autoCloseOnClickOutside: boolean;
  autoCloseOnEscape: boolean;
  persistOpenState: boolean;
  smartFocus: boolean;
}
```

### **3. Responsive Design System**

```typescript
// Breakpoint Configuration
const RESPONSIVE_CONFIG = {
  mobile: { maxWidth: 767, panelMode: 'bottomSheet' },
  tablet: { minWidth: 768, maxWidth: 1023, panelMode: 'modal' },
  desktop: { minWidth: 1024, panelMode: 'sidebar' }
};

// Panel Dimensions (Responsive)
const PANEL_DIMENSIONS = {
  desktop: { 
    minWidth: 320, 
    maxWidth: 600, 
    defaultWidth: 384,
    headerHeight: 56 
  },
  tablet: { 
    width: '90vw', 
    maxWidth: 480, 
    headerHeight: 52 
  },
  mobile: { 
    width: '100vw', 
    maxHeight: '70vh', 
    headerHeight: 48 
  }
};

// Touch Gestures (Mobile/Tablet)
const TOUCH_CONFIG = {
  swipeThreshold: 50,
  dragThreshold: 10,
  tapTimeout: 300,
  longPressTimeout: 500
};
```

### **4. Auto-Open/Close Logic**

```typescript
// useAutoPanel.ts - Smart panel behavior
const useAutoPanel = () => {
  const handleSelectionChange = useCallback((selectedItems: any[]) => {
    if (selectedItems.length > 0) {
      // Auto-open with selection
      setPanelState(prev => ({
        ...prev,
        isOpen: true,
        selectedItems,
        selectionType: selectedItems.length === 1 ? 'single' : 'multiple'
      }));
    } else {
      // Show global properties or close based on user preference
      setPanelState(prev => ({
        ...prev,
        selectedItems: [],
        selectionType: 'none',
        showGlobalProperties: true
      }));
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    const isPropertyPanel = target.closest('[data-property-panel]');
    const isCanvas = target.closest('[data-canvas-area]');
    
    if (isCanvas && !isPropertyPanel) {
      // Clicked on canvas - close panel
      setPanelState(prev => ({ ...prev, isOpen: false }));
    }
  }, []);
};
```

### **5. Complete Feature Implementation**

#### **🔍 Advanced Search & Filter**
```typescript
// Property search with fuzzy matching
const usePropertySearch = () => {
  const searchResults = useMemo(() => {
    return fuzzySearch(properties, searchQuery, {
      keys: ['label', 'description', 'category', 'tags'],
      threshold: 0.6
    });
  }, [properties, searchQuery]);
};
```

#### **✏️ Bulk Editing**
```typescript
// Multi-selection bulk operations
const useBulkEdit = () => {
  const applyBulkUpdate = useCallback((updates: any) => {
    selectedItems.forEach(item => {
      handleItemUpdate(item.id, updates);
    });
  }, [selectedItems]);
};
```

#### **🎨 Property Templates**
```typescript
// Template system with built-in and custom presets
const BUILTIN_PRESETS = {
  nodeTypes: {
    process: { color: '#3B82F6', icon: 'gear', shape: 'rounded' },
    decision: { color: '#F59E0B', icon: 'question', shape: 'diamond' },
    start: { color: '#10B981', icon: 'play', shape: 'circle' },
    end: { color: '#EF4444', icon: 'stop', shape: 'circle' }
  },
  colorSchemes: {
    material: ['#F44336', '#E91E63', '#9C27B0', '#673AB7'],
    pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
    professional: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6']
  }
};
```

### **6. Performance Optimizations**

```typescript
// Virtual scrolling for large property lists
const VirtualPropertyList = memo(({ properties }: { properties: Property[] }) => {
  const { virtualItems, totalSize, scrollElementRef } = useVirtualizer({
    count: properties.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: useCallback(() => 48, []),
    overscan: 10
  });
});

// Intelligent debouncing with immediate UI updates
const useSmartDebounce = (value: any, delay: number) => {
  const [localValue, setLocalValue] = useState(value);
  const [committedValue, setCommittedValue] = useState(value);
  
  const debouncedCommit = useMemo(
    () => debounce((val: any) => {
      setCommittedValue(val);
      onCommit?.(val);
    }, delay),
    [delay, onCommit]
  );
};
```

### **7. Accessibility & Keyboard Support**

```typescript
// Full keyboard navigation
const KEYBOARD_SHORTCUTS = {
  'Escape': 'closePanel',
  'Tab': 'navigateFields',
  'Enter': 'commitValue',
  'Ctrl+S': 'savePreset',
  'Ctrl+Z': 'undoChange',
  'Ctrl+F': 'openSearch',
  'F2': 'editLabel'
};

// Screen reader support
const A11Y_CONFIG = {
  announcements: true,
  descriptions: true,
  landmarks: true,
  focusManagement: true
};
```

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Core Infrastructure (Week 1)**
- ✅ Basic panel structure and responsive wrapper
- ✅ Auto-open/close behavior
- ✅ Local state management for focus-safe inputs
- ✅ Basic tab navigation

### **Phase 2: Essential Features (Week 2)**
- ✅ Overview tab with common properties
- ✅ Property validation and error handling
- ✅ Responsive design for all devices
- ✅ Built-in presets system

### **Phase 3: Advanced Features (Week 3)**
- ✅ Search and filtering
- ✅ Bulk editing capabilities
- ✅ Custom preset management
- ✅ Property templates

### **Phase 4: Polish & Optimization (Week 4)**
- ✅ Performance optimizations
- ✅ Advanced animations
- ✅ Accessibility enhancements
- ✅ Comprehensive testing

---

## 🎨 **UI/UX Design Specifications**

### **Visual Design System**

#### **Panel Layout (Desktop)**
```
┌─────────────────────────────────────────┐
│ 🎯 Node Properties        [🔍] [−] [×] │ ← Header (56px)
├─────────────────────────────────────────┤
│ [📋 Overview] [⚙️ Props] [🎨 Style] [⚙️]│ ← Tabs (40px)
├─────────────────────────────────────────┤
│ 📋 Basic Properties                     │ ← Content
│ ┌─────────────────────────────────────┐ │
│ │ Label    [Input Field____________] │ │
│ │ Type     [Dropdown▼]              │ │
│ │ Color    [🔴] [Color Picker]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🎨 Appearance                          │
│ ┌─────────────────────────────────────┐ │
│ │ Icon     [📋] [Icon Selector]     │ │
│ │ Size     [Width] [Height]         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### **Mobile Layout (Bottom Sheet)**
```
┌─────────────────────────────────────┐
│               ═══                   │ ← Drag handle
├─────────────────────────────────────┤
│ 🎯 Node Properties        [×]       │ ← Header
├─────────────────────────────────────┤
│ [📋] [⚙️] [🎨] [⚙️]                 │ ← Tab icons
├─────────────────────────────────────┤
│                                     │
│ Touch-optimized content             │
│ with larger touch targets           │
│                                     │
└─────────────────────────────────────┘
```

### **Color System**
```typescript
const PANEL_COLORS = {
  background: {
    light: '#ffffff',
    dark: '#1f2937'
  },
  header: {
    light: '#f8fafc',
    dark: '#374151'
  },
  border: {
    light: '#e5e7eb',
    dark: '#4b5563'
  },
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};
```

### **Typography Scale**
```typescript
const TYPOGRAPHY = {
  header: { size: '16px', weight: '600', lineHeight: '1.5' },
  subheader: { size: '14px', weight: '500', lineHeight: '1.4' },
  body: { size: '13px', weight: '400', lineHeight: '1.4' },
  caption: { size: '11px', weight: '400', lineHeight: '1.3' },
  code: { fontFamily: 'JetBrains Mono, monospace' }
};
```

### **Animation System**
```typescript
const ANIMATIONS = {
  panel: {
    open: 'slide-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    close: 'slide-out-right 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    collapse: 'width 300ms ease-in-out'
  },
  tabs: {
    switch: 'fade-in 200ms ease-in-out',
    highlight: 'slide-x 200ms ease-in-out'
  },
  inputs: {
    focus: 'border-color 150ms ease-in-out',
    error: 'shake 300ms ease-in-out'
  }
};
```

---

## 🔧 **Technical Implementation Details**

### **Local State Management (Focus Fix)**

```typescript
// PropertyForm.tsx - Main form wrapper with local state
const PropertyForm = ({ selectedItem, onUpdate }) => {
  const [localState, setLocalState] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Sync external changes to local state
  useEffect(() => {
    setLocalState(selectedItem.data);
    setIsDirty(false);
  }, [selectedItem.id]); // Only sync on item change, not data change

  // Handle input changes with immediate local update
  const handleInputChange = useCallback((key: string, value: any) => {
    setLocalState(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounced external update
    timeoutRef.current = setTimeout(() => {
      onUpdate(selectedItem.id, { [key]: value });
      setIsDirty(false);
    }, 1000);
  }, [selectedItem.id, onUpdate]);

  // Immediate save on blur
  const handleInputBlur = useCallback((key: string, value: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (localState[key] !== selectedItem.data[key]) {
      onUpdate(selectedItem.id, { [key]: value });
      setIsDirty(false);
    }
  }, [localState, selectedItem, onUpdate]);
};
```

### **Responsive Behavior**

```typescript
// useResponsivePanel.ts
const useResponsivePanel = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [panelMode, setPanelMode] = useState<PanelMode>('sidebar');

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
        setPanelMode('bottomSheet');
      } else if (width < 1024) {
        setDeviceType('tablet');
        setPanelMode('modal');
      } else {
        setDeviceType('desktop');
        setPanelMode('sidebar');
      }
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return { deviceType, panelMode };
};
```

### **Integration with DiagramEditor**

```typescript
// DiagramEditor.tsx - Integration points
const DiagramEditor = () => {
  // Property panel state
  const [propertyPanelState, setPropertyPanelState] = useState<PropertyPanelState>({
    isOpen: false,
    width: 384,
    activeTab: 'overview',
    selectedItems: [],
    // ... other state
  });

  // Auto-open behavior
  const handleSelectionChange = useCallback((items: any[]) => {
    setPropertyPanelState(prev => ({
      ...prev,
      isOpen: items.length > 0,
      selectedItems: items,
      selectionType: items.length === 1 ? 'single' : 'multiple'
    }));
  }, []);

  // Canvas responsive layout
  const canvasStyle = useMemo(() => ({
    marginRight: propertyPanelState.isOpen && !propertyPanelState.isCollapsed 
      ? `${propertyPanelState.width}px` 
      : '0',
    transition: 'margin-right 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  }), [propertyPanelState]);

  // Click outside handler
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('[data-property-panel]')) {
      // Clicked outside panel - close it
      setPropertyPanelState(prev => ({ ...prev, isOpen: false }));
    }
  }, []);

  return (
    <div className="diagram-editor">
      {/* Main canvas with responsive margin */}
      <div 
        style={canvasStyle}
        onClick={handleCanvasClick}
        data-canvas-area
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onSelectionChange={handleSelectionChange}
          // ... other props
        />
      </div>

      {/* Property panel */}
      <PropertyPanel
        state={propertyPanelState}
        onStateChange={setPropertyPanelState}
        selectedItems={propertyPanelState.selectedItems}
        onItemUpdate={handleItemUpdate}
      />
    </div>
  );
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
- ✅ Component rendering with different props
- ✅ Local state management and focus behavior
- ✅ Input validation and error handling
- ✅ Responsive behavior across breakpoints
- ✅ Keyboard navigation and accessibility

### **Integration Tests**
- ✅ Panel auto-open/close behavior
- ✅ Form state synchronization
- ✅ Preset loading and saving
- ✅ Bulk editing operations
- ✅ Search and filtering functionality

### **E2E Tests**
- ✅ Complete user workflows
- ✅ Cross-device compatibility
- ✅ Performance under load
- ✅ Accessibility compliance
- ✅ Real-world usage scenarios

---

## 📚 **Documentation Plan**

### **Developer Documentation**
- ✅ Component API reference
- ✅ State management patterns
- ✅ Extension guidelines
- ✅ Performance best practices
- ✅ Accessibility requirements

### **User Documentation**
- ✅ Property panel user guide
- ✅ Keyboard shortcuts reference
- ✅ Preset management tutorial
- ✅ Mobile usage guidelines
- ✅ Troubleshooting guide

---

## ✅ **READY FOR IMPLEMENTATION**

The architecture is:
- **📱 Fully Responsive:** Mobile, tablet, desktop optimized
- **🚀 Performance Focused:** Virtual scrolling, smart debouncing, local state
- **🔧 Extensible:** Easy to add new property types and features
- **♿ Accessible:** Full keyboard and screen reader support
- **🎨 Beautiful:** Smooth animations and intuitive UI
- **🛡️ Robust:** Error boundaries and validation pipeline
- **🔄 Future-Proof:** Modular architecture for easy maintenance
- **🎯 Focus-Safe:** Local state prevents input focus loss

**This comprehensive plan addresses all requirements including the focus issue solution using local state management. Ready to begin implementation!**
