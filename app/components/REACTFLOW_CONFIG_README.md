# ReactFlow Configuration Management

## Overview

This file provides a centralized configuration for ReactFlow node and edge types to ensure consistency between the main DiagramEditor and PresentationView components.

## Problem Solved

### Issue
Previously, the DiagramEditor and PresentationView had separate, duplicated ReactFlow configurations:
- **DiagramEditor**: `{ custom: WorkflowNode, workflowEdge: WorkflowEdge }`
- **PresentationView**: `{ workflowNode: WorkflowNode, workflowEdge: WorkflowEdge }` ❌

This mismatch caused the presentation view to fall back to default ReactFlow node rendering, losing all custom styling, colors, icons, and design elements.

### Solution
Created a shared configuration file that both components import, ensuring they always use identical ReactFlow type mappings.

## Configuration

### Node Types
```typescript
export const nodeTypes: NodeTypes = {
  custom: WorkflowNode,
};
```

All nodes in the system are created with `type: 'custom'` and are rendered using the `WorkflowNode` component.

### Edge Types
```typescript
export const edgeTypes: EdgeTypes = {
  workflowEdge: WorkflowEdge,
  animatedSvg: WorkflowEdge, // Backward compatibility
};
```

All edges in the system are created with `type: 'workflowEdge'` and are rendered using the `WorkflowEdge` component.

## Usage

### Importing the Configuration
```typescript
import { nodeTypes, edgeTypes } from './reactFlowConfig';
```

### Using in ReactFlow
```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  // ... other props
>
```

## Components Using This Configuration

1. **DiagramEditor.tsx** - Main workflow editor
2. **PresentationView.tsx** - Full-screen presentation mode

## Benefits

### Consistency
- **Guaranteed Alignment**: Both editor and presentation use identical type mappings
- **Visual Consistency**: All custom styling, colors, and icons appear in both views
- **Behavioral Consistency**: All node/edge interactions work the same way

### Maintainability
- **Single Source of Truth**: One place to modify ReactFlow configuration
- **Reduced Duplication**: No more duplicate type definitions
- **Future-Proof**: New components automatically get consistent configuration

### Error Prevention
- **Type Safety**: TypeScript ensures correct usage
- **Build-Time Validation**: Mismatches caught during compilation
- **Runtime Reliability**: No more missing node/edge renderers

## File Structure

```
app/components/
├── reactFlowConfig.ts     # ← This file (shared configuration)
├── DiagramEditor.tsx      # ← Imports and uses shared config
├── PresentationView.tsx   # ← Imports and uses shared config
├── WorkflowNode.tsx       # ← Node renderer component
└── WorkflowEdge.tsx       # ← Edge renderer component
```

## Adding New Node/Edge Types

When adding new node or edge types:

1. **Create the renderer component**
2. **Add to this configuration file**
3. **Both editor and presentation automatically support the new type**

Example:
```typescript
export const nodeTypes: NodeTypes = {
  custom: WorkflowNode,
  newType: NewNodeComponent,  // ← Add here
};
```

## Migration Notes

### Before (Problematic)
```typescript
// DiagramEditor.tsx
const nodeTypes = { custom: WorkflowNode };

// PresentationView.tsx  
const nodeTypes = { workflowNode: WorkflowNode }; // ❌ Mismatch!
```

### After (Solution)
```typescript
// reactFlowConfig.ts
export const nodeTypes = { custom: WorkflowNode };

// DiagramEditor.tsx
import { nodeTypes } from './reactFlowConfig';

// PresentationView.tsx
import { nodeTypes } from './reactFlowConfig';
```

This ensures both components always use the exact same configuration, preventing styling and rendering issues.
