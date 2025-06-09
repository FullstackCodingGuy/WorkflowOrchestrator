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
  console.log(`DotFlowEdge rendering for edge ID: ${id}, style:`, style);

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
          Temporarily made visible for debugging.
      */}
      <path
        id={motionPathId}
        d={edgePath}
        style={{ fill: 'none', stroke: 'rgba(0, 100, 255, 0.7)', strokeWidth: 1, strokeDasharray: '3,3' }} // Debug: make motion path visible
      />

      {/* The animating circle */}
      <circle r="4.5" fill="red" > {/* Debug: hardcoded red fill, slightly larger radius */}
        <animateMotion
          dur="3s" // Duration of one loop
          repeatCount="indefinite"
          keyPoints="0;1" 
          keyTimes="0;1"
          // calcMode="paced" is the default and generally good for path animations
        >
          <mpath xlinkHref={`#${motionPathId}`} />
        </animateMotion>
      </circle>
      
      {/* 
      // Example for EdgeLabelRenderer if labels are needed later
      // import { EdgeLabelRenderer } from 'reactflow'; 
      // const [edgePath, labelX, labelY] = getSmoothStepPath(...); // Ensure labelX, labelY are obtained
      // <EdgeLabelRenderer>
      //   <div
      //     style={{
      //       position: 'absolute',
      //       transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
      //       fontSize: 12,
      //       // backgroundColor: 'rgba(200, 200, 200, 0.7)', // For visibility during debugging
      //       // padding: '2px 4px',
      //       // borderRadius: '3px',
      //       color: 'var(--foreground)', // Ensure label is visible in current theme
      //       pointerEvents: 'all',
      //     }}
      //     className="nodrag nopan"
      //   >
      //     {id} // Example: display edge id as label
      //   </div>
      // </EdgeLabelRenderer> 
      */}
    </>
  );
}
