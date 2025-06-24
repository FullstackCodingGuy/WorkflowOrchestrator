import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { getNodeTypeStyles, DEFAULT_NODE_STYLES } from '../config/appConfig';

interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  maxWidth?: number;
  icon?: string;
  nodeType?: string;
  properties?: Record<string, unknown>;
  isExecuting?: boolean;
}

export const WorkflowNode = memo(({ data, selected, id }: NodeProps<DiagramNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get default styles from centralized configuration
  const defaultStyles = getNodeTypeStyles((data.nodeType as 'start' | 'process' | 'action' | 'condition' | 'decision' | 'end' | 'custom') || 'custom');
  
  const {
    label,
    description,
    color = defaultStyles.color,
    backgroundColor = defaultStyles.backgroundColor,
    borderColor = defaultStyles.borderColor,
    textColor = defaultStyles.textColor,
    fontSize = defaultStyles.fontSize,
    fontFamily = defaultStyles.fontFamily,
    fontWeight = defaultStyles.fontWeight,
    textAlign = defaultStyles.textAlign,
    lineHeight = defaultStyles.lineHeight,
    maxWidth = defaultStyles.maxWidth,
    icon = '📋',
    nodeType = 'custom',
    properties = {},
    isExecuting = false,
  } = data;

  // Create dynamic styles from Property Panel data using centralized config
  const dynamicStyles = {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    textAlign: textAlign,
    lineHeight: lineHeight,
    maxWidth: `${maxWidth}px`,
    minWidth: `${DEFAULT_NODE_STYLES.minWidth}px`,
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveEdit = () => {
    if (editValue.trim() !== '') {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: editValue.trim() } }
            : node
        )
      );
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(data.label);
    setIsEditing(false);
  };

  const handleBlur = () => {
    saveEdit();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      className={`
        relative rounded-xl shadow-lg border-2 p-4
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        backdrop-blur-sm
        ${selected ? 'shadow-xl ring-2 ring-indigo-200' : ''}
        ${isExecuting ? 'shadow-2xl scale-[1.04]' : ''}
      `}
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        borderTopColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderRightColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderBottomColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderLeftColor: color, // Always use the primary color for left border
        borderLeftWidth: DEFAULT_NODE_STYLES.borderLeftWidth,
        borderTopWidth: DEFAULT_NODE_STYLES.borderWidth,
        borderRightWidth: DEFAULT_NODE_STYLES.borderWidth,
        borderBottomWidth: DEFAULT_NODE_STYLES.borderWidth,
        maxWidth: dynamicStyles.maxWidth,
        minWidth: dynamicStyles.minWidth,
        color: dynamicStyles.color,
        fontFamily: dynamicStyles.fontFamily,
        fontSize: dynamicStyles.fontSize,
        fontWeight: dynamicStyles.fontWeight,
        textAlign: dynamicStyles.textAlign,
        lineHeight: dynamicStyles.lineHeight,
        ...(isExecuting && {
          borderTopColor: '#6366f1',
          borderRightColor: '#6366f1',
          borderBottomColor: '#6366f1',
          borderLeftColor: '#6366f1',
          backgroundColor: '#f0f9ff',
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
        }),
      }}
    >
      {/* Enhanced execution glow effect */}
      {isExecuting && (
        <>
          <div 
            className="absolute inset-0 rounded-xl animate-pulse pointer-events-none" 
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
          />
          <div 
            className="absolute inset-0 rounded-xl border-2 animate-ping pointer-events-none"
            style={{ borderColor: 'rgba(99, 102, 241, 0.5)' }}
          />
        </>
      )}

      {/* Enhanced Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 transition-all duration-200"
        style={{
          left: '-10px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />

      {/* Node Content */}
      <div className="flex items-start space-x-3">
        {/* Enhanced Icon */}
        <div className="text-2xl flex-shrink-0 mt-1 filter drop-shadow-sm">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Enhanced Title */}
          <div 
            className="font-bold text-base leading-tight mb-2 flex items-center justify-between"
            style={{
              color: dynamicStyles.color,
              fontSize: Math.max(fontSize, 14) + 'px',
              fontFamily: dynamicStyles.fontFamily,
              fontWeight: dynamicStyles.fontWeight,
              textAlign: dynamicStyles.textAlign,
              lineHeight: dynamicStyles.lineHeight,
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="bg-transparent border-none outline-none w-full"
                style={{
                  color: dynamicStyles.color,
                  fontSize: Math.max(fontSize, 14) + 'px',
                  fontFamily: dynamicStyles.fontFamily,
                  fontWeight: dynamicStyles.fontWeight,
                }}
              />
            ) : (
              <span 
                className="truncate cursor-pointer" 
                onDoubleClick={handleDoubleClick}
                title="Double-click to edit"
              >
                {label}
              </span>
            )}
            {isExecuting && (
              <div className="flex items-center ml-2" style={{ color: '#6366f1' }}>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: '#6366f1' }}></div>
                  <div className="absolute inset-0 w-3 h-3 rounded-full" style={{ backgroundColor: '#6366f1' }}></div>
                </div>
                <span className="text-xs font-semibold ml-1.5">Active</span>
              </div>
            )}
          </div>

          {/* Enhanced Description */}
          {description && (
            <div 
              className="text-sm leading-relaxed mb-1.5 font-medium"
              style={{
                color: dynamicStyles.color,
                opacity: 0.8,
                fontSize: Math.max(fontSize - 2, 12) + 'px',
                fontFamily: dynamicStyles.fontFamily,
                textAlign: dynamicStyles.textAlign,
                lineHeight: dynamicStyles.lineHeight,
              }}
            >
              {description}
            </div>
          )}

          {/* Display custom properties if available */}
          <div 
            className="text-xs font-medium mb-2"
            style={{
              color: dynamicStyles.color,
              opacity: 0.6,
              fontSize: Math.max(fontSize - 4, 10) + 'px',
              fontFamily: dynamicStyles.fontFamily,
            }}
          >
            {properties && Object.keys(properties).length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {Object.entries(properties).slice(0, 2).map(([key, value]) => (
                  <span 
                    key={key} 
                    className="px-1.5 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      color: dynamicStyles.color,
                      fontSize: Math.max(fontSize - 4, 10) + 'px',
                    }}
                  >
                    {key}: {String(value).length > 10 ? String(value).substring(0, 10) + '...' : String(value)}
                  </span>
                ))}
                {Object.keys(properties).length > 2 && (
                  <span style={{ color: dynamicStyles.color, opacity: 0.5 }}>
                    +{Object.keys(properties).length - 2} more
                  </span>
                )}
              </div>
            ) : (
              <span style={{ color: dynamicStyles.color, opacity: 0.4, fontStyle: 'italic' }}>
                No custom attributes
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Node type tag with dynamic styling */}
            <div 
              className="px-2 py-0.5 rounded-full text-xs font-semibold border shadow-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderTopColor: dynamicStyles.borderColor,
                borderRightColor: dynamicStyles.borderColor,
                borderBottomColor: dynamicStyles.borderColor,
                borderLeftColor: dynamicStyles.borderColor,
                borderWidth: '1px',
                color: dynamicStyles.color,
                fontSize: Math.max(fontSize - 4, 10) + 'px',
                fontFamily: dynamicStyles.fontFamily,
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2 ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced selected indicator */}
      {selected && (
        <>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" style={{ backgroundColor: '#6366f1' }} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
        </>
      )}

      {/* Enhanced Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 transition-all duration-200"
        style={{
          right: '-10px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
