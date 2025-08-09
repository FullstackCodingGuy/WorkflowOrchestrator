# Draw.io Feature Implementation Plan

## Multi-Page Diagrams
- Add support for multiple canvases/tabs.
- Scaffold: `app/components/MultiPageCanvas.tsx`

## Shape Library
- Add a palette of shapes, icons, stencils.
- Scaffold: `app/components/ShapeLibrary.tsx`

## Advanced Connectors
- Support curved, orthogonal connectors, custom arrowheads.
- Scaffold: `app/components/AdvancedConnector.tsx`

## Layer Management & Grouping
- Add layers, group/ungroup elements.
- Scaffold: `app/components/LayerManager.tsx`

## Image Embedding
- Allow image upload and embedding.
- Scaffold: `app/components/ImageEmbedder.tsx`

## Export Formats
- Export diagrams to PNG, SVG, PDF, XML.
- Scaffold: `app/components/ExportManager.tsx`

## Collaboration
- Real-time multi-user editing.
- Scaffold: `app/components/CollaborationProvider.tsx`

## Undo/Redo History
- Full undo/redo stack for all actions.
- Scaffold: `app/components/HistoryManager.tsx`

## Themes & Style Presets
- Custom diagram themes and style presets.
- Scaffold: `app/components/ThemePresetManager.tsx`

## Cloud Integration
- Save/load diagrams from cloud storage.
- Scaffold: `app/components/CloudStorageProvider.tsx`

---
Each feature requires UI, state management, and integration with the diagram editor. This plan scaffolds the necessary files for incremental implementation.