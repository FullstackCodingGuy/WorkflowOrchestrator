// Application-wide configuration and constants

// ============================================================================
// CENTRALIZED DEFAULT STYLES CONFIGURATION
// ============================================================================

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

export const NODE_DIMENSIONS = {
  defaultWidth: 200,
  defaultHeight: 80,
  startEndHeight: 70,
  conditionHeight: 90,
  wideWidth: 250,
  minNodeSeparation: 140,
  minRankSeparation: 180,
  maxNodeSeparation: 220,
  maxRankSeparation: 280,
  layoutMargin: 60,
};

export const STORAGE_KEYS = {
  diagram: 'uml_diagram_data',
  settings: 'uml_app_settings',
  panelState: 'uml_panel_state',
};

// Add more config as needed
