'use client';

import React, { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'professional' | 'creative' | 'transient'; // Added transient

const transientThemes = [
  { name: 'Sunset Flow', background: 'linear-gradient(to right, #ff7e5f, #feb47b)', foreground: '#ffffff', nodeBg: '#ff7e5f', nodeColor: '#ffffff', accent: '#feb47b' },
  { name: 'Ocean Breeze', background: 'linear-gradient(to right, #2c3e50, #4ca1af)', foreground: '#ffffff', nodeBg: '#2c3e50', nodeColor: '#ffffff', accent: '#4ca1af' },
  { name: 'Forest Path', background: 'linear-gradient(to right, #5a3f37, #2c7744)', foreground: '#ffffff', nodeBg: '#5a3f37', nodeColor: '#ffffff', accent: '#2c7744' },
  { name: 'Cosmic Dust', background: 'linear-gradient(to right, #485563, #29323c)', foreground: '#e0e0e0', nodeBg: '#485563', nodeColor: '#e0e0e0', accent: '#82aaff' },
];

let currentTransientIndex = 0;

const applyThemeVariables = (theme: any) => {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--node-bg', theme.nodeBg);
  root.style.setProperty('--node-color', theme.nodeColor);
  root.style.setProperty('--accent-color', theme.accent);
  // For gradient backgrounds, apply directly to body or a main container
  if (theme.background.includes('gradient')) {
    document.body.style.background = theme.background;
  } else {
    document.body.style.background = ''; // Clear if not a gradient
  }
};

const themes: Record<Theme, any> = {
  light: { background: '#ffffff', foreground: '#171717', nodeBg: '#f0f0f0', nodeColor: '#171717', accent: '#3b82f6' },
  dark: { background: '#1a202c', foreground: '#e2e8f0', nodeBg: '#2d3748', nodeColor: '#e2e8f0', accent: '#63b3ed' },
  professional: { background: '#e0e5ec', foreground: '#333333', nodeBg: '#ffffff', nodeColor: '#333333', accent: '#007acc' }, // Example professional theme
  creative: { background: '#fdf4f5', foreground: '#5d5c61', nodeBg: '#fff0f1', nodeColor: '#5d5c61', accent: '#ff758c' }, // Example creative theme
  transient: transientThemes[currentTransientIndex],
};

const ThemeSwitcher: React.FC = () => {
  const [currentThemeName, setCurrentThemeName] = useState<Theme>('light');

  useEffect(() => {
    applyThemeVariables(themes[currentThemeName]);
    if (currentThemeName === 'transient') {
      const intervalId = setInterval(() => {
        currentTransientIndex = (currentTransientIndex + 1) % transientThemes.length;
        const nextTransientTheme = transientThemes[currentTransientIndex];
        themes.transient = nextTransientTheme; // Update the transient theme in the main themes object
        applyThemeVariables(nextTransientTheme);
        // No need to call setCurrentThemeName here as it would re-trigger useEffect unnecessarily for transient
      }, 5000); // Change theme every 5 seconds
      return () => clearInterval(intervalId);
    }
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
        <option value="transient">Transient Flow</option> {/* Added transient option */}
      </select>
    </div>
  );
};

export default ThemeSwitcher;
