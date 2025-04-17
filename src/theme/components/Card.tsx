import React from 'react';
import { themeClasses } from '../themeClasses';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'flat';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const getCardClasses = () => {
    const variantMap = {
      default: themeClasses.card.base,
      interactive: `${themeClasses.card.base} ${themeClasses.card.interactive}`,
      flat: themeClasses.card.flat,
    };
    
    return `${variantMap[variant]} ${className}`;
  };
  
  return (
    <div 
      className={getCardClasses()}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
