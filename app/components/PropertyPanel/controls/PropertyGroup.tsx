'use client';

import React, { useState } from 'react';
import styles from '../PropertyPanel.module.css';

interface PropertyGroupProps {
  title: string;
  children: React.ReactNode;
  isCompact?: boolean;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  priority?: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
  className?: string;
}

export const PropertyGroup: React.FC<PropertyGroupProps> = ({
  title,
  children,
  isCompact = false,
  defaultExpanded = true,
  collapsible = true,
  priority = 'medium',
  icon,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    if (!collapsible) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`
      ${styles.propertyGroup}
      ${styles[`priority-${priority}`] || ''}
      ${isCompact ? styles.compact : ''}
      ${className}
    `}>
      <div 
        className={`
          ${styles.propertyGroupHeader}
          ${collapsible ? styles.clickable : ''}
        `}
        onClick={handleToggle}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={(e) => {
          if (collapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className={styles.propertyGroupTitleContainer}>
          {icon && (
            <span className={styles.propertyGroupIcon}>
              {icon}
            </span>
          )}
          <h4 className={styles.propertyGroupTitle}>
            {title}
          </h4>
        </div>
        
        {collapsible && (
          <span className={`
            ${styles.propertyGroupToggle}
            ${isExpanded ? '' : styles.collapsed}
          `}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </span>
        )}
      </div>
      
      <div className={`
        ${styles.propertyGroupContent}
        ${isExpanded ? '' : styles.collapsed}
      `}>
        {children}
      </div>
    </div>
  );
};
