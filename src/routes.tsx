import React from 'react';
import { Navigate } from 'react-router-dom';

import RoomsListPage from './pages/RoomsListPage';
import MyRoomsPage from './pages/MyRoomsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import RoomPage from './pages/RoomPage';
import JoinRoomPage from './pages/JoinRoomPage';

// Define the route type
interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

// Define routes as an array of objects
const routes: RouteConfig[] = [
  // Default route - redirect to rooms
  {
    path: '/',
    element: <Navigate to="/rooms" replace />
  },
  
  // Rooms routes
  {
    path: '/rooms',
    element: <RoomsListPage />
  },
  {
    path: '/my-rooms',
    element: <MyRoomsPage />
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />
  },
  {
    path: '/join/:roomId',
    element: <JoinRoomPage />
  },
  
  // User routes
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/notifications',
    element: <NotificationsPage />
  },
  
  // Diagnostics route
  {
    path: '/diagnostics',
    element: <DiagnosticsPage />
  },
  
  // Create room route - now uses the dedicated CreateRoomPage
  {
    path: '/create-room',
    element: <CreateRoomPage />
  },
  
  // 404 - Not found
  {
    path: '*',
    element: <div className="p-8 text-center">Page Not Found</div>
  }
];

export default routes;
