import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import MobileHeader from '../MobileHeader';

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header - shows only on mobile */}
      {isMobile && <MobileHeader />}
      
      {/* Sidebar - always visible on desktop, hidden in mobile */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
