import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'text' | 'avatar' | 'button' | 'card' | 'rectangle';
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'rectangle',
  width,
  height,
  rounded = 'md',
  className = '',
  animate = true
}) => {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  // Default dimensions based on type
  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    avatar: { width: '3rem', height: '3rem' },
    button: { width: '6rem', height: '2.5rem' },
    card: { width: '100%', height: '8rem' },
    rectangle: { width: '100%', height: '4rem' }
  };

  const finalWidth = width || defaultDimensions[type].width;
  const finalHeight = height || defaultDimensions[type].height;

  const baseClasses = [
    'bg-gray-200 dark:bg-gray-700',
    roundedMap[rounded],
    className
  ].join(' ');

  if (animate) {
    return (
      <motion.div
        className={baseClasses}
        style={{ width: finalWidth, height: finalHeight }}
        animate={{ 
          opacity: [0.5, 0.7, 0.5] 
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut'
        }}
      />
    );
  }

  return (
    <div
      className={baseClasses}
      style={{ width: finalWidth, height: finalHeight }}
    />
  );
};

// Create composable components for different skeleton types
export const SkeletonText: React.FC<Omit<SkeletonLoaderProps, 'type'>> = (props) => (
  <SkeletonLoader type="text" {...props} />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonLoaderProps, 'type' | 'rounded'>> = (props) => (
  <SkeletonLoader type="avatar" rounded="full" {...props} />
);

export const SkeletonButton: React.FC<Omit<SkeletonLoaderProps, 'type'>> = (props) => (
  <SkeletonLoader type="button" rounded="lg" {...props} />
);

export const SkeletonCard: React.FC<Omit<SkeletonLoaderProps, 'type'>> = (props) => (
  <SkeletonLoader type="card" rounded="lg" {...props} />
);

// Create a content placeholder with multiple skeleton elements
export const ContentPlaceholder: React.FC = () => (
  <div className="space-y-4">
    <SkeletonText height="2rem" className="w-3/4" />
    <SkeletonText height="1rem" />
    <SkeletonText height="1rem" />
    <SkeletonText height="1rem" className="w-4/5" />
    <div className="pt-2" />
    <SkeletonText height="1rem" className="w-2/3" />
  </div>
);

export default SkeletonLoader;
