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
};

export const ANIMATION = {
  dotDuration: '2s', // SVG animateMotion duration
  dotRepeatCount: 'indefinite',
  dotRadius: 9,
};

export const STORAGE_KEYS = {
  workflow: 'reactflow_workflow',
  settings: 'workflow_app_settings',
  panelState: 'workflow_panel_state',
};

// Add more config as needed
