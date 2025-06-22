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

  // Get styling properties from data
  const edgeColor = data?.color || '#6366f1'; // Modern indigo instead of gray
  const isAnimated = data?.animated ?? false;
  const strokeWidth = data?.strokeWidth || 3; // Increased for better visibility
  const strokeStyle = data?.strokeStyle || 'solid';
  const animationSpeed = data?.animationSpeed || 'normal';
  const markerEndType = data?.markerEnd || 'arrow';

  // Animation duration based on speed
  const animationDurations = {
    slow: '4s',
    normal: '2.5s',
    fast: '1.5s'
  };
  const animationDuration = animationDurations[animationSpeed as keyof typeof animationDurations] || '2.5s';

  // Enhanced stroke dash arrays
  const strokeDashArrays = {
    solid: 'none',
    dashed: '12,6',
    dotted: '3,3'
  };
  const strokeDashArray = strokeDashArrays[strokeStyle as keyof typeof strokeDashArrays] || 'none';

  return (
    <>
      <defs>
        {/* Enhanced gradient definition with smoother transitions */}
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={edgeColor} stopOpacity="0.3" />
          <stop offset="25%" stopColor={edgeColor} stopOpacity="0.7" />
          <stop offset="50%" stopColor={edgeColor} stopOpacity="1" />
          <stop offset="75%" stopColor={edgeColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={edgeColor} stopOpacity="0.3" />
          {isAnimated && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-150,0;150,0;-150,0"
              dur={animationDuration}
              repeatCount="indefinite"
            />
          )}
        </linearGradient>

        {/* Enhanced glow effect */}
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Path for the motion animation */}
        <path
          id={pathId}
          d={edgePath}
          fill="none"
          stroke="none"
        />
      </defs>

      {/* Enhanced main edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEndType !== 'none' ? markerEnd : undefined}
        style={{
          ...style,
          stroke: isAnimated ? `url(#${gradientId})` : edgeColor,
          strokeWidth: strokeWidth,
          strokeDasharray: selected ? '8,4' : strokeDashArray,
          filter: isAnimated || selected ? `url(#glow-${id})` : 'none',
          transition: 'all 0.3s ease-in-out',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
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
            dur={animationDuration}
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
