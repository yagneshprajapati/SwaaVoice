import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  bio: string;
  isVerified: boolean;
  joinedDate: string;
}

// Define the context type
interface UserContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Default user data
const defaultUser: User = {
  id: 'user-yagnesh',
  name: 'Yagnesh P.',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&auto=format',
  email: 'yagnesh.p@example.com',
  bio: 'Tech enthusiast and software developer passionate about AI and web technologies.',
  isVerified: true,
  joinedDate: '2023-01-15T00:00:00Z'
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  currentUser: defaultUser,
  isAuthenticated: true,
  login: () => {},
  logout: () => {}
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const login = () => {
    setCurrentUser(defaultUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 