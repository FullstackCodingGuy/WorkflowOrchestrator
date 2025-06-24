import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean; // Add separator after this item
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  position?: 'left' | 'right';
}

export function DropdownMenu({ 
  trigger, 
  items, 
  className = '', 
  position = 'left' 
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute top-full mt-1 z-50 min-w-[200px] bg-white border border-border rounded-lg shadow-lg overflow-hidden
          ${position === 'right' ? 'right-0' : 'left-0'}
        `}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <div
                className={`
                  flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors
                  ${item.disabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && (
                    <span className="w-4 h-4 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 font-mono">
                    {item.shortcut}
                  </span>
                )}
              </div>
              {item.separator && index < items.length - 1 && (
                <div className="border-t border-gray-200 my-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
