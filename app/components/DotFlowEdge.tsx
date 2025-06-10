import React from 'react';
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

  return (
    <>
      {/* The main visible edge path, rendered by BaseEdge */}
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />

      {/* Invisible path for the animateMotion to follow.
          This MUST be rendered for the animation to work.
          It has the same geometry as the visible edge.
      */}
      <path
        id={motionPathId}
        d={edgePath}
        style={{ fill: 'none', stroke: 'none' }} // Ensure path is invisible
      />

      {/* The animating circle */}
      <circle r="9" fill={style.stroke || 'var(--primary)'} > {/* Use edge's stroke color or fallback */}
        <animateMotion
          dur="2s" // Duration of one loop
          repeatCount="indefinite"
          keyPoints="0;1" 
          keyTimes="0;1"
          calcMode="paced" // Ensures constant speed along the path
        >
          <mpath xlinkHref={`#${motionPathId}`} />
        </animateMotion>
      </circle>
    </>
  );
}
