'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import useWorkflowStore from '../store/workflowStore';
import styles from './PresentationEditor.module.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define types for slide elements
interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'workflow-node' | 'shape';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  style?: React.CSSProperties;
}

// Define types for slides, layouts, and animations
interface Slide {
  id: string;
  content: React.ReactNode | string;
  layout: string;
  animation: string;
  nodeId?: string;
  elements?: SlideElement[];
}

interface PresentationEditorProps {
  onClose: () => void;
}

// Sortable slide item component
function SortableSlideItem({ slide, index, nodes, selectedSlideId, onSelect, onDelete }: {
  slide: Slide;
  index: number;
  nodes: Array<{ id: string; data: { label?: string }; type?: string }>;
  selectedSlideId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(slide.id)}
      className={`${selectedSlideId === slide.id ? styles.selectedSlideItem : styles.slideItem} ${isDragging ? styles.draggingSlideItem : ''}`}
    >
      <span>
        Slide {index + 1} {slide.nodeId ? `(${nodes.find(n=>n.id === slide.nodeId)?.data.label || 'Node'})` : '(Custom)'}
      </span>
      <button 
        onClick={(e) => { 
          e.stopPropagation();
          onDelete(slide.id);
        }} 
        className={styles.deleteSlideButton}
        aria-label="Delete slide"
      >
        X
      </button>
    </li>
  );
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({ onClose }) => {
  const { nodes } = useWorkflowStore();
  const revealEditRef = useRef<HTMLDivElement>(null);
  const [revealInstance, setRevealInstance] = useState<Reveal.Api | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Available layouts and animations
  const availableLayouts = [
    { id: 'default', name: 'Default' },
    { id: 'title-slide', name: 'Title Slide' },
    { id: 'content-left-image-right', name: 'Content Left, Image Right' },
    { id: 'full-image', name: 'Full Image' },
    { id: 'two-column', name: 'Two Column' },
  ];

  const availableAnimations = [
    { id: 'slide', name: 'Slide' },
    { id: 'fade', name: 'Fade' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'convex', name: 'Convex' },
    { id: 'concave', name: 'Concave' },
  ];

  const availableElements = [
    { id: 'text', name: 'Text Box', icon: '📝' },
    { id: 'image', name: 'Image', icon: '🖼️' },
    { id: 'workflow-node', name: 'Workflow Node', icon: '🔗' },
    { id: 'shape', name: 'Shape', icon: '🔵' },
  ];

  useEffect(() => {
    if (revealEditRef.current && !revealInstance) {
      const deck = new Reveal(revealEditRef.current, {
        controls: true,
        progress: true,
        center: true,
        hash: false, // Disable hash to prevent URL changes during editing
        embedded: true, // Important for editor integration
        width: '100%',
        height: '100%',
        margin: 0.1,
        // We might want to disable some navigation during editing
        // keyboard: false, 
        // touch: false,
      });
      deck.initialize().then(() => {
        setRevealInstance(deck);
      });
    }

    // Cleanup
    return () => {
      // Reveal.js doesn't have a straightforward destroy method for embedded instances.
      // We might need to manually clean up if issues arise.
    };
  }, [revealEditRef, revealInstance]);

  // Initialize slides from workflow nodes (similar to RevealEditor)
  useEffect(() => {
    const initialSlides: Slide[] = nodes.map((node, index) => ({
      id: `slide-${node.id}-${index}`,
      content: (
        <>
          <h2>{node.data.label || 'Unnamed Node'}</h2>
          <p>Type: {node.type}</p>
          {/* Basic node visualization */}
          <div style={{ 
            padding: '10px', 
            backgroundColor: node.data.backgroundColor || '#eee', 
            color: node.data.fontColor || '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {node.data.label}
          </div>
        </>
      ),
      layout: 'default',
      animation: 'slide',
      nodeId: node.id,
    }));
    setSlides(initialSlides);
  }, [nodes]);

  // Update Reveal.js when slides change
   useEffect(() => {
    if (revealInstance) { // Check if revealInstance is initialized
      // Ensure slides are loaded into Reveal.js
      // This might need a more robust way to update Reveal.js if slides change frequently
      // or if content is complex. For now, sync should re-evaluate slide attributes.
      revealInstance.sync();
      
      // If a slide was selected, try to navigate to it
      if (selectedSlideId) {
        const slideIndex = slides.findIndex(s => s.id === selectedSlideId);
        if (slideIndex !== -1 && revealInstance.getSlide(slideIndex)) {
          revealInstance.slide(slideIndex);
        }
      } else if (slides.length > 0 && revealInstance.getSlide(0)) {
        // If no slide is selected but slides exist, go to the first slide
        revealInstance.slide(0);
      }
    }
  }, [slides, revealInstance, selectedSlideId]);


  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-custom-${Date.now()}`,
      content: '<h2>New Slide</h2><p>Edit this content.</p>',
      layout: 'default',
      animation: 'slide',
    };
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (slideId: string) => {
    setSlides(slides.filter(s => s.id !== slideId));
    if (selectedSlideId === slideId) {
      setSelectedSlideId(null);
      setEditingContent(''); // Clear editing content
    }
  };

  const handleSelectSlide = (slideId: string) => {
    setSelectedSlideId(slideId);
    const slideIndex = slides.findIndex(s => s.id === slideId);
    if (revealInstance && slideIndex !== -1) {
      revealInstance.slide(slideIndex);
    }
    // Load content for editing
    const currentSlide = slides.find(s => s.id === slideId);
    if (currentSlide && typeof currentSlide.content === 'string') {
      setEditingContent(currentSlide.content);
    } else if (currentSlide && typeof currentSlide.content !== 'string') {
      // For JSX content, we might need a different approach or a serializer
      setEditingContent('JSX content is not directly editable in textarea.');
    } else {
      setEditingContent('');
    }
  };
  
  // Drag-and-drop reordering for slides using @dnd-kit
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Placeholder for updating slide properties (layout, animation, content)
  const handleUpdateSlide = (updatedSlide: Partial<Slide> & { id: string }) => {
    setSlides(slides.map(s => s.id === updatedSlide.id ? { ...s, ...updatedSlide } : s));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingContent(e.target.value);
    if (selectedSlideId) {
      handleUpdateSlide({ id: selectedSlideId, content: e.target.value });
    }
  };

  // Element management functions
  const handleAddElement = (elementType: string, slideId: string) => {
    const newElement: SlideElement = {
      id: `element-${Date.now()}`,
      type: elementType as SlideElement['type'],
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      content: getDefaultContent(elementType),
      style: getDefaultStyle(elementType),
    };

    const slide = slides.find(s => s.id === slideId);
    if (slide) {
      const updatedSlide = {
        ...slide,
        elements: [...(slide.elements || []), newElement],
      };
      handleUpdateSlide(updatedSlide);
    }
  };

  const getDefaultContent = (elementType: string): string => {
    switch (elementType) {
      case 'text':
        return 'Click to edit text';
      case 'image':
        return 'https://via.placeholder.com/200x100';
      case 'workflow-node':
        return 'Workflow Node';
      case 'shape':
        return 'Shape';
      default:
        return 'Element';
    }
  };

  const getDefaultStyle = (elementType: string): React.CSSProperties => {
    switch (elementType) {
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: '#333',
          fontSize: '16px',
          padding: '10px',
          textAlign: 'center',
        };
      case 'image':
        return {
          objectFit: 'cover',
        };
      case 'workflow-node':
        return {
          backgroundColor: '#e3f2fd',
          border: '2px solid #2196f3',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
        };
      case 'shape':
        return {
          backgroundColor: '#f3e5f5',
          border: '2px solid #9c27b0',
          borderRadius: '50%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      default:
        return {};
    }
  };

  const handleUpdateElement = (elementId: string, updates: Partial<SlideElement>) => {
    if (selectedSlideId) {
      const slide = slides.find(s => s.id === selectedSlideId);
      if (slide && slide.elements) {
        const updatedElements = slide.elements.map(el =>
          el.id === elementId ? { ...el, ...updates } : el
        );
        handleUpdateSlide({ id: selectedSlideId, elements: updatedElements });
      }
    }
  };

  const handleDeleteElement = (elementId: string) => {
    if (selectedSlideId) {
      const slide = slides.find(s => s.id === selectedSlideId);
      if (slide && slide.elements) {
        const updatedElements = slide.elements.filter(el => el.id !== elementId);
        handleUpdateSlide({ id: selectedSlideId, elements: updatedElements });
        if (selectedElementId === elementId) {
          setSelectedElementId(null);
        }
      }
    }
  };

  // Drag and drop handlers for elements
  const handleElementDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/element-type', elementType);
  };

  const handleElementDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('application/element-type');
    if (elementType && selectedSlideId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newElement: SlideElement = {
        id: `element-${Date.now()}`,
        type: elementType as SlideElement['type'],
        position: { x, y },
        size: { width: 200, height: 100 },
        content: getDefaultContent(elementType),
        style: getDefaultStyle(elementType),
      };

      const slide = slides.find(s => s.id === selectedSlideId);
      if (slide) {
        const updatedSlide = {
          ...slide,
          elements: [...(slide.elements || []), newElement],
        };
        handleUpdateSlide(updatedSlide);
      }
    }
    setDropZoneActive(false);
  };

  const handleElementDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(true);
  };

  const handleElementDragLeave = () => {
    setDropZoneActive(false);
  };

  // Render slide elements
  const renderSlideElements = (slide: Slide) => {
    if (!slide.elements || slide.elements.length === 0) return null;

    return slide.elements.map(element => (
      <div
        key={element.id}
        className={`${styles.slideElement} ${selectedElementId === element.id ? styles.selected : ''}`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          ...element.style,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElementId(element.id);
        }}
      >
        {element.type === 'text' && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              handleUpdateElement(element.id, { content: e.target.textContent || '' });
            }}
          >
            {element.content}
          </div>
        )}
        {element.type === 'image' && (
          <Image
            src={element.content}
            alt="Slide element"
            width={element.size.width}
            height={element.size.height}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {element.type === 'workflow-node' && (
          <div>{element.content}</div>
        )}
        {element.type === 'shape' && (
          <div>{element.content}</div>
        )}
        {selectedElementId === element.id && (
          <>
            <div className={styles.elementResizeHandle} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteElement(element.id);
              }}
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 20,
                height: 20,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </>
        )}
      </div>
    ));
  };


  // Export presentation as JSON
  const handleExportPresentation = () => {
    const presentationData = {
      slides,
      metadata: {
        title: 'Workflow Presentation',
        created: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(presentationData, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'presentation.json';
    link.click();
  };

  // Import presentation from JSON
  const handleImportPresentation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData && importedData.slides) {
            setSlides(importedData.slides);
            alert('Presentation imported successfully!');
          } else {
            alert('Invalid presentation file format.');
          }
        } catch (error) {
          console.error('Error parsing imported JSON:', error);
          alert('Failed to import presentation. Ensure the file is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Start full-screen presentation mode
  const handleStartPresentation = () => {
    if (revealInstance) {
      // Go to first slide and enter full-screen mode
      revealInstance.slide(0);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <h3>Visual Presentation Editor</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleStartPresentation} className={styles.sidebarButton}>
            ▶ Present
          </button>
          <button onClick={handleExportPresentation} className={styles.sidebarButton}>
            📥 Export
          </button>
          <label>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportPresentation}
            />
            <span className={styles.sidebarButton} style={{ cursor: 'pointer', display: 'inline-block' }}>
              📤 Import
            </span>
          </label>
          <button onClick={onClose} className={styles.closeButton}>
            ✕ Close
          </button>
        </div>
      </div>

      <div className={styles.mainArea}>
        {/* Sidebar for slide list, properties, elements */}
        <div className={styles.sidebar}>
          <h4>Slides</h4>
          <button onClick={handleAddSlide} className={styles.sidebarButton}>Add Slide</button>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={slides} strategy={verticalListSortingStrategy}>
              <ul className={styles.slideList}>
                {slides.map((slide, index) => (
                  <SortableSlideItem
                    key={slide.id}
                    slide={slide}
                    index={index}
                    nodes={nodes}
                    selectedSlideId={selectedSlideId}
                    onSelect={handleSelectSlide}
                    onDelete={handleDeleteSlide}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          {/* TODO: Drag and drop reordering for slides */}

          {selectedSlideId && slides.find(s => s.id === selectedSlideId) && (() => {
            const currentSlide = slides.find(s => s.id === selectedSlideId);
            if (!currentSlide) return null;

            return (
              <div className={styles.propertiesPanel}>
                <h4>Slide Properties</h4>
                <p>ID: {selectedSlideId}</p>
                {/* Layout Selector */}
                <div>
                  <label htmlFor="layout-select">Layout: </label>
                  <select
                    id="layout-select"
                    value={currentSlide.layout}
                    onChange={(e) => {
                      handleUpdateSlide({ id: currentSlide.id, layout: e.target.value });
                    }}
                  >
                    {availableLayouts.map(layout => (
                      <option key={layout.id} value={layout.id}>{layout.name}</option>
                    ))}
                  </select>
                </div>
                {/* Animation Selector */}
                <div>
                  <label htmlFor="animation-select">Animation: </label>
                  <select
                    id="animation-select"
                    value={currentSlide.animation}
                    onChange={(e) => {
                      handleUpdateSlide({ id: currentSlide.id, animation: e.target.value });
                    }}
                  >
                    {availableAnimations.map(anim => (
                      <option key={anim.id} value={anim.id}>{anim.name}</option>
                    ))}
                  </select>
                </div>
                {/* Content editor (e.g., textarea or rich text editor) */}
                <div>
                  <label htmlFor="content-editor">Content (HTML/Markdown):</label>
                  <textarea
                    id="content-editor"
                    className={styles.contentTextArea}
                    value={editingContent}
                    onChange={handleContentChange}
                    rows={10}
                    // disabled={typeof currentSlide.content !== 'string'} // Disable if content is JSX
                  />
                  {typeof currentSlide.content !== 'string' && (
                    <p className={styles.jsxWarning}>JSX content is not directly editable here. Convert to HTML/Markdown or edit in code.</p>
                  )}
                </div>
              </div>
            );
          })()}


          <div className={styles.elementSelector}>
            <h4>Elements</h4>
            {availableElements.map(element => (
              <div key={element.id} className={styles.draggableElement}>
                <div
                  draggable
                  onDragStart={(e) => handleElementDragStart(e, element.id)}
                  style={{ cursor: 'grab', marginBottom: '5px' }}
                >
                  <span style={{ marginRight: '8px' }}>{element.icon}</span>
                  {element.name}
                </div>
                {selectedSlideId && (
                  <button
                    onClick={() => handleAddElement(element.id, selectedSlideId)}
                    className={styles.sidebarButton}
                    style={{ fontSize: '0.8em', padding: '4px 8px', marginTop: '5px' }}
                  >
                    Add to Slide
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reveal.js Preview Area */}
        <div className={styles.previewArea}>
          <div className="reveal" ref={revealEditRef}>
            <div className="slides">
              {slides.map((slide) => (
                <section 
                  key={slide.id} 
                  data-transition={slide.animation}
                  data-layout={slide.layout}
                  className={selectedSlideId === slide.id ? 'editing' : ''}
                  onDrop={handleElementDrop}
                  onDragOver={handleElementDragOver}
                  onDragLeave={handleElementDragLeave}
                  style={{ position: 'relative' }}
                >
                  {typeof slide.content === 'string' ? 
                    <div dangerouslySetInnerHTML={{ __html: slide.content }} /> : 
                    slide.content
                  }
                  {selectedSlideId === slide.id && renderSlideElements(slide)}
                  {dropZoneActive && selectedSlideId === slide.id && (
                    <div 
                      className={`${styles.dropZone} ${dropZoneActive ? styles.active : ''}`}
                      style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditor;
