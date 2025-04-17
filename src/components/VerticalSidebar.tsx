import React, { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { themeClasses } from '../theme/themeClasses';
import { motion } from 'framer-motion';

interface SidebarLink {
  path: string;
  label: string;
  icon: React.ReactNode;
  notification?: number;
  hasNotification?: boolean;
}

// Define an interface for the room object
interface Room {
  id?: string;
  title?: string;
  description?: string;
  availableLanguages?: string[];
  activePolls?: Array<{
    id: string;
    question: string;
    options: string[];
    votes: number[];
  }>;
}

interface VerticalSidebarProps {
  room?: Room;
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
  showEffects?: boolean;
  onEffectChange?: (type: string, value: string) => void;
  onClose?: () => void;
}

const VerticalSidebar: React.FC<VerticalSidebarProps> = ({
  room = {},
  onLanguageChange = () => {},
  currentLanguage = 'English',
  showEffects = false,
  onEffectChange = () => {},
  onClose = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const { themeMode, toggleTheme } = useTheme();
  
  // Handle auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const links = [
    {
      path: '/rooms',
      label: 'Discover',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      path: '/my-rooms',
      label: 'My Rooms',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      hasNotification: true,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  // Check if the current path matches the link
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Use in a room detail page if there are available languages
  const isRoomDetailPage = room && room.availableLanguages && room.availableLanguages.length > 0;

  return (
    <div
      className={`${isExpanded ? 'w-64' : 'w-20'} fixed top-0 left-0 h-screen z-40`}
      style={{ transition: 'width 500ms ease-in-out' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Sidebar Background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-0"></div>
      
      {/* Content Container */}
      <div className="relative flex flex-col h-full py-10 pt-8 px-6 z-10">
        {/* App Logo */}
        <div className={`flex mb-10`}>
          {isExpanded ? (
            <div className="relative">
              <div className="flex items-center">
                <div className="relative">
               
                  {/* Logo container with neumorphic style */}
                  
                </div>
                <div className="ml-2">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">Yag</span>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">Voice</span>
                  
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Logo background with animation */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg opacity-70 blur-sm animate-pulse"></div>
              
              {/* Logo container with neumorphic style */}
              <div className="relative flex items-center justify-center h-10 w-10 rounded-lg bg-white dark:bg-gray-800 
                shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] 
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-3px_-3px_6px_rgba(255,255,255,0.05)]">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">Y</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 minimal-scrollbar">
          {links.map((link) => {
            const isActiveLink = isActive(link.path);
            return (
              <div
                key={link.path}
                className="relative hover:scale-102"
                style={{ transition: 'transform 200ms' }}
                onMouseEnter={() => setActiveSection(link.path)}
                onMouseLeave={() => setActiveSection(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center ${isExpanded ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg ${
                    isActiveLink
                      ? 'bg-gray-100 dark:bg-gray-800 font-medium shadow-[inset_2px_2px_4px_rgba(0,0,0,0.02),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.025)]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.01),inset_-1px_-1px_2px_rgba(255,255,255,0.5)] dark:hover:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.01)]'
                  }`}
                  style={{ transition: 'all 300ms ease' }}
                >
                  {/* Animated Active Indicator */}
                  {isActiveLink && (
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-gradient-to-b from-violet-600 to-purple-600 dark:from-violet-500 dark:to-purple-500"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: '100%', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      layoutId="activeIndicator"
                    />
                  )}
                  
                  {/* Icon with color transition */}
                  <div 
                    className="relative"
                    style={{ 
                      color: isActiveLink ? 'rgb(124, 58, 237)' : 'currentColor',
                      transition: 'color 300ms'
                    }}
                  >
                    {link.icon}
                    {link.hasNotification && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-500 rounded-full"></span>
                )}
              </div>
                  
                  {/* Label with color transition */}
                  {isExpanded && (
                    <span
                      className="ml-3 whitespace-nowrap overflow-hidden"
                      style={{ 
                        color: isActiveLink ? 'rgb(124, 58, 237)' : 'currentColor',
                        transition: 'color 300ms'
                      }}
                    >
                      {link.label}
                    </span>
                  )}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && isHovering && activeSection === link.path && (
                  <div
                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-md shadow-lg z-50 whitespace-nowrap"
                  >
                    {link.label}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-white dark:bg-gray-800 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Divider */}
        <div className="my-4 h-px bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Footer - Theme Toggle */}
        <div className="mt-auto">
          <button
            onClick={toggleTheme}
            className={`w-full flex ${isExpanded ? 'justify-between' : 'justify-center'} items-center px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
            style={{ transition: 'background-color 300ms' }}
          >
            <div className="flex items-center">
              <div className="relative w-6 h-6">
                <div
                  style={{ 
                    opacity: themeMode === 'dark' ? 0 : 1,
                    transform: themeMode === 'dark' ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'opacity 500ms, transform 500ms'
                  }}
                  className="absolute inset-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
                </div>

                <div
                  style={{ 
                    opacity: themeMode === 'dark' ? 1 : 0,
                    transform: themeMode === 'dark' ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'opacity 500ms, transform 500ms'
                  }}
                  className="absolute inset-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <span className="ml-3 whitespace-nowrap overflow-hidden">
                  {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </div>
            
            {isExpanded && (
              <div
                style={{
                  backgroundColor: themeMode === 'dark' ? '#8B5CF6' : '#9CA3AF',
                  transition: 'background-color 300ms'
                }}
                className="w-10 h-5 rounded-full flex items-center p-0.5"
              >
                <div
                  style={{
                    transform: themeMode === 'dark' ? 'translateX(18px)' : 'translateX(0px)',
                    transition: 'transform 300ms'
                  }}
                  className="w-4 h-4 rounded-full bg-white shadow-md"
                />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export as a memoized component to prevent unnecessary re-renders
export default memo(VerticalSidebar);
