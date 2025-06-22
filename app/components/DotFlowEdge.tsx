import React, { useRef, useEffect, useState } from 'react';
import { EdgeProps, getSmoothStepPath, BaseEdge } from 'reactflow';
import { APP_COLORS } from '../config/appConfig';

export default function DotFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  animated, // Destructure animated prop
  data, // Accept data prop
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Unique ID for the invisible path that animateMotion will follow
  const motionPathId = `motionpath-${id}`;

  const motionRef = useRef<SVGAnimateMotionElement>(null);

  useEffect(() => {
    const node = motionRef.current;
    if (!node) return;
    const handler = () => {
      if (data && typeof data.onEdgeAnimationEnd === 'function') {
        data.onEdgeAnimationEnd(id);
      }
    };
    node.addEventListener('repeatEvent', handler);
    return () => {
      node.removeEventListener('repeatEvent', handler);
    };
  }, [id, data]);

  // Determine edge color based on animation/completed state
  const animatedColor = data?.animatedColor || APP_COLORS.animatedEdge;
  const completedColor = data?.completedColor || APP_COLORS.completedEdge;
  const isCompleted = !!data?.completed;
  const edgeStroke = animated
    ? animatedColor
    : isCompleted
      ? completedColor
      : style.stroke || 'var(--primary)';

  const [arrowType, setArrowType] = useState<'none' | 'arrow' | 'triangle'>('arrow');

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail && e.detail.arrowType) setArrowType(e.detail.arrowType);
    };
    window.addEventListener('edgearrow:update', handler as EventListener);
    return () => window.removeEventListener('edgearrow:update', handler as EventListener);
  }, []);

  // SVG marker definitions
  const markerId = `marker-${arrowType}-${edgeStroke.replace('#', '')}`;
  let markerDef = null;
  if (arrowType === 'arrow') {
    markerDef = (
      <marker id={markerId} markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L10,5 L0,10 Z" fill={edgeStroke} stroke={edgeStroke} />
      </marker>
    );
  } else if (arrowType === 'triangle') {
    markerDef = (
      <marker id={markerId} markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 10,5 0,10" fill={edgeStroke} stroke={edgeStroke} />
      </marker>
    );
  }
  // markerEnd attribute
  const markerEndUrl = arrowType === 'none' ? undefined : `url(#${markerId})`;

  return (
    <>
      <svg style={{ height: 0, width: 0 }}>
        <defs>{markerDef}</defs>
      </svg>
      {/* The main visible edge path, rendered by BaseEdge */}
      <BaseEdge id={id} path={edgePath} markerEnd={markerEndUrl} style={{ ...style, stroke: edgeStroke }} />

      {/* Invisible path for the animateMotion to follow. This MUST be rendered for the animation to work. It has the same geometry as the visible edge. */}
      <path
        id={motionPathId}
        d={edgePath}
        style={{ fill: 'none', stroke: 'none' }} // Ensure path is invisible
      />

      {/* The animating circle, only if animated is true */}
      {animated && (
        <circle r="9" fill={edgeStroke}>
          <animateMotion
            ref={motionRef}
            dur="2s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath xlinkHref={`#${motionPathId}`} />
          </animateMotion>
        </circle>
      )}
    </>
  );
}
