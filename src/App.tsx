import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { SidebarProvider } from './context/SidebarContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import routes from './routes';

const App: React.FC = () => {
  const location = useLocation();
  
  return (
    <ThemeProvider>
      <UserProvider>
        <SidebarProvider>
          <Routes location={location} key={location.pathname}>
            <Route element={<Layout />}>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Routes>
        </SidebarProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
