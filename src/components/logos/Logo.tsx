import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  compact?: boolean;
  animated?: boolean;
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
}

const Logo: React.FC<LogoProps> = ({
  className = '',
  compact = false,
  animated = true,
  withText = true,
  size = 'md',
  theme = 'auto',
}) => {
  // Size mappings
  const sizes = {
    sm: { icon: 24, text: 16, spacing: 8 },
    md: { icon: 32, text: 20, spacing: 12 },
    lg: { icon: 48, text: 28, spacing: 16 },
  };

  const currentSize = sizes[size];
  
  // Animation variants
  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: compact ? 0 : 5, 
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };
  
  const pathVariants = {
    initial: { pathLength: 1, opacity: 1 },
    hover: { 
      pathLength: [1, 0.8, 1],
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  // Generate gradient IDs to avoid conflicts when multiple logos are rendered
  const gradientId = React.useMemo(() => `logo-gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const textGradientId = React.useMemo(() => `logo-text-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  // Get colors based on theme
  const getColors = () => {
    if (theme === 'light' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      return {
        primary: '#6A0DAD', // Purple
        secondary: '#FF1493', // Pink
        tertiary: '#4B0082', // Indigo
      };
    } else {
      return {
        primary: '#9370DB', // Medium Purple
        secondary: '#FF69B4', // Hot Pink
        tertiary: '#8A2BE2', // Blue Violet
      };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div
        initial="initial"
        whileHover={animated ? "hover" : "initial"}
        variants={iconVariants}
        className="relative"
      >
        {/* SVG Logo */}
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.tertiary} />
            </linearGradient>
          </defs>

          {/* Background circle with filter and glow */}
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            variants={pathVariants}
            filter="drop-shadow(0px 0px 2px rgba(106, 13, 173, 0.5))"
          />

          {/* Question mark part */}
          <motion.path
            d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
          />

          {/* Dot of question mark */}
          <motion.path
            d="M12 17H12.01"
            stroke={`url(#${gradientId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
          />

          {/* Decorative wave path */}
          <motion.path
            d="M7 10.6C7 6 9.5 5.5 11 6L7 15.5C7 15.5 8.5 19 13.5 19C18.5 19 19.5 15.5 19.5 15.5L16.5 10"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
          />
          
          {/* Additional decorative element */}
          <motion.circle
            cx="12"
            cy="12"
            r="6"
            stroke={`url(#${gradientId})`}
            strokeWidth="0.5"
            strokeDasharray="1 2"
            fill="transparent"
            variants={pathVariants}
          />
        </svg>
      </motion.div>

      {/* Text part of the logo */}
      {withText && !compact && (
        <motion.div 
          className="ml-3"
          initial={{ opacity: 1, x: 0 }}
          whileHover={{ opacity: 1, x: 2 }}
          transition={{ duration: 0.3 }}
        >
          <svg 
            width={currentSize.text * 5} 
            height={currentSize.text * 1.2}
            viewBox="0 0 100 24"
          >
            <defs>
              <linearGradient id={textGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="50%" stopColor={colors.secondary} />
                <stop offset="100%" stopColor={colors.tertiary} />
              </linearGradient>
            </defs>
            <text
              x="0"
              y="18"
              fontFamily="sans-serif"
              fontWeight="700"
              fontSize="20"
              fill={`url(#${textGradientId})`}
            >
              WON
            </text>
          </svg>
        </motion.div>
      )}
    </div>
  );
};

export default Logo; 