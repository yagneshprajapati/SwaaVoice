import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationLink {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const links: NavigationLink[] = [
    {
      path: '/rooms',
      label: 'Rooms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {links.map((link) => {
            // Check if the current path matches this link
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className="relative py-3 flex-1 flex flex-col items-center justify-center"
              >
                {isActive && (
                  <motion.div 
                    layoutId="navigation-pill"
                    className="absolute inset-x-2 -top-2 h-1 bg-primary-600 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
                <span className={`p-1 rounded-lg ${isActive ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  {link.icon}
                </span>
                <span className={`text-xs ${isActive ? 'font-semibold text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
