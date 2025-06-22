// Application-wide configuration and constants

export const APP_COLORS = {
  defaultBg: '#f8fafc',
  defaultEdge: '#64748b',
  animatedEdge: '#6366f1', // Modern indigo
  completedEdge: '#10b981', // Modern emerald
  edgeBlack: '#1e293b',
  
  // Modern gradient color palette
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    warning: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    danger: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    info: 'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
  },
  
  // Enhanced node type colors with better contrast
  nodeTypes: {
    start: '#10b981', // Emerald
    process: '#3b82f6', // Blue
    decision: '#f59e0b', // Amber
    condition: '#8b5cf6', // Violet
    action: '#06b6d4', // Cyan
    end: '#ef4444', // Red
    custom: '#64748b', // Slate
  },
  
  // Edge type colors
  edgeTypes: {
    default: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

export const NODE_DIMENSIONS = {
  defaultWidth: 200, // Increased for better readability
  defaultHeight: 80, // Increased for better spacing
  startEndHeight: 70,
  conditionHeight: 90,
  wideWidth: 250,
  // Layout spacing configurations
  minNodeSeparation: 140,
  minRankSeparation: 180,
  maxNodeSeparation: 220,
  maxRankSeparation: 280,
  layoutMargin: 60,
};

export const ANIMATION = {
  dotDuration: '2.5s', // Slightly slower for better visibility
  dotRepeatCount: 'indefinite',
  dotRadius: 6, // Smaller for cleaner look
  pulseSpeed: '1.5s',
};

export const STYLES = {
  // Enhanced shadows for depth
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Modern border radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  
  // Enhanced transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '400ms ease-in-out',
  }
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
