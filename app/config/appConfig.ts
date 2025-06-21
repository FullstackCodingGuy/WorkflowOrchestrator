// Application-wide configuration and constants

export const APP_COLORS = {
  defaultBg: '#f5f5f5',
  defaultEdge: 'var(--primary)',
  animatedEdge: '#6c2bd7', // dark violet
  completedEdge: '#22c55e', // green
  edgeBlack: '#000',
};

export const NODE_DIMENSIONS = {
  defaultWidth: 180,
  defaultHeight: 70,
  startEndHeight: 60,
  conditionHeight: 80,
  wideWidth: 220,
  // Layout spacing configurations
  minNodeSeparation: 120,
  minRankSeparation: 150,
  maxNodeSeparation: 200,
  maxRankSeparation: 250,
  layoutMargin: 50,
};

export const ANIMATION = {
  dotDuration: '2s', // SVG animateMotion duration
  dotRepeatCount: 'indefinite',
  dotRadius: 9,
};

export const VIEWPORT = {
  autoZoomEnabled: true,
  autoZoomPadding: 0.1, // 10% padding around the workflow
  autoZoomMaxZoom: 1.2,
  autoZoomMinZoom: 0.1,
  autoZoomDuration: 800, // Animation duration in ms
  fitViewPadding: 50, // Padding in pixels
};

export const STORAGE_KEYS = {
  workflow: 'reactflow_workflow',
  settings: 'workflow_app_settings',
  panelState: 'workflow_panel_state',
};

// Add more config as needed
