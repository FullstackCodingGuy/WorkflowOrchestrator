'use client';

import React, { useState, useEffect } from 'react';

type Theme = 
  | 'light' 
  | 'dark' 
  | 'professional' 
  | 'creative' 
  // | 'transient' // Removed transient
  | 'midnight-dusk'
  | 'charcoal-slate'
  | 'cool-breeze'
  | 'warm-sand'
  | 'minty-fresh'
  | 'galactic-night'  // Added new dark theme
  | 'obsidian-depths' // Added new dark theme
  | 'forest-midnight'; // Added new dark theme

interface ThemeProperties {
  name?: string;
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
  handleBg: string;
}

// Removed transientThemes array and currentTransientIndex

const applyThemeVariables = (theme: ThemeProperties) => {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--muted-foreground', theme.mutedForeground);

  root.style.setProperty('--card-bg', theme.cardBg);
  root.style.setProperty('--card-foreground', theme.cardForeground);

  root.style.setProperty('--popover-bg', theme.popoverBg);
  root.style.setProperty('--popover-foreground', theme.popoverForeground);

  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', theme.primaryForeground);
  root.style.setProperty('--primary-hover', theme.primaryHover);

  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
  root.style.setProperty('--secondary-hover', theme.secondaryHover);

  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-foreground', theme.accentForeground);
  root.style.setProperty('--accent-hover', theme.accentHover);
  
  root.style.setProperty('--border-color', theme.borderColor);
  root.style.setProperty('--input-border', theme.inputBorder);
  root.style.setProperty('--input-bg', theme.inputBg);

  root.style.setProperty('--sidebar-bg', theme.sidebarBg);
  root.style.setProperty('--header-bg', theme.headerBg);
  root.style.setProperty('--header-foreground', theme.headerForeground);
  root.style.setProperty('--toolbar-bg', theme.toolbarBg);

  root.style.setProperty('--node-bg', theme.nodeBg);
  root.style.setProperty('--node-color', theme.nodeColor);
  root.style.setProperty('--handle-bg', theme.handleBg || theme.foreground);

  // Special handling for body background if it involves gradients or complex images
  if (theme.background.includes('gradient') || theme.background.includes('url')) {
    document.body.style.background = theme.background;
    document.body.style.backgroundColor = ''; // Clear direct background color if complex background is set
  } else {
    document.body.style.background = ''; // Clear complex background
    document.body.style.backgroundColor = theme.background; // Set simple background color
  }
};

const themes: Record<Theme, ThemeProperties> = {
  light: { 
    name: 'Light',
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
    accent: '#3b82f6', // Using primary as accent for default light
    accentForeground: '#ffffff',
    accentHover: '#2563eb',
    borderColor: '#e5e7eb',
    inputBorder: '#d1d5db',
    inputBg: '#f3f4f6',
    sidebarBg: '#f9fafb',
    headerBg: '#ffffff',
    headerForeground: '#111827',
    toolbarBg: '#ffffff',
    nodeBg: '#f7fafc',
    nodeColor: '#1f2937',
    handleBg: '#cbd5e0',
  },
  dark: { 
    name: 'Dark',
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
    accent: '#60a5fa', // Using primary as accent for default dark
    accentForeground: '#111827',
    accentHover: '#3b82f6',
    borderColor: '#374151',
    inputBorder: '#4b5563',
    inputBg: '#374151',
    sidebarBg: '#1f2937',
    headerBg: '#111827',
    headerForeground: '#f3f4f6',
    toolbarBg: '#111827',
    nodeBg: '#2d3748',
    nodeColor: '#e2e8f0',
    handleBg: '#4a5568',
  },
  professional: { 
    name: 'Professional',
    background: '#e0e5ec', foreground: '#333333', nodeBg: '#ffffff', nodeColor: '#333333', accent: '#007acc', handleBg: '#CCCCCC',
    mutedForeground: '#7f7f7f', // Derived
    cardBg: '#ffffff', cardForeground: '#333333',
    popoverBg: '#ffffff', popoverForeground: '#333333',
    primary: '#007acc', primaryForeground: '#ffffff', primaryHover: '#005c99', // Accent as primary
    secondary: '#d1d8e0', secondaryForeground: '#333333', secondaryHover: '#b9c2cc', // Lighter background
    accentForeground: '#ffffff', accentHover: '#005c99', // Derived from accent
    borderColor: '#c5ccd3', inputBorder: '#b0b8c0', inputBg: '#ebf0f5', // Derived
    sidebarBg: '#d8dde4', headerBg: '#e0e5ec', headerForeground: '#333333', toolbarBg: '#e0e5ec', // Derived
  },
  creative: { 
    name: 'Creative',
    background: '#fdf4f5', foreground: '#5d5c61', nodeBg: '#fff0f1', nodeColor: '#5d5c61', accent: '#ff758c', handleBg: '#5d5c61',
    mutedForeground: '#a09fa3', // Derived
    cardBg: '#fff0f1', cardForeground: '#5d5c61',
    popoverBg: '#fff0f1', popoverForeground: '#5d5c61',
    primary: '#ff758c', primaryForeground: '#ffffff', primaryHover: '#ff5070', // Accent as primary
    secondary: '#f7e8ea', secondaryForeground: '#5d5c61', secondaryHover: '#f1dcd_edit_into_filee0', // Lighter background
    accentForeground: '#ffffff', accentHover: '#ff5070', // Derived from accent
    borderColor: '#e9d7d9', inputBorder: '#dcc9cb', inputBg: '#f9f0f1', // Derived
    sidebarBg: '#fbeff0', headerBg: '#fdf4f5', headerForeground: '#5d5c61', toolbarBg: '#fdf4f5', // Derived
  },
  'midnight-dusk': { 
    name: 'Midnight Dusk', 
    background: '#1A1A2E', foreground: '#E0E0E0', nodeBg: '#2A2A4E', nodeColor: '#F0F0F0', accent: '#E94560', handleBg: '#E0E0E0',
    mutedForeground: '#A0A0C0', cardBg: '#2A2A4E', cardForeground: '#F0F0F0', popoverBg: '#2A2A4E', popoverForeground: '#F0F0F0',
    primary: '#E94560', primaryForeground: '#1A1A2E', primaryHover: '#C7304A',
    secondary: '#252540', secondaryForeground: '#E0E0E0', secondaryHover: '#303055',
    accentForeground: '#1A1A2E', accentHover: '#C7304A',
    borderColor: '#3A3A5E', inputBorder: '#4A4A6E', inputBg: '#252540',
    sidebarBg: '#20203A', headerBg: '#1A1A2E', headerForeground: '#E0E0E0', toolbarBg: '#1A1A2E',
  },
  'charcoal-slate': { 
    name: 'Charcoal Slate', 
    background: '#262626', foreground: '#DCDCDC', nodeBg: '#3C3C3C', nodeColor: '#FFFFFF', accent: '#50C878', handleBg: '#DCDCDC',
    mutedForeground: '#A0A0A0', cardBg: '#3C3C3C', cardForeground: '#FFFFFF', popoverBg: '#3C3C3C', popoverForeground: '#FFFFFF',
    primary: '#50C878', primaryForeground: '#262626', primaryHover: '#3EAF62',
    secondary: '#333333', secondaryForeground: '#DCDCDC', secondaryHover: '#404040',
    accentForeground: '#262626', accentHover: '#3EAF62',
    borderColor: '#4D4D4D', inputBorder: '#5A5A5A', inputBg: '#333333',
    sidebarBg: '#2C2C2C', headerBg: '#262626', headerForeground: '#DCDCDC', toolbarBg: '#262626',
  },
  'cool-breeze': { 
    name: 'Cool Breeze', 
    background: '#F0F4F8', foreground: '#333333', nodeBg: '#FFFFFF', nodeColor: '#222222', accent: '#007BFF', handleBg: '#CCCCCC',
    mutedForeground: '#7f7f7f', cardBg: '#FFFFFF', cardForeground: '#222222', popoverBg: '#FFFFFF', popoverForeground: '#222222',
    primary: '#007BFF', primaryForeground: '#FFFFFF', primaryHover: '#0056b3',
    secondary: '#E2E8F0', secondaryForeground: '#333333', secondaryHover: '#CBD5E0',
    accentForeground: '#FFFFFF', accentHover: '#0056b3',
    borderColor: '#D1D9E6', inputBorder: '#B8C2D3', inputBg: '#E9EDF4',
    sidebarBg: '#E8EEF4', headerBg: '#F0F4F8', headerForeground: '#333333', toolbarBg: '#F0F4F8',
  },
  'warm-sand': { 
    name: 'Warm Sand', 
    background: '#FAF0E6', foreground: '#4A4A4A', nodeBg: '#FFF8F0', nodeColor: '#3B3B3B', accent: '#FF8C00', handleBg: '#B0B0B0',
    mutedForeground: '#8f8f8f', cardBg: '#FFF8F0', cardForeground: '#3B3B3B', popoverBg: '#FFF8F0', popoverForeground: '#3B3B3B',
    primary: '#FF8C00', primaryForeground: '#FFFFFF', primaryHover: '#D97700',
    secondary: '#F2E8DC', secondaryForeground: '#4A4A4A', secondaryHover: '#EADFCF',
    accentForeground: '#FFFFFF', accentHover: '#D97700',
    borderColor: '#E8DCCF', inputBorder: '#DDCAB8', inputBg: '#F7F2EA',
    sidebarBg: '#F5EBE0', headerBg: '#FAF0E6', headerForeground: '#4A4A4A', toolbarBg: '#FAF0E6',
  },
  'minty-fresh': { 
    name: 'Minty Fresh', 
    background: '#E6FFFA', foreground: '#2F4F4F', nodeBg: '#FFFFFF', nodeColor: '#1A2A2A', accent: '#32CD32', handleBg: '#A9A9A9',
    mutedForeground: '#6f8f8f', cardBg: '#FFFFFF', cardForeground: '#1A2A2A', popoverBg: '#FFFFFF', popoverForeground: '#1A2A2A',
    primary: '#32CD32', primaryForeground: '#FFFFFF', primaryHover: '#28A428',
    secondary: '#D9FFF5', secondaryForeground: '#2F4F4F', secondaryHover: '#C6F7EA',
    accentForeground: '#FFFFFF', accentHover: '#28A428',
    borderColor: '#C0F0E5', inputBorder: '#ADDDCF', inputBg: '#E0FFF8',
    sidebarBg: '#DAF8F0', headerBg: '#E6FFFA', headerForeground: '#2F4F4F', toolbarBg: '#E6FFFA',
  },
  'galactic-night': { 
    name: 'Galactic Night', 
    background: '#0D0C1D', foreground: '#B0B0D0', nodeBg: '#1C1A3A', nodeColor: '#D0D0F0', accent: '#F9A826', handleBg: '#B0B0D0',
    mutedForeground: '#8080A0', cardBg: '#1C1A3A', cardForeground: '#D0D0F0', popoverBg: '#1C1A3A', popoverForeground: '#D0D0F0',
    primary: '#F9A826', primaryForeground: '#0D0C1D', primaryHover: '#D38F1F',
    secondary: '#18162E', secondaryForeground: '#B0B0D0', secondaryHover: '#232040',
    accentForeground: '#0D0C1D', accentHover: '#D38F1F',
    borderColor: '#2D2A4D', inputBorder: '#3D3A5D', inputBg: '#18162E',
    sidebarBg: '#131128', headerBg: '#0D0C1D', headerForeground: '#B0B0D0', toolbarBg: '#0D0C1D',
  },
  'obsidian-depths': { 
    name: 'Obsidian Depths', 
    background: '#121212', foreground: '#A9A9A9', nodeBg: '#1E1E1E', nodeColor: '#E0E0E0', accent: '#BB86FC', handleBg: '#A9A9A9',
    mutedForeground: '#888888', cardBg: '#1E1E1E', cardForeground: '#E0E0E0', popoverBg: '#1E1E1E', popoverForeground: '#E0E0E0',
    primary: '#BB86FC', primaryForeground: '#000000', primaryHover: '#A060E0',
    secondary: '#2A2A2A', secondaryForeground: '#A9A9A9', secondaryHover: '#383838',
    accentForeground: '#000000', accentHover: '#A060E0',
    borderColor: '#333333', inputBorder: '#444444', inputBg: '#2A2A2A',
    sidebarBg: '#1A1A1A', headerBg: '#121212', headerForeground: '#A9A9A9', toolbarBg: '#121212',
  },
  'forest-midnight': { 
    name: 'Forest Midnight', 
    background: '#1A2B23', foreground: '#B2C2B8', nodeBg: '#2A4B3A', nodeColor: '#D0E0D8', accent: '#FFC107', handleBg: '#B2C2B8',
    mutedForeground: '#829288', cardBg: '#2A4B3A', cardForeground: '#D0E0D8', popoverBg: '#2A4B3A', popoverForeground: '#D0E0D8',
    primary: '#FFC107', primaryForeground: '#1A2B23', primaryHover: '#D9A300',
    secondary: '#233A2E', secondaryForeground: '#B2C2B8', secondaryHover: '#2E4D3B',
    accentForeground: '#1A2B23', accentHover: '#D9A300',
    borderColor: '#3A5B4A', inputBorder: '#4A6B5A', inputBg: '#233A2E',
    sidebarBg: '#1F352A', headerBg: '#1A2B23', headerForeground: '#B2C2B8', toolbarBg: '#1A2B23',
  },
};

const ThemeSwitcher: React.FC = () => {
  const [currentThemeName, setCurrentThemeName] = useState<Theme>('light');

  useEffect(() => {
    // Ensure theme exists before applying
    if (themes[currentThemeName]) {
      applyThemeVariables(themes[currentThemeName]);
    }
    // Removed transient theme interval logic
  }, [currentThemeName]);

  const handleThemeChange = (themeName: Theme) => {
    setCurrentThemeName(themeName);
  };

  return (
    <div className="p-2 border-b border-gray-700">
      <select 
        onChange={(e) => handleThemeChange(e.target.value as Theme)} 
        value={currentThemeName}
        className="p-1 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label="Select Theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="professional">Professional</option>
        <option value="creative">Creative</option>
        {/* <option value="transient">Transient Flow</option> // Removed transient option */}
        <option value="midnight-dusk">Midnight Dusk</option>
        <option value="charcoal-slate">Charcoal Slate</option>
        <option value="galactic-night">Galactic Night</option>
        <option value="obsidian-depths">Obsidian Depths</option>
        <option value="forest-midnight">Forest Midnight</option>
        <option value="cool-breeze">Cool Breeze</option>
        <option value="warm-sand">Warm Sand</option>
        <option value="minty-fresh">Minty Fresh</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
