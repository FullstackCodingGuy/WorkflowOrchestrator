'use client';

import React, { useCallback, useRef } from 'react';
import { ReactFlowInstance, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import { DiagramNode, DiagramEdge } from './DiagramEditor';



export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg' | 'pdf' | 'gif';
  quality: number; // 0.1 to 1.0 for JPEG, ignored for PNG/SVG
  width?: number;
  height?: number;
  backgroundColor: string;
  includeWatermark: boolean;
  watermarkText?: string;
  padding: number;
  filename?: string;
}

export class ExportManager {
  private reactFlowInstance: ReactFlowInstance | null;
  private nodes: DiagramNode[];
  private edges: DiagramEdge[];

  constructor(reactFlowInstance: ReactFlowInstance | null, nodes: DiagramNode[], edges: DiagramEdge[]) {
    this.reactFlowInstance = reactFlowInstance;
    this.nodes = nodes;
    this.edges = edges;
  }

  private generateFilename(format: string, prefix: string = 'workflow'): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    return `${prefix}_${timestamp}.${format}`;
  }

  private downloadFile(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  private addWatermark(canvas: HTMLCanvasElement, text: string): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(text, canvas.width - 20, canvas.height - 20);
    ctx.globalAlpha = 1.0;
  }

  private getViewportForNodes(nodes: DiagramNode[], padding: number = 100) {
    if (!this.reactFlowInstance || nodes.length === 0) {
      return { x: 0, y: 0, width: 1024, height: 768, zoom: 1 };
    }

    const nodesBounds = getRectOfNodes(nodes);
    const transform = getTransformForBounds(
      nodesBounds,
      nodesBounds.width + padding * 2,
      nodesBounds.height + padding * 2,
      0.5,
      2
    );

    return {
      x: transform[0],
      y: transform[1],
      width: nodesBounds.width + padding * 2,
      height: nodesBounds.height + padding * 2,
      zoom: transform[2],
    };
  }

  async exportAsImage(options: ExportOptions): Promise<void> {
    if (!this.reactFlowInstance) {
      throw new Error('ReactFlow instance not available');
    }

    const { format, quality, backgroundColor, includeWatermark, watermarkText, padding, filename } = options;
    
    try {
      // Get the ReactFlow wrapper element
      const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
      if (!reactFlowWrapper) {
        throw new Error('ReactFlow wrapper not found');
      }

      // Calculate viewport for all nodes
      const viewport = this.getViewportForNodes(this.nodes, padding);

      // Configure export options
      const exportOptions = {
        backgroundColor,
        width: options.width || viewport.width,
        height: options.height || viewport.height,
        quality: format === 'jpeg' ? quality : 1,
        pixelRatio: 2, // High DPI for better quality
        style: {
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      };

      let dataUrl: string;

      // Export based on format
      switch (format) {
        case 'png':
          dataUrl = await toPng(reactFlowWrapper, exportOptions);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(reactFlowWrapper, exportOptions);
          break;
        case 'svg':
          dataUrl = await toSvg(reactFlowWrapper, exportOptions);
          break;
        default:
          throw new Error(`Unsupported image format: ${format}`);
      }

      // Add watermark if requested (for raster formats)
      if (includeWatermark && watermarkText && (format === 'png' || format === 'jpeg')) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            this.addWatermark(canvas, watermarkText);
            
            const finalDataUrl = canvas.toDataURL(
              format === 'jpeg' ? 'image/jpeg' : 'image/png',
              quality
            );
            
            this.downloadFile(finalDataUrl, filename || this.generateFilename(format));
          }
        };
        img.src = dataUrl;
      } else {
        this.downloadFile(dataUrl, filename || this.generateFilename(format));
      }

    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Failed to export as ${format.toUpperCase()}: ${error}`);
    }
  }

  async exportAsPDF(options: ExportOptions): Promise<void> {
    try {
      if (!this.reactFlowInstance) {
        throw new Error('ReactFlow instance not available');
      }

      const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
      if (!reactFlowWrapper) {
        throw new Error('ReactFlow wrapper not found');
      }

      const viewport = this.getViewportForNodes(this.nodes, options.padding);
      
      const dataUrl = await toPng(reactFlowWrapper, {
        backgroundColor: options.backgroundColor,
        width: viewport.width,
        height: viewport.height,
        pixelRatio: 2,
        style: {
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: viewport.width > viewport.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [viewport.width, viewport.height],
      });

      // Add the image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, viewport.width, viewport.height);

      // Add watermark if requested
      if (options.includeWatermark && options.watermarkText) {
        pdf.setTextColor(150);
        pdf.setFontSize(12);
        pdf.text(options.watermarkText, viewport.width - 100, viewport.height - 20);
      }

      // Add metadata
      pdf.setProperties({
        title: 'Workflow Diagram',
        subject: 'Exported from WorkflowOrchestrator',
        author: 'WorkflowOrchestrator',
        creator: 'WorkflowOrchestrator',
      });

      // Save the PDF
      const filename = options.filename || this.generateFilename('pdf');
      pdf.save(filename);

    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error(`Failed to export as PDF: ${error}`);
    }
  }

  async exportAsGIF(options: ExportOptions): Promise<void> {
    try {
      // For now, we'll export as PNG and suggest using external tools for GIF
      // In a real implementation, you might use libraries like gif.js or similar
      
      console.warn('GIF export is not fully implemented. Exporting as PNG instead.');
      await this.exportAsImage({ ...options, format: 'png' });
      
      // TODO: Implement actual GIF export with animation
      // This would require:
      // 1. Capturing multiple frames of the workflow execution
      // 2. Using a GIF encoding library
      // 3. Managing animation timing and transitions
      
    } catch (error) {
      console.error('GIF export failed:', error);
      throw new Error(`Failed to export as GIF: ${error}`);
    }
  }

  generateShareableURL(): string {
    try {
      const workflowData = {
        nodes: this.nodes,
        edges: this.edges,
        timestamp: new Date().toISOString(),
      };

      // Encode the workflow data as a URL parameter
      const encodedData = btoa(JSON.stringify(workflowData));
      const baseUrl = window.location.origin + window.location.pathname;
      
      return `${baseUrl}?workflow=${encodedData}`;
    } catch (error) {
      console.error('Failed to generate shareable URL:', error);
      throw new Error('Failed to generate shareable URL');
    }
  }

  async shareToClipboard(): Promise<void> {
    try {
      const shareableUrl = this.generateShareableURL();
      await navigator.clipboard.writeText(shareableUrl);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      throw new Error('Failed to copy URL to clipboard');
    }
  }

  generateSocialMediaLinks() {
    const shareableUrl = encodeURIComponent(this.generateShareableURL());
    const title = encodeURIComponent('Check out my workflow diagram!');
    
    return {
      twitter: `https://twitter.com/intent/tweet?url=${shareableUrl}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareableUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareableUrl}`,
      email: `mailto:?subject=${title}&body=I'd like to share this workflow diagram with you: ${shareableUrl}`,
    };
  }

  exportWorkflowData(): void {
    try {
      const workflowData = {
        nodes: this.nodes,
        edges: this.edges,
        metadata: {
          exportedAt: new Date().toISOString(),
          nodeCount: this.nodes.length,
          edgeCount: this.edges.length,
          version: '1.0.0',
        },
      };

      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      this.downloadFile(dataUri, this.generateFilename('json', 'workflow-data'));
    } catch (error) {
      console.error('Failed to export workflow data:', error);
      throw new Error('Failed to export workflow data');
    }
  }
}

// React component wrapper for the ExportManager
export function useExportManager(
  reactFlowInstance: ReactFlowInstance | null,
  nodes: DiagramNode[],
  edges: DiagramEdge[]
) {
  const exportManagerRef = useRef<ExportManager | null>(null);

  // Update the export manager when dependencies change
  React.useEffect(() => {
    exportManagerRef.current = new ExportManager(reactFlowInstance, nodes, edges);
  }, [reactFlowInstance, nodes, edges]);

  const exportAsImage = useCallback(async (options: ExportOptions) => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.exportAsImage(options);
  }, []);

  const exportAsPDF = useCallback(async (options: ExportOptions) => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.exportAsPDF(options);
  }, []);

  const exportAsGIF = useCallback(async (options: ExportOptions) => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.exportAsGIF(options);
  }, []);

  const shareToClipboard = useCallback(async () => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.shareToClipboard();
  }, []);

  const generateSocialMediaLinks = useCallback(() => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.generateSocialMediaLinks();
  }, []);

  const exportWorkflowData = useCallback(() => {
    if (!exportManagerRef.current) {
      throw new Error('Export manager not initialized');
    }
    return exportManagerRef.current.exportWorkflowData();
  }, []);

  return {
    exportAsImage,
    exportAsPDF,
    exportAsGIF,
    shareToClipboard,
    generateSocialMediaLinks,
    exportWorkflowData,
  };
}

export default ExportManager;