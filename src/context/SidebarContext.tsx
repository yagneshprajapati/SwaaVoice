import React, { createContext, useState, useContext } from 'react';

interface SidebarContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isSidebarExpanded: true,
  setIsSidebarExpanded: () => {},
  toggle: () => {},
  open: () => {},
  close: () => {}
});

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  const toggle = () => setIsSidebarExpanded(prev => !prev);
  const open = () => setIsSidebarExpanded(true);
  const close = () => setIsSidebarExpanded(false);

  return (
    <SidebarContext.Provider value={{ 
      isSidebarExpanded, 
      setIsSidebarExpanded,
      toggle,
      open,
      close
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}; 