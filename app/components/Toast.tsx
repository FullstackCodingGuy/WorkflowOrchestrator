'use client';

import React, { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300); // Match animation duration
  }, [id, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-100',
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-100',
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-900 dark:text-yellow-100',
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100',
    },
  };

  const styles = typeStyles[type];

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className={`
        rounded-lg border shadow-lg backdrop-blur-sm
        ${styles.bgColor} ${styles.borderColor}
        p-4
      `}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            {icons[type]}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${styles.textColor}`}>
              {title}
            </h3>
            {message && (
              <p className={`mt-1 text-sm opacity-80 ${styles.textColor}`}>
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`
                inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                ${styles.iconColor} hover:${styles.iconColor}
              `}
            >
              <span className="sr-only">Close</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-black/10 dark:bg-white/10 rounded-full h-1">
          <div
            className={`h-1 rounded-full shrink-animation ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Global window interface extension
declare global {
  interface Window {
    showToast?: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  }
}

export interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  hideToast: (id: string) => void;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const hideToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: hideToast,
    };
    setToasts(prev => [...prev, newToast]);
  }, [hideToast]);

  // Expose showToast globally
  React.useEffect(() => {
    window.showToast = showToast;
    return () => {
      window.showToast = undefined;
    };
  }, [showToast]);

  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
}

// Utility function to show toasts from anywhere
export const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
  if (window.showToast) {
    window.showToast(toast);
  }
};
