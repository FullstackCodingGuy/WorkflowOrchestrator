'use client';

import React, { useState } from 'react';
import MegaMenu from './MegaMenu';

/**
 * Example component demonstrating the redesigned MegaMenu
 * Features MS Office-style 2-column layout with dedicated Share & Export section
 * Includes: SVG Export, Image Export, GIF Export, PDF Export with modern Lucide icons
 */
export function MegaMenuExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNew = () => {
    console.log('Creating new workflow...');
    // Add logic to create new workflow
  };

  const handleOpen = () => {
    console.log('Opening file...');
    // Add logic to open file dialog
  };

  const handleSave = () => {
    console.log('Saving workflow...');
    // Add logic to save current workflow
  };

  const handleExportPNG = () => {
    console.log('Exporting as PNG image...');
    // Add logic to export as high-quality PNG image
  };

  const handleExportSVG = () => {
    console.log('Exporting as SVG vector...');
    // Add logic to export as scalable vector graphics
  };

  const handleExportPDF = () => {
    console.log('Exporting as PDF document...');
    // Add logic to export as professional PDF document
  };

  const handleExportGIF = () => {
    console.log('Exporting as animated GIF...');
    // Add logic to export as animated GIF presentation
  };

  const handleExportJSON = () => {
    console.log('Exporting as JSON configuration...');
    // Add logic to export workflow configuration as JSON
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">MegaMenu - Share & Export Demo</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-600">Export Formats</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PNG - High-quality raster images</li>
                <li>• SVG - Scalable vector graphics</li>
                <li>• PDF - Professional documents</li>
                <li>• GIF - Animated presentations</li>
                <li>• JSON - Configuration data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-purple-600">Design Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• MS Office-style 2-column layout</li>
                <li>• Gradient hover effects for exports</li>
                <li>• Keyboard shortcuts support</li>
                <li>• Modern Lucide icons</li>
                <li>• Responsive animations</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Open Share & Export Menu
          </button>
        </div>

        <MegaMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportPDF={handleExportPDF}
          onExportGIF={handleExportGIF}
          onExportJSON={handleExportJSON}
        />
      </div>
    </div>
  );
}
