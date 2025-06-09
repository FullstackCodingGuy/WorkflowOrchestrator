'use client';

import React, { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'professional' | 'creative';

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  useEffect(() => {
    // Apply theme to the document body or a root element
    // For Tailwind CSS, you might toggle a class like 'dark' on the <html> element
    // document.documentElement.classList.remove('light', 'dark', 'professional', 'creative');
    // document.documentElement.classList.add(currentTheme);
    console.log(`Theme changed to: ${currentTheme}`);
    // This is a placeholder. Actual theme switching will involve updating CSS variables or classes.
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div className="p-2 border-b border-gray-700">
      <span className="mr-2 text-sm">Theme:</span>
      <select 
        onChange={(e) => handleThemeChange(e.target.value as Theme)} 
        value={currentTheme}
        className="p-1 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="professional">Professional</option>
        <option value="creative">Creative</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
