'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import useWorkflowStore from '../store/workflowStore';
import { Node, Edge } from 'reactflow';
import styles from './RevealEditor.module.css';

interface RevealEditorProps {
  onClose: () => void;
}

const RevealEditor: React.FC<RevealEditorProps> = ({ onClose }) => {
  const { nodes, edges } = useWorkflowStore();
  const revealRef = useRef<HTMLDivElement>(null);
  const [revealInstance, setRevealInstance] = useState<any>(null);
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
  const [visitedEdges, setVisitedEdges] = useState<Set<string>>(new Set());
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStep, setSimulationStep] = useState(0);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Find start nodes in the workflow
  const startNodes = useMemo(() => {
    return nodes.filter(node => node.type === 'start');
  }, [nodes]);
  
  // Helper function to get node by id
  const getNodeById = (id: string) => {
    return nodes.find(node => node.id === id);
  };
  
  // Helper function to get node label
  const getNodeLabel = (id: string) => {
    const node = getNodeById(id);
    return node?.data?.label || 'Unknown Node';
  };
  
  // Get outgoing edges for a node
  const getOutgoingEdges = (nodeId: string) => {
    return edges.filter(edge => edge.source === nodeId);
  };
  
  // Get the next node in the workflow
  const getNextNode = (currentNodeId: string) => {
    const outEdges = getOutgoingEdges(currentNodeId);
    // Simple implementation - take the first outgoing edge
    // A more sophisticated version could handle conditions, branching, etc.
    if (outEdges.length > 0) {
      return outEdges[0].target;
    }
    return null;
  };
  
  // Simulation handlers
  const handleStartSimulation = () => {
    // Reset simulation state
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    setSimulationProgress(0);
    setSimulationStep(0);
    
    // Start with a start node if available
    if (startNodes.length > 0) {
      const firstStartNode = startNodes[0];
      setCurrentNodeId(firstStartNode.id);
      setVisitedNodes(new Set([firstStartNode.id]));
      setSimulationStep(1);
      
      // Start the simulation interval
      simulationInterval.current = setInterval(() => {
        setSimulationStep(step => {
          const newStep = step + 1;
          // Calculate progress based on total nodes
          const progress = Math.min((newStep / (nodes.length * 2)) * 100, 100);
          setSimulationProgress(progress);
          return newStep;
        });
        
        setCurrentNodeId(currId => {
          if (currId) {
            // Get next node
            const nextNodeId = getNextNode(currId);
            
            if (nextNodeId) {
              // Mark the edge as visited
              const edge = edges.find(e => e.source === currId && e.target === nextNodeId);
              if (edge) {
                setVisitedEdges(prev => new Set([...prev, edge.id]));
              }
              
              // Mark the node as visited
              setVisitedNodes(prev => new Set([...prev, nextNodeId]));
              
              return nextNodeId;
            } else {
              // End of workflow reached
              handleStopSimulation();
            }
          }
          return currId;
        });
      }, 1000); // Update every 1 second
      
      setIsSimulating(true);
    } else {
      alert("No start nodes found in the workflow!");
    }
  };
  
  const handleStopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setIsSimulating(false);
  };
  
  // Cleanup simulation on component unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);
  
  // Initialize Reveal.js
  useEffect(() => {
    if (revealRef.current) {
      const deck = new Reveal(revealRef.current, {
        controls: true,
        progress: true,
        center: true,
        hash: false,
        transition: 'slide',
        // Additional configuration options
        width: '100%',
        height: '100%',
        margin: 0.1,
      });

      deck.initialize().then(() => {
        setRevealInstance(deck);
      });

      return () => {
        // Cleanup if necessary
        if (deck) {
          // No built-in destroy method, but we can clean up if needed
        }
      };
    }
  }, []);    // Generate slides based on workflow nodes
  const generateNodeSlides = () => {
    const slideContent: React.ReactNode[] = [];
    
    // Title slide
    slideContent.push(
      <section key="title" data-transition="zoom">
        <h1>Workflow Visualization</h1>
        <h3>Interactive workflow presentation</h3>
      </section>
    );
    
    // Overview slide
    slideContent.push(
      <section key="overview" data-transition="slide">
        <h2>Workflow Overview</h2>
        <div className="workflow-stats">
          <p><strong>Nodes:</strong> {nodes.length}</p>
          <p><strong>Connections:</strong> {edges.length}</p>
          <p><strong>Start Nodes:</strong> {nodes.filter(node => node.type === 'start').length}</p>
          <p><strong>End Nodes:</strong> {nodes.filter(node => node.type === 'end').length}</p>
        </div>
      </section>
    );
    
    // Create a slide for each node
    nodes.forEach((node: Node) => {
      const incomingEdges = edges.filter((edge: Edge) => edge.target === node.id);
      const outgoingEdges = edges.filter((edge: Edge) => edge.source === node.id);
      
      slideContent.push(
        <section key={node.id} data-transition="slide">
          <h2>{node.data.label || 'Unnamed Node'}</h2>
          <div className="node-details">
            <p><strong>Type:</strong> {node.type}</p>
            <p><strong>ID:</strong> {node.id}</p>
            <p><strong>Incoming connections:</strong> {incomingEdges.length}</p>
            <p><strong>Outgoing connections:</strong> {outgoingEdges.length}</p>
          </div>
          <div className="node-visualization">
            {/* A visualization of the node using the same styling as in the canvas */}
            <div className={`node-preview node-type-${node.type}`} 
                 style={{ 
                   backgroundColor: node.data.backgroundColor || '#f5f5f5',
                   color: node.data.fontColor || '#000',
                   padding: '15px', 
                   borderRadius: '4px',
                   width: '180px',
                   margin: '0 auto' 
                 }}>
              {node.data.label}
            </div>
          </div>
        </section>
      );
    });
    
    // Flow execution slide
    slideContent.push(
      <section key="execution" data-transition="slide">
        <h2>Workflow Execution</h2>
        <p>Watch the workflow execution step by step</p>
        <div className={styles.simulationControls}>
          <button className={styles.controlButton}
                  onClick={isSimulating ? handleStopSimulation : handleStartSimulation}>
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          {isSimulating && (
            <div className={styles.simulationStatus}>
              <p>Current Node: <strong>{currentNodeId ? getNodeLabel(currentNodeId) : 'None'}</strong></p>
              <div className={styles.simulationProgress}>
                <div 
                  className={styles.simulationProgressBar} 
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.simulationContainer}>
          {renderSimulationView()}
        </div>
      </section>
    );
    
    return slideContent;
  };

  // Render the simulation view
  const renderSimulationView = () => {
    if (!isSimulating) {
      return (
        <div className={styles.placeholderSimulation}>
          <p>Click &apos;Start Simulation&apos; to begin</p>
        </div>
      );
    }
    
    return (
      <div className={styles.simulationView}>
        <svg width="100%" height="300" className={styles.simulationSvg}>
          {/* Render nodes */}
          {nodes.map(node => {
            const isActive = node.id === currentNodeId;
            const isVisited = visitedNodes.has(node.id);
            
            // Calculate a reasonable position for visualization
            // This is simplified - you might want to use actual node positions scaled to fit
            const nodeIndex = nodes.indexOf(node);
            const x = 80 + (nodeIndex * 120) % 600;
            const y = 80 + Math.floor((nodeIndex * 120) / 600) * 80;
            
            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 25 : 20}
                  fill={
                    isActive 
                      ? '#4CAF50' 
                      : isVisited 
                        ? '#2196F3' 
                        : '#E0E0E0'
                  }
                  stroke={isActive ? '#2E7D32' : isVisited ? '#0D47A1' : '#9E9E9E'}
                  strokeWidth="2"
                  className={isActive ? styles.pulsingNode : ''}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#000000"
                  fontSize="10px"
                >
                  {node.data.label.substring(0, 10)}
                </text>
              </g>
            );
          })}
          
          {/* Render edges */}
          {edges.map(edge => {
            const sourceNode = getNodeById(edge.source);
            const targetNode = getNodeById(edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            // Calculate positions (same logic as nodes above)
            const sourceIndex = nodes.indexOf(sourceNode);
            const targetIndex = nodes.indexOf(targetNode);
            const sourceX = 80 + (sourceIndex * 120) % 600;
            const sourceY = 80 + Math.floor((sourceIndex * 120) / 600) * 80;
            const targetX = 80 + (targetIndex * 120) % 600;
            const targetY = 80 + Math.floor((targetIndex * 120) / 600) * 80;
            
            const isVisited = visitedEdges.has(edge.id);
            
            return (
              <line
                key={edge.id}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke={isVisited ? '#2196F3' : '#9E9E9E'}
                strokeWidth={isVisited ? 2 : 1}
                strokeDasharray={isVisited ? '0' : '4'}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Workflow Presentation Editor</h2>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
      
      <div className={styles.editControls}>
        <button 
          className={styles.controlButton} 
          onClick={() => revealInstance?.prev()}
          disabled={!revealInstance}
        >
          Previous Slide
        </button>
        <button 
          className={styles.controlButton} 
          onClick={() => revealInstance?.next()}
          disabled={!revealInstance}
        >
          Next Slide
        </button>
        <button 
          className={styles.controlButton} 
          onClick={() => {
            if (revealInstance) {
              revealInstance.toggleOverview();
            }
          }}
          disabled={!revealInstance}
        >
          Toggle Overview
        </button>
      </div>
      
      <div className={styles.revealContainer}>
        <div className="reveal" ref={revealRef}>
          <div className="slides">
            {generateNodeSlides()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevealEditor;
