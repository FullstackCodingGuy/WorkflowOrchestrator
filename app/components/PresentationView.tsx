import React, { useCallback, useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  BackgroundVariant, 
  Node, 
  Edge, 
  ReactFlowProvider,
  useReactFlow,
  Panel,
  MiniMap,
  Controls
} from 'reactflow';
import { nodeTypes, edgeTypes } from './reactFlowConfig';

interface PresentationViewProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  backgroundVariant?: BackgroundVariant;
  showMiniMap?: boolean;
  workflowState?: 'idle' | 'playing' | 'paused' | 'debugging';
  onPlayWorkflow?: () => void;
  onPauseWorkflow?: () => void;
  onRestartWorkflow?: () => void;
  onDebugWorkflow?: () => void;
}

function PresentationViewContent({
  nodes,
  edges,
  backgroundVariant = BackgroundVariant.Dots,
  showMiniMap = true,
  workflowState = 'idle',
  onPlayWorkflow,
  onPauseWorkflow,
  onRestartWorkflow,
  onDebugWorkflow,
  onClose
}: Omit<PresentationViewProps, 'isOpen'>) {
  const { fitView, zoomIn, zoomOut, getZoom } = useReactFlow();
  const [currentZoom, setCurrentZoom] = useState(100);

  // Update zoom display
  useEffect(() => {
    const updateZoom = () => {
      const zoom = getZoom();
      setCurrentZoom(Math.round(zoom * 100));
    };
    
    updateZoom();
    // Set up interval to update zoom level
    const interval = setInterval(updateZoom, 100);
    return () => clearInterval(interval);
  }, [getZoom]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.1, duration: 500 });
  }, [fitView]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'f' || event.key === 'F') {
        handleFitView();
      } else if (event.key === '+' || event.key === '=') {
        handleZoomIn();
      } else if (event.key === '-') {
        handleZoomOut();
      } else if (event.key === ' ') {
        event.preventDefault();
        if (workflowState === 'playing') {
          onPauseWorkflow?.();
        } else {
          onPlayWorkflow?.();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleFitView, handleZoomIn, handleZoomOut, workflowState, onPlayWorkflow, onPauseWorkflow]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        selectNodesOnDrag={false}
        className="presentation-view-flow"
        fitView
        fitViewOptions={{ padding: 0.1 }}
      >
        <Background variant={backgroundVariant} gap={20} size={1} />
        
        {showMiniMap && (
          <MiniMap
            nodeColor={(node) => {
              const nodeData = node.data as { backgroundColor?: string };
              return nodeData?.backgroundColor || '#ffffff';
            }}
            position="bottom-left"
            pannable
            zoomable
            className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg"
          />
        )}
        
        <Controls 
          position="bottom-right"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg"
        />

        {/* Top Control Panel */}
        <Panel position="top-center" className="presentation-control-panel">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-4 py-2">
            <div className="flex items-center space-x-4">
              {/* Workflow Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={onPlayWorkflow}
                  disabled={workflowState === 'playing'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    workflowState === 'playing'
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                  title="Play Workflow (Space)"
                >
                  {workflowState === 'playing' ? (
                    <div className="w-5 h-5 animate-spin">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                <button
                  onClick={onPauseWorkflow}
                  disabled={workflowState !== 'playing'}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    workflowState !== 'playing'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                  }`}
                  title="Pause Workflow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                </button>

                <button
                  onClick={onRestartWorkflow}
                  className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                  title="Restart Workflow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <button
                  onClick={onDebugWorkflow}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    workflowState === 'debugging'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-100 hover:bg-red-200 text-red-700'
                  }`}
                  title="Debug Workflow"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300" />

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFitView}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-all"
                  title="Fit View (F)"
                >
                  Fit View
                </button>

                <button
                  onClick={handleZoomOut}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center transition-all"
                  title="Zoom Out (-)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>

                <span className="text-sm text-gray-600 font-mono min-w-[4rem] text-center">
                  {currentZoom}%
                </span>

                <button
                  onClick={handleZoomIn}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center transition-all"
                  title="Zoom In (+)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300" />

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  workflowState === 'playing' ? 'bg-green-500 animate-pulse' :
                  workflowState === 'paused' ? 'bg-orange-500' :
                  workflowState === 'debugging' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600 capitalize">
                  {workflowState}
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Close Button */}
        <Panel position="top-right" className="presentation-close-panel">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 flex items-center justify-center transition-all"
            title="Close Presentation (Escape)"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Panel>

        {/* Keyboard Shortcuts Help */}
        <Panel position="bottom-left" className="presentation-help-panel">
          <div className="bg-black/80 text-white text-xs rounded-lg p-2 max-w-xs">
            <div className="font-semibold mb-1">Keyboard Shortcuts</div>
            <div className="space-y-0.5 text-gray-300">
              <div>Space: Play/Pause</div>
              <div>F: Fit View</div>
              <div>+/-: Zoom In/Out</div>
              <div>Esc: Close</div>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function PresentationView({
  isOpen,
  onClose,
  nodes,
  edges,
  backgroundVariant,
  showMiniMap,
  workflowState,
  onPlayWorkflow,
  onPauseWorkflow,
  onRestartWorkflow,
  onDebugWorkflow,
}: PresentationViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="w-full h-full">
        <ReactFlowProvider>
          <PresentationViewContent
            nodes={nodes}
            edges={edges}
            backgroundVariant={backgroundVariant}
            showMiniMap={showMiniMap}
            workflowState={workflowState}
            onPlayWorkflow={onPlayWorkflow}
            onPauseWorkflow={onPauseWorkflow}
            onRestartWorkflow={onRestartWorkflow}
            onDebugWorkflow={onDebugWorkflow}
            onClose={onClose}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
