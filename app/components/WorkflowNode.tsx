import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get default styles from centralized configuration
  const defaultStyles = getNodeTypeStyles((data.nodeType as 'start' | 'process' | 'action' | 'condition' | 'decision' | 'end' | 'custom') || 'custom');

  // Dynamic styles
  const dynamicStyles = {
    backgroundColor: data.backgroundColor || defaultStyles.backgroundColor,
    borderColor: data.borderColor || defaultStyles.borderColor,
    color: data.textColor || defaultStyles.textColor,
    fontSize: `${data.fontSize || defaultStyles.fontSize}px`,
    fontFamily: data.fontFamily || defaultStyles.fontFamily,
    fontWeight: data.fontWeight || defaultStyles.fontWeight,
    textAlign: data.textAlign || defaultStyles.textAlign,
    lineHeight: data.lineHeight || defaultStyles.lineHeight,
    maxWidth: `${data.maxWidth || defaultStyles.maxWidth}px`,
    minWidth: `${DEFAULT_NODE_STYLES.minWidth}px`,
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Clear any pending timeout that would hide handles
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Only hide handles after a delay to allow for connection attempts
    connectionTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsConnecting(false);
    }, 200); // 200ms delay
  }, []);

  const handleConnectionStart = useCallback(() => {
    setIsConnecting(true);
    setIsHovered(true);
    // Clear any timeout when starting a connection
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  const handleConnectionEnd = useCallback(() => {
    // Delay hiding handles after connection ends
    connectionTimeoutRef.current = setTimeout(() => {
      setIsConnecting(false);
      setIsHovered(false);
    }, 300);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

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
        ${data.isExecuting ? 'shadow-2xl scale-[1.04]' : ''}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: dynamicStyles.backgroundColor,
        borderTopColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderRightColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderBottomColor: selected ? '#6366f1' : dynamicStyles.borderColor,
        borderLeftColor: data.color || defaultStyles.color, // Always use the primary color for left border
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
        ...(data.isExecuting && {
          borderTopColor: '#6366f1',
          borderRightColor: '#6366f1',
          borderBottomColor: '#6366f1',
          borderLeftColor: '#6366f1',
          backgroundColor: '#f0f9ff',
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
        }),
      }}
    >
      {/* Node Resizer - only show when selected */}
      <NodeResizer
        color="#6366f1"
        isVisible={selected}
        minWidth={180}
        minHeight={80}
        maxWidth={400}
        maxHeight={300}
      />

      {/* Enhanced execution glow effect */}
      {data.isExecuting && (
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

      {/* Enhanced Input Handle - Left */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`w-6 h-6 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 hover:scale-110 transition-all duration-200 ${
          isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
        }`}
        onMouseEnter={handleConnectionStart}
        onMouseLeave={handleConnectionEnd}
        style={{
          left: '2px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Enhanced Input Handle - Top */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`w-6 h-6 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 hover:scale-110 transition-all duration-200 ${
          isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
        }`}
        onMouseEnter={handleConnectionStart}
        onMouseLeave={handleConnectionEnd}
        style={{
          top: '2px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Node Content */}
      <div className="flex items-start space-x-3">
        {/* Enhanced Icon */}
        <div className="text-2xl flex-shrink-0 mt-1 filter drop-shadow-sm">
          {data.icon || '📋'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Enhanced Title */}
          <div 
            className="font-bold text-base leading-tight mb-2 flex items-center justify-between"
            style={{
              color: dynamicStyles.color,
              fontSize: Math.max(data.fontSize || defaultStyles.fontSize, 14) + 'px',
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
                  fontSize: Math.max(data.fontSize || defaultStyles.fontSize, 14) + 'px',
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
                {data.label}
              </span>
            )}
            {data.isExecuting && (
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
          {data.description && (
            <div 
              className="text-sm leading-relaxed mb-1.5 font-medium"
              style={{
                color: dynamicStyles.color,
                opacity: 0.8,
                fontSize: Math.max((data.fontSize || defaultStyles.fontSize) - 2, 12) + 'px',
                fontFamily: dynamicStyles.fontFamily,
                textAlign: dynamicStyles.textAlign,
                lineHeight: dynamicStyles.lineHeight,
              }}
            >
              {data.description}
            </div>
          )}

          {/* Display custom properties if available */}
          <div 
            className="text-xs font-medium mb-2"
            style={{
              color: dynamicStyles.color,
              opacity: 0.6,
              fontSize: Math.max((data.fontSize || defaultStyles.fontSize) - 4, 10) + 'px',
              fontFamily: dynamicStyles.fontFamily,
            }}
          >
            {data.properties && Object.keys(data.properties).length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {Object.entries(data.properties).slice(0, 2).map(([key, value]) => (
                  <span 
                    key={key} 
                    className="px-1.5 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      color: dynamicStyles.color,
                      fontSize: Math.max((data.fontSize || defaultStyles.fontSize) - 4, 10) + 'px',
                    }}
                  >
                    {key}: {String(value).length > 10 ? String(value).substring(0, 10) + '...' : String(value)}
                  </span>
                ))}
                {Object.keys(data.properties).length > 2 && (
                  <span style={{ color: dynamicStyles.color, opacity: 0.5 }}>
                    +{Object.keys(data.properties).length - 2} more
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
                fontSize: Math.max((data.fontSize || defaultStyles.fontSize) - 4, 10) + 'px',
                fontFamily: dynamicStyles.fontFamily,
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2 ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: data.color || defaultStyles.color }}
                />
                {(data.nodeType || 'custom').charAt(0).toUpperCase() + (data.nodeType || 'custom').slice(1)}
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

      {/* Enhanced Output Handle - Right */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-6 h-6 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 hover:scale-110 transition-all duration-200 ${
          isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
        }`}
        onMouseEnter={handleConnectionStart}
        onMouseLeave={handleConnectionEnd}
        style={{
          right: '2px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Enhanced Output Handle - Bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`w-6 h-6 !bg-white border-3 border-slate-300 shadow-lg hover:border-indigo-400 hover:scale-110 transition-all duration-200 ${
          isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
        }`}
        onMouseEnter={handleConnectionStart}
        onMouseLeave={handleConnectionEnd}
        style={{
          bottom: '2px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      />

      {/* Conditional Handles for Decision/Condition Nodes */}
      {(data.nodeType === 'condition' || data.nodeType === 'decision') && (
        <>
          {/* True/Yes Handle - Right */}
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-source-true`}
            className={`w-5 h-5 !bg-green-500 border-2 border-white shadow-lg hover:border-green-300 hover:scale-110 transition-all duration-200 ${
              isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-75 scale-100'
            }`}
            onMouseEnter={handleConnectionStart}
            onMouseLeave={handleConnectionEnd}
            style={{
              right: '2px',
              top: '30%',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
            }}
          />
          
          {/* False/No Handle - Right */}
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-source-false`}
            className={`w-5 h-5 !bg-red-500 border-2 border-white shadow-lg hover:border-red-300 hover:scale-110 transition-all duration-200 ${
              isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-75 scale-100'
            }`}
            onMouseEnter={handleConnectionStart}
            onMouseLeave={handleConnectionEnd}
            style={{
              right: '2px',
              top: '70%',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
            }}
          />

          {/* True/Yes Handle - Bottom */}
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${id}-source-bottom-true`}
            className={`w-5 h-5 !bg-green-500 border-2 border-white shadow-lg hover:border-green-300 hover:scale-110 transition-all duration-200 ${
              isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-75 scale-100'
            }`}
            onMouseEnter={handleConnectionStart}
            onMouseLeave={handleConnectionEnd}
            style={{
              bottom: '2px',
              left: '30%',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
            }}
          />
          
          {/* False/No Handle - Bottom */}
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${id}-source-bottom-false`}
            className={`w-5 h-5 !bg-red-500 border-2 border-white shadow-lg hover:border-red-300 hover:scale-110 transition-all duration-200 ${
              isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-75 scale-100'
            }`}
            onMouseEnter={handleConnectionStart}
            onMouseLeave={handleConnectionEnd}
            style={{
              bottom: '2px',
              left: '70%',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
            }}
          />

          {/* Conditional Labels */}
          <div className={`absolute right-8 top-1/4 transform -translate-y-1/2 text-xs font-medium text-green-600 bg-white px-1 rounded shadow-sm transition-all duration-200 ${
            isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
          }`}>
            Yes
          </div>
          <div className={`absolute right-8 top-3/4 transform -translate-y-1/2 text-xs font-medium text-red-600 bg-white px-1 rounded shadow-sm transition-all duration-200 ${
            isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
          }`}>
            No
          </div>

          <div className={`absolute bottom-8 left-1/4 transform -translate-x-1/2 text-xs font-medium text-green-600 bg-white px-1 rounded shadow-sm transition-all duration-200 ${
            isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
          }`}>
            Yes
          </div>
          <div className={`absolute bottom-8 left-3/4 transform -translate-x-1/2 text-xs font-medium text-red-600 bg-white px-1 rounded shadow-sm transition-all duration-200 ${
            isHovered || isConnecting || selected ? 'opacity-90 scale-100' : 'opacity-70 scale-100'
          }`}>
            No
          </div>
        </>
      )}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

export default WorkflowNode;
