import React from 'react';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  fullScreen = false
}) => {
  // Size mapping
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  // Color mapping
  const colorMap = {
    primary: 'from-violet-500 to-purple-600',
    secondary: 'from-gray-400 to-gray-500',
    white: 'from-white/80 to-white/60'
  };
  
  // Container classes
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center';
  
  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer glow effect */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${colorMap[color]} rounded-full blur-md opacity-30`}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        
        {/* Neumorphic spinner */}
        <div className={`relative ${sizeMap[size]} rounded-full bg-gray-50 dark:bg-gray-800 
          shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] 
          dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-3px_-3px_6px_rgba(255,255,255,0.05)]
          overflow-hidden`}
        >
          {/* Colored spinner gradient */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-r ${colorMap[color]}`}
            style={{ originY: "50%", originX: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          
          {/* Center circle */}
          <div className="absolute inset-[15%] rounded-full bg-gray-50 dark:bg-gray-800 
            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.6)] 
            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]"
          />
        </div>
      </div>
      
      {/* Optional text */}
      {text && (
        <motion.p 
          className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingIndicator; 