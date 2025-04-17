import { Link } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Avatar from '@radix-ui/react-avatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import LogoIcon from './icons/LogoIcon';
import ThemeToggle from './ThemeToggle';
import CreateRoomModal from './CreateRoomModal';
import useStore from '../store/useStore';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();
  const { isCreateRoomModalOpen, openCreateRoomModal, closeCreateRoomModal, addRoom } = useStore();
  
  const handleCreateRoom = (roomData: {
    title: string;
    description: string;
    theme: string;
    isPrivate: boolean;
  }) => {
    // Add the new room to the store
    addRoom({
      id: `room-${Date.now()}`,
      title: roomData.title,
      theme: roomData.theme,
      description: roomData.description,
      participantCount: 1,
      hostName: 'Current User', // In a real app, use the current user's name
      hostAvatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop',
      isLive: true,
      createdAt: new Date().toISOString(),
    });
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationMenu.Root className="relative flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <LogoIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EchoSphere</span>
            </Link>
          </div>
          
          <NavigationMenu.List className="hidden md:flex space-x-6">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link to="/rooms" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                  Explore Rooms
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            
            <NavigationMenu.Item>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={openCreateRoomModal}
              >
                Create Room
              </motion.button>
            </NavigationMenu.Item>
          </NavigationMenu.List>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2 hidden md:inline">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <ThemeToggle />
            </div>
            
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="outline-none focus:ring-2 focus:ring-primary-500 rounded-full">
                  <Avatar.Root className="cursor-pointer inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full bg-secondary-100 align-middle">
                    <Avatar.Image
                      className="h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                      alt="User Avatar"
                    />
                    <Avatar.Fallback className="text-secondary-600 leading-none flex h-full w-full items-center justify-center bg-secondary-100 font-medium">
                      US
                    </Avatar.Fallback>
                  </Avatar.Root>
                </button>
              </DropdownMenu.Trigger>
              
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 z-50 border border-gray-200 dark:border-gray-700"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="outline-none px-2 py-2 text-sm text-gray-700 dark:text-gray-300 flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <Link to="/profile/1" className="flex items-center w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Item className="outline-none px-2 py-2 text-sm text-gray-700 dark:text-gray-300 flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  
                  <DropdownMenu.Item className="outline-none px-2 py-2 text-sm text-red-600 dark:text-red-500 flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            
            <button className="md:hidden text-gray-700 dark:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </NavigationMenu.Root>
      </div>
      
      <CreateRoomModal 
        isOpen={isCreateRoomModalOpen}
        onClose={closeCreateRoomModal}
        onCreateRoom={handleCreateRoom}
      />
    </header>
  );
};

export default Navbar;
