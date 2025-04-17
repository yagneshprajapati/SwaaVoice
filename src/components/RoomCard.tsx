import { Link } from 'react-router-dom';
import * as Avatar from '@radix-ui/react-avatar';
import { motion } from 'framer-motion';
import { useState } from 'react';

type RoomCardProps = {
  id: string;
  title: string;
  theme: string;
  description?: string;
  participantCount: number;
  hostName: string;
  hostAvatar: string;
  isLive: boolean;
  scheduledFor?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
};

const RoomCard = ({ 
  id, 
  title, 
  theme, 
  description,
  participantCount, 
  hostName, 
  hostAvatar, 
  isLive,
  scheduledFor,
  location
}: RoomCardProps) => {
  // Track image loading errors
  const [hostImageError, setHostImageError] = useState(false);
  
  // Format location string
  const getLocationString = () => {
    if (!location) return '';
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  const locationString = getLocationString();

  // Format scheduled time (if applicable)
  const formatScheduledTime = () => {
    if (!scheduledFor) return '';
    
    const scheduled = new Date(scheduledFor);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (scheduled.toDateString() === today.toDateString()) {
      return `Today at ${scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (scheduled.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return scheduled.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Generate a consistent pseudo-random color based on the input string
  const generateColor = (input: string) => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate color with good contrast
    const h = hash % 360;
    const s = 70 + (hash % 20); 
    const l = 65 + (hash % 10);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  // Generate gradient based on room title and theme
  const generateGradient = (title: string, theme: string) => {
    const seed = title + theme;
    const hash = Math.abs(seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0));

    // Create gradient with theme-appropriate colors
    const hue1 = (hash) % 360;
    const hue2 = (hue1 + 40) % 360;
    const angle = (hash % 360);
    
    return `linear-gradient(${angle}deg, hsl(${hue1}, 70%, 75%), hsl(${hue2}, 80%, 65%))`;
  };
  
  // Card style generators
  const cardHeaderStyle = {
    background: generateGradient(title, theme),
  };
  
  // Avatar style
  const avatarStyle = {
    background: generateColor(hostName),
  };

  return (
    <motion.div 
      className="h-full"
      whileHover={{ y: -5, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to={`/rooms/${id}`} className="block h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200 flex flex-col shadow-lg">
        {/* Card Header with Theme-based Gradient */}
        <div className="relative h-32 w-full overflow-hidden" style={cardHeaderStyle}>
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Status indicator (live/scheduled) */}
          <div className="absolute top-2 right-2 z-10">
            {isLive ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                <span className="animate-pulse w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                LIVE
              </span>
            ) : scheduledFor && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500 text-white shadow-lg">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatScheduledTime()}
              </span>
            )}
          </div>
          
          {/* Visual Audio Waves Embellishment */}
          <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center pb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 mx-0.5 bg-white bg-opacity-70 rounded-t"
                animate={{
                  height: isLive 
                    ? [4 + Math.random() * 10, 12 + Math.random() * 20, 4 + Math.random() * 10] 
                    : 4 + (i % 3) * 3
                }}
                transition={{
                  repeat: isLive ? Infinity : 0,
                  duration: isLive ? 1 + Math.random() : 0,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Room title on the card header */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-lg font-bold text-white line-clamp-1 drop-shadow-md">
              {title}
            </h3>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white whitespace-nowrap backdrop-blur-sm">
                {theme}
              </span>
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4 flex-grow flex flex-col relative">
          {/* Room avatar - generated based on title */}
          <div className="absolute -top-6 right-4">
            <Avatar.Root className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-md">
              <Avatar.Fallback 
                className="h-full w-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: generateColor(title) }}
              >
                {title.substring(0, 2).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          
          <div className="mt-2">
            {description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
            )}
          </div>
          
          {/* Location info */}
          {locationString && (
            <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationString}
            </div>
          )}
          
          {/* Host info and participant count */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar.Root className="inline-block h-6 w-6 rounded-full overflow-hidden">
                <Avatar.Fallback 
                  className="h-full w-full flex items-center justify-center text-xs font-medium text-white"
                  style={avatarStyle}
                >
                  {hostName.substring(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                {hostName}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {participantCount}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RoomCard;
