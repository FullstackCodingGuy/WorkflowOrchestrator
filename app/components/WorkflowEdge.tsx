import React, { useState, useRef, useEffect } from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
} from 'reactflow';
import { getEdgeStyles } from '../config/appConfig';

export function WorkflowEdge({
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
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data?.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Get default styles from centralized configuration
  const defaultStyles = getEdgeStyles();
  
  // Get styling properties from data with proper priority (template data first, then defaults)
  const edgeColor = data?.color || defaultStyles.stroke;
  const isAnimated = data?.animated ?? defaultStyles.animated;
  const strokeWidth = data?.strokeWidth || defaultStyles.strokeWidth;
  const strokeStyle = data?.strokeStyle || 'solid';
  const animationSpeed = data?.animationSpeed || 'normal';
  const markerEndType = data?.markerEnd || 'arrow';
  
  // Typography properties for edge labels - prioritize template data
  const fontSize = data?.fontSize || defaultStyles.labelFontSize;
  const fontFamily = data?.fontFamily || defaultStyles.labelFontFamily;
  const fontWeight = data?.fontWeight || defaultStyles.labelFontWeight;
  const textColor = data?.textColor || '#374151';
  
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data?.label || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveEdit = () => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data, label: editValue.trim() } }
          : edge
      )
    );
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(data?.label || '');
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

      {/* Edge label with inline editing */}
      {(data?.label || isEditing) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: fontSize,
              fontFamily: fontFamily,
              fontWeight: fontWeight,
              color: textColor,
              backgroundColor: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              border: `1px solid ${edgeColor}`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: fontSize,
                  fontFamily: fontFamily,
                  fontWeight: fontWeight,
                  color: textColor,
                  minWidth: '60px',
                }}
              />
            ) : (
              <span
                onDoubleClick={handleDoubleClick}
                style={{ cursor: 'pointer' }}
                title="Double-click to edit"
              >
                {data?.label || 'Label'}
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
