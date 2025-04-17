import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import VerticalSidebar from './VerticalSidebar';
import { SidebarContext } from '../context/SidebarContext';

// PageTransition wrapper component for smooth page transitions
const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function Layout() {
  const { isSidebarExpanded, setIsSidebarExpanded } = useContext(SidebarContext);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const location = useLocation();
  
  // Check window size
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);
      if (!mobileView) {
        setShowMobileMenu(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user has already responded to microphone permission
  useEffect(() => {
    const hasResponded = localStorage.getItem('microphonePermissionResponse');
    if (!hasResponded) {
      setShowMicPermissionModal(true);
    }
  }, []);

  const handleMicrophonePermission = (allow) => {
    localStorage.setItem('microphonePermissionResponse', allow ? 'allowed' : 'denied');
    setShowMicPermissionModal(false);
    
    if (allow) {
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          // Stop the stream immediately, we just needed permission
          stream.getTracks().forEach(track => track.stop());
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    }
  };

  // Memoize the sidebar to prevent re-renders when navigating between pages
  const desktopSidebar = useMemo(() => (
    <div className={`hidden md:block transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
      <VerticalSidebar />
    </div>
  ), [isSidebarExpanded]);

  // Memoize the mobile sidebar
  const mobileSidebar = useMemo(() => (
    isMobileView && (
      <motion.div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: showMobileMenu ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setShowMobileMenu(false)}
        style={{ pointerEvents: showMobileMenu ? 'auto' : 'none' }}
      >
        <motion.div 
          className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 z-50"
          initial={{ x: '-100%' }}
          animate={{ x: showMobileMenu ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <VerticalSidebar onClose={() => setShowMobileMenu(false)} />
        </motion.div>
          </motion.div>
    )
  ), [isMobileView, showMobileMenu]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Desktop Sidebar - Memoized */}
      {desktopSidebar}
      
      {/* Mobile Sidebar - Memoized */}
      {mobileSidebar}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav for Mobile */}
        {isMobileView && (
          <div className="bg-white dark:bg-gray-800 p-4 shadow">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
          </div>
        )}
        
        {/* Content Area with Page Transitions */}
        <main className="flex-1 overflow-y-auto bg-[url('/subtle-pattern.svg')] dark:bg-none bg-gray-50 dark:bg-gray-900 bg-opacity-50">
          <div className="h-full px-[42px] py-[42px] md:px-[48px] md:py-[42px]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
              </div>
              
      {/* Microphone Permission Modal */}
      {showMicPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Microphone Access</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This app uses voice commands for enhanced navigation. Would you like to allow microphone access?
            </p>
            <div className="flex justify-end space-x-4">
                <button 
                onClick={() => handleMicrophonePermission(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                Deny
                </button>
                <button
                onClick={() => handleMicrophonePermission(true)}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              >
                Allow
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
