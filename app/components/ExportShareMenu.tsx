
import React from 'react';
import { IconDownload, IconPhoto, IconFileTypePdf, IconGif, IconX } from '@tabler/icons-react';

interface ExportShareMenuProps {
  onExportSVG: () => void;
  onExportImage: (format: 'png' | 'jpeg') => void;
  onExportPDF: () => void;
  onExportGIF: () => void;
  onClose: () => void;
}

export function ExportShareMenu({
  onExportSVG,
  onExportImage,
  onExportPDF,
  onExportGIF,
  onClose,
}: ExportShareMenuProps) {
  return (
    <div className="absolute top-14 right-0 z-50 w-72 bg-card border border-border rounded-lg shadow-xl p-4 animate-in fade-in-5 slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Export & Share</h3>
        <button onClick={onClose} className="btn btn-sm btn-ghost p-1 text-muted-foreground hover:text-foreground">
          <IconX size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ExportButton icon={<IconDownload size={28} />} label="SVG" onClick={onExportSVG} />
        <ExportButton icon={<IconPhoto size={28} />} label="PNG" onClick={() => onExportImage('png')} />
        <ExportButton icon={<IconFileTypePdf size={28} />} label="PDF" onClick={onExportPDF} />
        <ExportButton icon={<IconGif size={28} />} label="GIF" onClick={onExportGIF} isAnimated={true} />
      </div>
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Export your workflow in various formats. Animated GIFs are available for supported workflow types.
      </div>
    </div>
  );
}

interface ExportButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isAnimated?: boolean;
}

function ExportButton({ icon, label, onClick, isAnimated = false }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      className="btn btn-outline flex-col h-24 w-full justify-center items-center space-y-2 p-2 rounded-lg transition-all duration-200 hover:bg-primary-muted hover:border-primary"
    >
      <div className="text-primary">{icon}</div>
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-sm text-foreground">{label}</span>
        {isAnimated && (
          <span className="text-xs font-bold text-accent-dark animate-pulse">ANI</span>
        )}
      </div>
    </button>
  );
}
