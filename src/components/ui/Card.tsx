import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  withShadow?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
  initial?: any;
  animate?: any;
  transition?: any;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  withShadow = true,
  noPadding = false,
  onClick,
  initial,
  animate,
  transition,
  ...rest
}) => {
  const baseClasses = [
    'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden',
    withShadow ? 'card-shadow' : '',
    noPadding ? '' : 'p-4',
    className
  ].filter(Boolean).join(' ');

  if (initial || animate || transition) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        initial={initial}
        animate={animate}
        transition={transition}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div 
      className={baseClasses}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
