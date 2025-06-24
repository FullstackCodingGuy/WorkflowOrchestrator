'use client';

import { useCallback, useRef } from 'react';

interface AutoPanelOptions {
  isOpen: boolean;
  onClose: () => void;
  panelSelector?: string;
  canvasSelector?: string;
}

export const useAutoPanel = ({
  isOpen,
  onClose,
  panelSelector = '[data-property-panel]',
  canvasSelector = '[data-canvas-area]',
}: AutoPanelOptions) => {
  const panelRef = useRef<HTMLElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isOpen) return;

    const target = event.target as Element;
    const isPropertyPanel = target.closest(panelSelector);
    const isCanvas = target.closest(canvasSelector);
    
    // Close panel if clicked on canvas or outside panel
    if (isCanvas && !isPropertyPanel) {
      onClose();
    }
  }, [isOpen, onClose, panelSelector, canvasSelector]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }, [isOpen, onClose]);

  const setPanelRef = useCallback((element: HTMLElement | null) => {
    panelRef.current = element;
  }, []);

  return {
    handleClickOutside,
    handleEscapeKey,
    setPanelRef,
    panelRef,
  };
};
