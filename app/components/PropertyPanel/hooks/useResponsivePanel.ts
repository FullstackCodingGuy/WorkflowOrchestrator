'use client';

import { useState, useEffect, useCallback } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type PanelMode = 'sidebar' | 'modal' | 'bottomSheet';

export interface ResponsivePanelConfig {
  deviceType: DeviceType;
  panelMode: PanelMode;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
};

export const useResponsivePanel = (): ResponsivePanelConfig => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [panelMode, setPanelMode] = useState<PanelMode>('sidebar');

  const updateDevice = useCallback(() => {
    const width = window.innerWidth;
    
    if (width <= BREAKPOINTS.mobile) {
      setDeviceType('mobile');
      setPanelMode('bottomSheet');
    } else if (width <= BREAKPOINTS.tablet) {
      setDeviceType('tablet');
      setPanelMode('modal');
    } else {
      setDeviceType('desktop');
      setPanelMode('sidebar');
    }
  }, []);

  useEffect(() => {
    // Initial check
    updateDevice();
    
    // Add resize listener
    window.addEventListener('resize', updateDevice);
    
    return () => {
      window.removeEventListener('resize', updateDevice);
    };
  }, [updateDevice]);

  return {
    deviceType,
    panelMode,
    breakpoints: BREAKPOINTS,
  };
};
