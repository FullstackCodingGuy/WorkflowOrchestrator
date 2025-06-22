import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface DiagramNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  nodeType?: string;
  properties?: Record<string, unknown>;
  isExecuting?: boolean;
}

export const CustomNode = memo(({ data, selected }: NodeProps<DiagramNodeData>) => {
  const {
    label,
    description,
    color = '#64748b',
    icon = '📋',
    nodeType = 'custom',
    isExecuting = false,
  } = data;

  // Enhanced node type styling
  const getNodeTypeStyles = (type: string) => {
    const styles = {
      start: {
        gradient: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        accent: 'border-l-emerald-500',
        text: 'text-emerald-800',
      },
      process: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        accent: 'border-l-blue-500',
        text: 'text-blue-800',
      },
      decision: {
        gradient: 'from-amber-50 to-amber-100',
        border: 'border-amber-200',
        accent: 'border-l-amber-500',
        text: 'text-amber-800',
      },
      condition: {
        gradient: 'from-violet-50 to-violet-100',
        border: 'border-violet-200',
        accent: 'border-l-violet-500',
        text: 'text-violet-800',
      },
      action: {
        gradient: 'from-cyan-50 to-cyan-100',
        border: 'border-cyan-200',
        accent: 'border-l-cyan-500',
        text: 'text-cyan-800',
      },
      end: {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200',
        accent: 'border-l-red-500',
        text: 'text-red-800',
      },
      custom: {
        gradient: 'from-slate-50 to-slate-100',
        border: 'border-slate-200',
        accent: 'border-l-slate-500',
        text: 'text-slate-800',
      },
    };
    return styles[type as keyof typeof styles] || styles.custom;
  };

  const nodeStyles = getNodeTypeStyles(nodeType);

  return (
    <div
      className={`
        relative bg-gradient-to-br ${nodeStyles.gradient}
        rounded-xl shadow-lg border-2 min-w-[180px] p-4
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        backdrop-blur-sm
        ${selected ? 'border-indigo-400 shadow-indigo-200/50 shadow-xl ring-2 ring-indigo-200' : nodeStyles.border}
        ${isExecuting ? 'border-indigo-400 shadow-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-indigo-300/60 scale-[1.04]' : ''}
        ${nodeStyles.accent} border-l-4
      `}
    >
      {/* Enhanced execution glow effect */}
      {isExecuting && (
        <>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/10 via-indigo-500/20 to-indigo-400/10 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 rounded-xl border-2 border-indigo-400/50 animate-ping pointer-events-none" />
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
          <div className={`font-bold ${nodeStyles.text} text-base leading-tight mb-2 flex items-center justify-between`}>
            <span className="truncate">{label}</span>
            {isExecuting && (
              <div className="flex items-center text-indigo-600 ml-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-xs font-semibold ml-1.5">Active</span>
              </div>
            )}
          </div>

          {/* Enhanced Description */}
          {description && (
            <div className="text-sm text-slate-600 leading-relaxed mb-3 font-medium">
              {description}
            </div>
          )}

          {/* Enhanced Color indicator with type badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <div className="text-xs text-slate-500 font-medium">
                {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
              </div>
            </div>
            
            {/* Node type badge */}
            <div className={`
              px-2 py-0.5 rounded-full text-xs font-semibold 
              ${nodeStyles.gradient} ${nodeStyles.border} border
            `}>
              {nodeType}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced selected indicator */}
      {selected && (
        <>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
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

CustomNode.displayName = 'CustomNode';
