'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'professional' | 'creative';

interface ThemeProperties {
  background: string;
  foreground: string;
  mutedForeground: string;
  cardBg: string;
  cardForeground: string;
  popoverBg: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  primaryHover: string;
  secondary: string;
  secondaryForeground: string;
  secondaryHover: string;
  accent: string;
  accentForeground: string;
  accentHover: string;
  borderColor: string;
  inputBorder: string;
  inputBg: string;
  sidebarBg: string;
  headerBg: string;
  headerForeground: string;
  toolbarBg: string;
  nodeBg: string;
  nodeColor: string;
  handleBg?: string;
}

const themes: Record<Theme, ThemeProperties> = {
  light: {
    background: '#ffffff',
    foreground: '#111827',
    mutedForeground: '#6b7280',
    cardBg: '#ffffff',
    cardForeground: '#111827',
    popoverBg: '#ffffff',
    popoverForeground: '#111827',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    primaryHover: '#2563eb',
    secondary: '#f3f4f6',
    secondaryForeground: '#1f2937',
    secondaryHover: '#e5e7eb',
    accent: '#ec4899',
    accentForeground: '#ffffff',
    accentHover: '#d946ef',
    borderColor: '#e5e7eb',
    inputBorder: '#d1d5db',
    inputBg: '#f3f4f6',
    sidebarBg: '#f9fafb',
    headerBg: '#ffffff',
    headerForeground: '#111827',
    toolbarBg: '#ffffff',
    nodeBg: '#f7fafc',
    nodeColor: '#1f2937',
  },
  dark: {
    background: '#111827',
    foreground: '#f3f4f6',
    mutedForeground: '#9ca3af',
    cardBg: '#1f2937',
    cardForeground: '#f3f4f6',
    popoverBg: '#1f2937',
    popoverForeground: '#f3f4f6',
    primary: '#60a5fa',
    primaryForeground: '#111827',
    primaryHover: '#3b82f6',
    secondary: '#374151',
    secondaryForeground: '#f3f4f6',
    secondaryHover: '#4b5563',
    accent: '#f472b6',
    accentForeground: '#111827',
    accentHover: '#ec4899',
    borderColor: '#374151',
    inputBorder: '#4b5563',
    inputBg: '#374151',
    sidebarBg: '#1f2937',
    headerBg: '#111827',
    headerForeground: '#f3f4f6',
    toolbarBg: '#111827',
    nodeBg: '#2d3748',
    nodeColor: '#e2e8f0',
  },
  professional: {
    background: '#fefefe',
    foreground: '#2d3748',
    mutedForeground: '#718096',
    cardBg: '#ffffff',
    cardForeground: '#2d3748',
    popoverBg: '#ffffff',
    popoverForeground: '#2d3748',
    primary: '#2563eb',
    primaryForeground: '#ffffff',
    primaryHover: '#1d4ed8',
    secondary: '#f7fafc',
    secondaryForeground: '#4a5568',
    secondaryHover: '#edf2f7',
    accent: '#0891b2',
    accentForeground: '#ffffff',
    accentHover: '#0e7490',
    borderColor: '#e2e8f0',
    inputBorder: '#cbd5e0',
    inputBg: '#f7fafc',
    sidebarBg: '#f8fafc',
    headerBg: '#ffffff',
    headerForeground: '#2d3748',
    toolbarBg: '#ffffff',
    nodeBg: '#f7fafc',
    nodeColor: '#2d3748',
  },
  creative: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    foreground: '#ffffff',
    mutedForeground: '#e2e8f0',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    cardForeground: '#ffffff',
    popoverBg: 'rgba(255, 255, 255, 0.95)',
    popoverForeground: '#2d3748',
    primary: '#ff6b6b',
    primaryForeground: '#ffffff',
    primaryHover: '#ff5252',
    secondary: 'rgba(255, 255, 255, 0.2)',
    secondaryForeground: '#ffffff',
    secondaryHover: 'rgba(255, 255, 255, 0.3)',
    accent: '#4ecdc4',
    accentForeground: '#2d3748',
    accentHover: '#26d0ce',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    inputBorder: 'rgba(255, 255, 255, 0.4)',
    inputBg: 'rgba(255, 255, 255, 0.1)',
    sidebarBg: 'rgba(255, 255, 255, 0.1)',
    headerBg: 'rgba(255, 255, 255, 0.1)',
    headerForeground: '#ffffff',
    toolbarBg: 'rgba(255, 255, 255, 0.1)',
    nodeBg: 'rgba(255, 255, 255, 0.2)',
    nodeColor: '#ffffff',
  },
};

const applyThemeVariables = (theme: ThemeProperties) => {
  const root = document.documentElement;
  
  const cssVariables = {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--muted-foreground': theme.mutedForeground,
    '--card-bg': theme.cardBg,
    '--card-foreground': theme.cardForeground,
    '--popover-bg': theme.popoverBg,
    '--popover-foreground': theme.popoverForeground,
    '--primary': theme.primary,
    '--primary-foreground': theme.primaryForeground,
    '--primary-hover': theme.primaryHover,
    '--secondary': theme.secondary,
    '--secondary-foreground': theme.secondaryForeground,
    '--secondary-hover': theme.secondaryHover,
    '--accent': theme.accent,
    '--accent-foreground': theme.accentForeground,
    '--accent-hover': theme.accentHover,
    '--border-color': theme.borderColor,
    '--input-border': theme.inputBorder,
    '--input-bg': theme.inputBg,
    '--sidebar-bg': theme.sidebarBg,
    '--header-bg': theme.headerBg,
    '--header-foreground': theme.headerForeground,
    '--toolbar-bg': theme.toolbarBg,
    '--node-bg': theme.nodeBg,
    '--node-color': theme.nodeColor,
    '--handle-bg': theme.handleBg || theme.foreground,
  };

  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Handle complex backgrounds
  if (theme.background.includes('gradient') || theme.background.includes('url')) {
    document.body.style.background = theme.background;
    document.body.style.backgroundColor = '';
  } else {
    document.body.style.backgroundColor = theme.background;
    document.body.style.background = '';
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('workflow-theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyThemeVariables(themes[savedTheme]);
    } else {
      // Apply default light theme
      applyThemeVariables(themes.light);
    }
  }, []);

  const changeTheme = (themeName: Theme) => {
    setCurrentTheme(themeName);
    applyThemeVariables(themes[themeName]);
    localStorage.setItem('workflow-theme', themeName);
  };

  return {
    currentTheme,
    changeTheme,
    availableThemes: Object.keys(themes) as Theme[],
  };
};
