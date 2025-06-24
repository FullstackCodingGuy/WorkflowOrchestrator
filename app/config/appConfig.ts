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

// ============================================================================
// CENTRALIZED DEFAULT STYLES CONFIGURATION
// ============================================================================

/**
 * Default Node Styles - Single source of truth for all node styling
 * Change these values to update the appearance across the entire application
 */
export const DEFAULT_NODE_STYLES = {
  // Typography
  fontSize: 18,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: '600',
  textAlign: 'center' as const,
  lineHeight: 1.5,
  
  // Colors
  backgroundColor: '#ffffff', // Pure white for clean look
  borderColor: '#d1d5db', // Soft gray border
  textColor: '#1f2937', // Dark gray for better contrast
  color: '#6366f1', // Primary accent color
  
  // Dimensions
  maxWidth: 240,
  minWidth: 180,
  
  // Visual enhancements
  borderRadius: '12px',
  borderWidth: '2px',
  borderLeftWidth: '4px', // Emphasis border
  
  // Shadow and effects
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  hoverBoxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  // Spacing
  padding: '16px',
  
  // Transitions
  transition: 'all 300ms ease-in-out',
};

/**
 * Node Type Specific Style Overrides
 * These extend the DEFAULT_NODE_STYLES for specific node types
 */
export const NODE_TYPE_STYLES = {
  start: {
    backgroundColor: '#f0fdf4', // Light green
    textColor: '#065f46', // Dark green
    borderColor: '#bbf7d0',
    color: '#10b981',
  },
  process: {
    backgroundColor: '#eff6ff', // Light blue
    textColor: '#1e40af', // Dark blue
    borderColor: '#bfdbfe',
    color: '#3b82f6',
  },
  action: {
    backgroundColor: '#ecfeff', // Light cyan
    textColor: '#155e75', // Dark cyan
    borderColor: '#a5f3fc',
    color: '#06b6d4',
  },
  condition: {
    backgroundColor: '#f3e8ff', // Light purple
    textColor: '#5b21b6', // Dark purple
    borderColor: '#c4b5fd',
    color: '#8b5cf6',
  },
  decision: {
    backgroundColor: '#fff7ed', // Light orange
    textColor: '#9a3412', // Dark orange
    borderColor: '#fed7aa',
    color: '#ea580c',
  },
  end: {
    backgroundColor: '#fef2f2', // Light red
    textColor: '#991b1b', // Dark red
    borderColor: '#fecaca',
    color: '#dc2626',
  },
  custom: {
    backgroundColor: '#ffffff', // Pure white
    textColor: '#1f2937', // Dark gray
    borderColor: '#d1d5db',
    color: '#64748b',
  },
};

/**
 * Default Edge Styles - Single source of truth for all edge styling
 */
export const DEFAULT_EDGE_STYLES = {
  // Colors
  stroke: '#64748b',
  strokeWidth: 2,
  
  // Label styling
  labelBackgroundColor: '#ffffff',
  labelBorderRadius: '6px',
  labelPadding: '4px 8px',
  labelFontSize: 12,
  labelFontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  labelFontWeight: '500',
  labelTextColor: '#374151',
  labelBorder: '1px solid #d1d5db',
  labelBoxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Animation
  animated: false,
  animationDuration: '2s',
  
  // Edge types
  markerEnd: {
    type: 'arrowclosed',
    width: 20,
    height: 20,
    color: '#64748b',
  },
};

/**
 * Utility function to get complete node styles for a specific type
 */
export const getNodeTypeStyles = (nodeType: keyof typeof NODE_TYPE_STYLES = 'custom') => {
  return {
    ...DEFAULT_NODE_STYLES,
    ...NODE_TYPE_STYLES[nodeType],
  };
};

/**
 * Utility function to get complete edge styles with optional overrides
 */
export const getEdgeStyles = (styleOverrides: Partial<typeof DEFAULT_EDGE_STYLES> = {}) => {
  return {
    ...DEFAULT_EDGE_STYLES,
    ...styleOverrides,
  };
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
