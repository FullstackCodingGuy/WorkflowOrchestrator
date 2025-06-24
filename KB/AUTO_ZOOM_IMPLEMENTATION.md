# Auto-Zoom Implementation

## Overview
Implemented automatic zoom-out functionality that adjusts the diagram view based on workflow size and available viewport space.

## Features

### 1. Automatic Viewport Fitting
- **Smart Zoom**: Automatically calculates optimal zoom level to fit the entire workflow within the viewport
- **Padding Control**: Configurable padding around the workflow (default: 10%)
- **Zoom Limits**: Respects maximum (1.2x) and minimum (0.1x) zoom levels
- **Smooth Animation**: 800ms animated transitions for better UX

### 2. Trigger Conditions
Auto-zoom is triggered when:
- **Workflow Import**: After importing a new workflow
- **Layout Changes**: After applying TB or LR layouts  
- **Node Addition**: When new nodes are added to the canvas
- **Node Duplication**: When nodes are duplicated

### 3. User Control
- **Settings Toggle**: Users can enable/disable auto-zoom in Toolbar Settings
- **Persistent Settings**: Auto-zoom preference is saved to localStorage
- **Real-time Updates**: Changes are synchronized across browser tabs

### 4. Technical Implementation

#### Store Updates (`workflowStore.ts`)
```typescript
// New state properties
shouldAutoZoom: boolean;
setShouldAutoZoom: (shouldAutoZoom: boolean) => void;
calculateWorkflowBounds: () => BoundsInfo | null;
```

#### Configuration (`appConfig.ts`)
```typescript
export const VIEWPORT = {
  autoZoomEnabled: true,
  autoZoomPadding: 0.1,      // 10% padding
  autoZoomMaxZoom: 1.2,      // Maximum zoom level
  autoZoomMinZoom: 0.1,      // Minimum zoom level
  autoZoomDuration: 800,     // Animation duration (ms)
};
```

#### Canvas Integration (`WorkflowCanvas.tsx`)
- Monitors `shouldAutoZoom` state changes
- Uses ReactFlow's `fitView()` method for smooth transitions
- Respects user settings from localStorage
- Prevents conflicts with manual zoom/pan operations

### 5. Smart Bounds Calculation
- **Node Dimensions**: Considers actual node widths and heights
- **Position Accuracy**: Uses precise node positioning data
- **Empty State Handling**: Gracefully handles workflows with no nodes
- **Layout Margin**: Accounts for dagre layout margins

### 6. Settings Integration
- **Toolbar Settings Panel**: Added "Auto Zoom to Fit" checkbox
- **Live Updates**: Changes take effect immediately
- **Cross-tab Sync**: Settings synchronized via localStorage events
- **Default Enabled**: Auto-zoom is enabled by default for better UX

## Usage

### For Users
1. Open Toolbar Settings (gear icon)
2. Navigate to "App Settings" tab
3. Toggle "Auto Zoom to Fit" checkbox
4. Setting is automatically saved and synced

### For Developers
```typescript
// Manually trigger auto-zoom
const { setShouldAutoZoom } = useWorkflowStore();
setShouldAutoZoom(true);

// Check workflow bounds
const { calculateWorkflowBounds } = useWorkflowStore();
const bounds = calculateWorkflowBounds();
```

## Benefits
1. **Better UX**: Users never lose sight of their workflow
2. **Responsive**: Adapts to different screen sizes and workflow complexities
3. **Performance**: Efficient bounds calculation and smooth animations
4. **Flexibility**: Can be disabled by users who prefer manual control
5. **Consistency**: Works across all layout operations and workflow changes

## Notes
- Auto-zoom does not interfere with user-initiated zoom/pan operations
- The feature respects ReactFlow's built-in zoom constraints
- Settings are persisted and restored on page reload
- Animation can be disabled by setting duration to 0 in config
