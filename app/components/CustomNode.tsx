import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  properties?: Record<string, unknown>;
  isExecuting?: boolean;
}

export const CustomNode = memo(({ data, selected }: NodeProps<DiagramNodeData>) => {
  const {
    label,
    description,
    color = '#64748b',
    icon = '📋',
    isExecuting = false,
  } = data;

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border-2 min-w-[150px] p-3
        transition-all duration-300 hover:shadow-lg
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
        ${isExecuting ? 'border-blue-400 shadow-xl bg-blue-50 shadow-blue-200/50 scale-[1.02]' : ''}
      `}
      style={{
        borderLeftColor: color,
        borderLeftWidth: '4px',
      }}
    >
      {/* Execution glow effect - positioned absolutely to avoid layout shift */}
      {isExecuting && (
        <div 
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 via-blue-500/30 to-blue-400/20 animate-pulse pointer-events-none"
          style={{ zIndex: -1 }}
        />
      )}
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-gray-400 border-2 border-white shadow-sm"
        style={{ left: '-8px' }}
      />

      {/* Node Content */}
      <div className="flex items-start space-x-2">
        {/* Icon */}
        <div className="text-lg flex-shrink-0 mt-0.5">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="font-semibold text-gray-900 text-sm leading-tight mb-1 flex items-center justify-between">
            <span>{label}</span>
            {isExecuting && (
              <div className="flex items-center text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-1"></div>
                <span className="text-xs font-medium">Running</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="text-xs text-gray-600 leading-relaxed">
              {description}
            </div>
          )}

          {/* Color indicator */}
          <div className="flex items-center mt-2">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: color }}
            />
            <div className="text-xs text-gray-500 truncate">
              {color}
            </div>
          </div>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-gray-400 border-2 border-white shadow-sm"
        style={{ right: '-8px' }}
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
