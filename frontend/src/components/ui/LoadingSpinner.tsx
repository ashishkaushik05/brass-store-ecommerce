/**
 * LoadingSpinner Component
 * Reusable loading indicator with different sizes
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`inline-block ${sizeClasses[size]} border-primary-main border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background-light bg-opacity-90 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * LoadingPage Component
 * Full page loading state
 */
export const LoadingPage: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-text-secondary text-sm">{message}</p>
      )}
    </div>
  );
};

/**
 * LoadingSection Component
 * Section loading state
 */
export const LoadingSection: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <LoadingSpinner size="md" />
      {message && (
        <p className="mt-3 text-text-secondary text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
