import React, { useRef, useEffect } from 'react';
import { EdgeProps, getSmoothStepPath, BaseEdge } from 'reactflow';

export default function DotFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
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
  const animatedColor = data?.animatedColor || '#6c2bd7'; // dark violet
  const completedColor = data?.completedColor || '#22c55e'; // green
  const isCompleted = !!data?.completed;
  const edgeStroke = animated
    ? animatedColor
    : isCompleted
      ? completedColor
      : style.stroke || 'var(--primary)';

  return (
    <>
      {/* The main visible edge path, rendered by BaseEdge */}
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: edgeStroke }} />

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
