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
  nodeBg: string;
  nodeColor: string;
  accent: string;
  handleBg: string; 
}

// Removed transientThemes array and currentTransientIndex

const applyThemeVariables = (theme: ThemeProperties) => {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--node-bg', theme.nodeBg);
  root.style.setProperty('--node-color', theme.nodeColor);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--handle-bg', theme.handleBg || theme.foreground); 
  
  if (theme.background.includes('gradient')) {
    document.body.style.background = theme.background;
  } else {
    document.body.style.background = ''; 
    // Ensure body background is explicitly set for non-gradient themes too
    document.body.style.backgroundColor = theme.background;
  }
};

const themes: Record<Theme, ThemeProperties> = {
  light: { background: '#ffffff', foreground: '#171717', nodeBg: '#f0f0f0', nodeColor: '#171717', accent: '#3b82f6', handleBg: '#CCCCCC' },
  dark: { background: '#1a202c', foreground: '#e2e8f0', nodeBg: '#2d3748', nodeColor: '#e2e8f0', accent: '#63b3ed', handleBg: '#e2e8f0' },
  professional: { background: '#e0e5ec', foreground: '#333333', nodeBg: '#ffffff', nodeColor: '#333333', accent: '#007acc', handleBg: '#CCCCCC' },
  creative: { background: '#fdf4f5', foreground: '#5d5c61', nodeBg: '#fff0f1', nodeColor: '#5d5c61', accent: '#ff758c', handleBg: '#5d5c61' },
  // transient: transientThemes[currentTransientIndex], // Removed transient
  'midnight-dusk': { name: 'Midnight Dusk', background: '#1A1A2E', foreground: '#E0E0E0', nodeBg: '#2A2A4E', nodeColor: '#F0F0F0', accent: '#E94560', handleBg: '#E0E0E0' },
  'charcoal-slate': { name: 'Charcoal Slate', background: '#262626', foreground: '#DCDCDC', nodeBg: '#3C3C3C', nodeColor: '#FFFFFF', accent: '#50C878', handleBg: '#DCDCDC' },
  'cool-breeze': { name: 'Cool Breeze', background: '#F0F4F8', foreground: '#333333', nodeBg: '#FFFFFF', nodeColor: '#222222', accent: '#007BFF', handleBg: '#CCCCCC' },
  'warm-sand': { name: 'Warm Sand', background: '#FAF0E6', foreground: '#4A4A4A', nodeBg: '#FFF8F0', nodeColor: '#3B3B3B', accent: '#FF8C00', handleBg: '#B0B0B0' },
  'minty-fresh': { name: 'Minty Fresh', background: '#E6FFFA', foreground: '#2F4F4F', nodeBg: '#FFFFFF', nodeColor: '#1A2A2A', accent: '#32CD32', handleBg: '#A9A9A9' },
  'galactic-night': { name: 'Galactic Night', background: '#0D0C1D', foreground: '#B0B0D0', nodeBg: '#1C1A3A', nodeColor: '#D0D0F0', accent: '#F9A826', handleBg: '#B0B0D0' },
  'obsidian-depths': { name: 'Obsidian Depths', background: '#121212', foreground: '#A9A9A9', nodeBg: '#1E1E1E', nodeColor: '#E0E0E0', accent: '#BB86FC', handleBg: '#A9A9A9' },
  'forest-midnight': { name: 'Forest Midnight', background: '#1A2B23', foreground: '#B2C2B8', nodeBg: '#2A4B3A', nodeColor: '#D0E0D8', accent: '#FFC107', handleBg: '#B2C2B8' },
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
      <span className="mr-2 text-sm">Theme:</span>
      <select 
        onChange={(e) => handleThemeChange(e.target.value as Theme)} 
        value={currentThemeName}
        className="p-1 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
