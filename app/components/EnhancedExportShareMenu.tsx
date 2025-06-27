'use client';

import React, { useState } from 'react';
import { 
  IconDownload, 
  IconPhoto, 
  IconFileTypePdf, 
  IconGif, 
  IconX, 
  IconSettings,
  IconShare,
  IconCopy,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconMail,
  IconFileExport,
  IconPalette,
  IconAdjustments
} from '@tabler/icons-react';
import { ExportOptions } from './ExportManager';

interface EnhancedExportShareMenuProps {
  onExportSVG: (options: ExportOptions) => void;
  onExportImage: (format: 'png' | 'jpeg', options: ExportOptions) => void;
  onExportPDF: (options: ExportOptions) => void;
  onExportGIF: (options: ExportOptions) => void;
  onShareToClipboard: () => Promise<void>;
  onGenerateSocialMediaLinks: () => { twitter: string; linkedin: string; facebook: string; email: string };
  onExportWorkflowData: () => void;
  onClose: () => void;
}

export function EnhancedExportShareMenu({
  onExportSVG,
  onExportImage,
  onExportPDF,
  onExportGIF,
  onShareToClipboard,
  onGenerateSocialMediaLinks,
  onExportWorkflowData,
  onClose,
}: EnhancedExportShareMenuProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'share' | 'settings'>('export');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 0.9,
    backgroundColor: '#ffffff',
    includeWatermark: false,
    watermarkText: 'WorkflowOrchestrator',
    padding: 50,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const handleExport = async (format: ExportOptions['format']) => {
    setIsExporting(true);
    try {
      const options = { ...exportOptions, format };
      
      switch (format) {
        case 'svg':
          await onExportSVG(options);
          break;
        case 'png':
        case 'jpeg':
          await onExportImage(format, options);
          break;
        case 'pdf':
          await onExportPDF(options);
          break;
        case 'gif':
          await onExportGIF(options);
          break;
      }
      
      // Show success message
      setShareMessage(`Successfully exported as ${format.toUpperCase()}!`);
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setShareMessage(`Export failed: ${error}`);
      setTimeout(() => setShareMessage(''), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      if (platform === 'clipboard') {
        await onShareToClipboard();
        setShareMessage('Link copied to clipboard!');
      } else {
        const links = onGenerateSocialMediaLinks();
        if (links[platform as keyof typeof links]) {
          window.open(links[platform as keyof typeof links], '_blank');
          setShareMessage(`Opening ${platform}...`);
        }
      }
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      console.error('Share failed:', error);
      setShareMessage('Share failed. Please try again.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const presetBackgrounds = [
    { name: 'White', color: '#ffffff' },
    { name: 'Light Gray', color: '#f8f9fa' },
    { name: 'Dark', color: '#1a1a1a' },
    { name: 'Blue', color: '#e3f2fd' },
    { name: 'Green', color: '#e8f5e8' },
    { name: 'Transparent', color: 'transparent' },
  ];

  return (
    <div className="absolute top-14 right-0 z-50 w-96 bg-card border border-border rounded-lg shadow-xl animate-in fade-in-5 slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Export & Share</h3>
        <button onClick={onClose} className="btn btn-sm btn-ghost p-1 text-muted-foreground hover:text-foreground">
          <IconX size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'export' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <IconDownload size={16} className="inline mr-2" />
          Export
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'share' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <IconShare size={16} className="inline mr-2" />
          Share
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'settings' 
              ? 'text-primary border-b-2 border-primary bg-primary/5' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <IconSettings size={16} className="inline mr-2" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ExportButton 
                icon={<IconDownload size={24} />} 
                label="SVG" 
                description="Vector format" 
                onClick={() => handleExport('svg')} 
                disabled={isExporting}
              />
              <ExportButton 
                icon={<IconPhoto size={24} />} 
                label="PNG" 
                description="High quality" 
                onClick={() => handleExport('png')} 
                disabled={isExporting}
              />
              <ExportButton 
                icon={<IconPhoto size={24} />} 
                label="JPEG" 
                description="Smaller size" 
                onClick={() => handleExport('jpeg')} 
                disabled={isExporting}
              />
              <ExportButton 
                icon={<IconFileTypePdf size={24} />} 
                label="PDF" 
                description="Document format" 
                onClick={() => handleExport('pdf')} 
                disabled={isExporting}
              />
              <ExportButton 
                icon={<IconGif size={24} />} 
                label="GIF" 
                description="Animated" 
                onClick={() => handleExport('gif')} 
                disabled={isExporting}
                isComingSoon
              />
              <ExportButton 
                icon={<IconFileExport size={24} />} 
                label="JSON" 
                description="Workflow data" 
                onClick={onExportWorkflowData} 
                disabled={isExporting}
              />
            </div>

            {isExporting && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Exporting...</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'share' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <ShareButton 
                icon={<IconCopy size={20} />} 
                label="Copy Link" 
                description="Copy shareable URL to clipboard"
                onClick={() => handleShare('clipboard')} 
              />
              <ShareButton 
                icon={<IconBrandTwitter size={20} />} 
                label="Share on Twitter" 
                description="Post to your Twitter feed"
                onClick={() => handleShare('twitter')} 
              />
              <ShareButton 
                icon={<IconBrandLinkedin size={20} />} 
                label="Share on LinkedIn" 
                description="Share with your professional network"
                onClick={() => handleShare('linkedin')} 
              />
              <ShareButton 
                icon={<IconBrandFacebook size={20} />} 
                label="Share on Facebook" 
                description="Post to your Facebook timeline"
                onClick={() => handleShare('facebook')} 
              />
              <ShareButton 
                icon={<IconMail size={20} />} 
                label="Share via Email" 
                description="Send link via email"
                onClick={() => handleShare('email')} 
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Quality Settings */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <IconAdjustments size={16} className="inline mr-2" />
                Export Quality
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={exportOptions.quality}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Quality: {Math.round(exportOptions.quality * 100)}%
                </div>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <IconPalette size={16} className="inline mr-2" />
                Background Color
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {presetBackgrounds.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setExportOptions(prev => ({ ...prev, backgroundColor: preset.color }))}
                    className={`p-2 text-xs rounded border ${
                      exportOptions.backgroundColor === preset.color 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ 
                      backgroundColor: preset.color === 'transparent' ? 'transparent' : preset.color,
                      backgroundImage: preset.color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                      backgroundSize: preset.color === 'transparent' ? '8px 8px' : 'auto',
                      backgroundPosition: preset.color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <input
                type="color"
                value={exportOptions.backgroundColor === 'transparent' ? '#ffffff' : exportOptions.backgroundColor}
                onChange={(e) => setExportOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-full h-8 rounded border border-border"
              />
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Padding: {exportOptions.padding}px
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={exportOptions.padding}
                onChange={(e) => setExportOptions(prev => ({ ...prev, padding: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Watermark */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions.includeWatermark}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                  className="checkbox"
                />
                <span className="text-sm font-medium text-foreground">Include Watermark</span>
              </label>
              {exportOptions.includeWatermark && (
                <input
                  type="text"
                  value={exportOptions.watermarkText || ''}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, watermarkText: e.target.value }))}
                  placeholder="Watermark text"
                  className="mt-2 w-full px-3 py-2 text-sm border border-border rounded bg-background"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      {shareMessage && (
        <div className="px-4 py-2 border-t border-border">
          <div className="text-sm text-primary bg-primary/10 px-3 py-2 rounded">
            {shareMessage}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          High-quality exports with advanced customization options
        </div>
      </div>
    </div>
  );
}

interface ExportButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  isComingSoon?: boolean;
}

function ExportButton({ icon, label, description, onClick, disabled = false, isComingSoon = false }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isComingSoon}
      className={`relative flex flex-col items-center p-3 border border-border rounded-lg transition-all duration-200 ${
        disabled || isComingSoon
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-primary/5 hover:border-primary/50'
      }`}
    >
      <div className="text-primary mb-2">{icon}</div>
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground text-center">{description}</div>
      {isComingSoon && (
        <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
          Soon
        </div>
      )}
    </button>
  );
}

interface ShareButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function ShareButton({ icon, label, description, onClick }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center p-3 border border-border rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
    >
      <div className="text-primary mr-3">{icon}</div>
      <div className="flex-1 text-left">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </button>
  );
}