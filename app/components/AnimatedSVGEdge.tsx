import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';

export function AnimatedSVGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Create unique IDs for the animation elements
  const pathId = `path-${id}`;
  const gradientId = `gradient-${id}`;

  // Get color from data or use default
  const edgeColor = data?.color || '#64748b';
  const isAnimated = data?.animated ?? true;

  return (
    <>
      <defs>
        {/* Gradient definition for animated effect */}
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={edgeColor} stopOpacity="0.2" />
          <stop offset="50%" stopColor={edgeColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={edgeColor} stopOpacity="0.2" />
          {isAnimated && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-100,0;100,0;-100,0"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>

        {/* Path for the motion animation */}
        <path
          id={pathId}
          d={edgePath}
          fill="none"
          stroke="none"
        />
      </defs>

      {/* Main edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isAnimated ? `url(#${gradientId})` : edgeColor,
          strokeWidth: data?.strokeWidth || 2,
          strokeDasharray: selected ? '5,5' : 'none',
        }}
      />

      {/* Animated dot for visual feedback */}
      {isAnimated && (
        <circle
          r="3"
          fill={edgeColor}
          opacity="0.8"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={edgePath}
          />
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Edge label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 500,
              color: edgeColor,
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${edgeColor}`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
