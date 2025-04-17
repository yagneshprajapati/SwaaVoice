import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses } from '../theme/themeClasses';
import { useTheme } from '../theme/ThemeProvider';
import { mockRooms } from '../mocks/rooms';
import { Room } from '../types/room';

const RoomsListPage: React.FC = () => {
  const { themeMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [currentTopic, setCurrentTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');
  const [remindedRooms, setRemindedRooms] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Get all unique topics
  const allTopics = Array.from(
    new Set(mockRooms.flatMap(room => room.topics))
  );
  
  // Filter rooms based on current filter and search
  const filteredRooms = mockRooms.filter(room => {
    const statusMatch = 
      currentFilter === 'all' || 
      (currentFilter === 'live' && room.isLive) || 
      (currentFilter === 'upcoming' && !room.isLive && room.scheduledFor);
      
    const topicMatch = 
      currentTopic === 'all' || 
      room.topics.includes(currentTopic);
      
    const searchMatch = !searchTerm || 
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.topics.some(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    return statusMatch && topicMatch && searchMatch;
  });
  
  // Sort rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.participantCount - a.participantCount;
      case 'recent':
        if (a.startedAt && b.startedAt) {
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        }
        return 0;
      case 'topics':
        return b.topics.length - a.topics.length;
      default:
        return 0;
    }
  });

  // Handle remind me click
  const handleRemindMe = (roomId: string, roomTitle: string) => {
    // Check if room is already in reminded list
    if (!remindedRooms.includes(roomId)) {
      // Add room to reminded list
      setRemindedRooms([...remindedRooms, roomId]);
      
      // Show notification
      setNotificationMessage(`You'll be notified when '${roomTitle}' goes live`);
      setShowNotification(true);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };
  
  return (
    <div className="h-full overflow-y-auto minimal-scrollbar">
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg max-w-md w-5/6 text-center"
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base font-medium">{notificationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - compact with inline filters */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/95 dark:bg-gray-900/95 pb-5 pt-3 px-1">
        <motion.div 
          className="flex items-center justify-between flex-wrap gap-3 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="page-title text-2xl font-bold text-gray-900 dark:text-white">Discover Rooms</h1>
          
          {/* Search, filters and sort in one line */}
          <div className="flex items-center gap-3 flex-1 max-w-4xl">
            {/* Search bar with neumorphic styling */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute left-4 text-gray-400 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search rooms, topics, or hosts..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl
                  shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.5)]
                  dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.03)]
                  focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]
                  dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.03)]
                  text-gray-800 dark:text-gray-200 focus:outline-none transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          
            {/* Filter Pills with neumorphic styling */}
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 
                  ${currentFilter === 'all'
                    ? 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]'
                  }`}
                onClick={() => setCurrentFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 
                  ${currentFilter === 'live'
                    ? 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]'
                  }`}
                onClick={() => setCurrentFilter('live')}
              >
                Live
              </button>
              <button
                className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 
                  ${currentFilter === 'upcoming'
                    ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]'
                  }`}
                onClick={() => setCurrentFilter('upcoming')}
              >
                Upcoming
              </button>
            </div>
            
            {/* Dropdown with neumorphic styling */}
            <div className="relative min-w-[130px]">
              <select
                className="appearance-none w-full px-4 pr-8 py-2.5 text-sm
                  bg-gray-50 dark:bg-gray-800 rounded-xl
                  shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                  dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                  dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                  text-gray-700 dark:text-gray-300 font-medium
                  focus:outline-none transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="topics">Most Topics</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        </div>

      {/* Room cards with optimized grid */}
      {sortedRooms.length > 0 ? (
          <motion.div 
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
          <AnimatePresence>
            {sortedRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
                className="group h-full"
                whileHover={{ 
                  y: -4,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                {/* Neumorphic card container - no borders */}
                <div className="relative h-full overflow-hidden rounded-xl 
                  bg-gray-50 dark:bg-gray-800
                  shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
                  dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]
                  transition-all duration-300 
                  hover:shadow-[8px_8px_16px_0px_rgba(0,0,0,0.08),-8px_-8px_16px_0px_rgba(255,255,255,0.9)] 
                  dark:hover:shadow-[7px_7px_14px_0px_rgba(0,0,0,0.6),-7px_-7px_14px_0px_rgba(255,255,255,0.07)]"
                >
                  <div className="p-5 h-full flex flex-col">
                    {/* Header with status and meta */}
                    <div className="flex justify-between items-start mb-4">
                      {/* Status indicator */}
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        ${room.isLive 
                          ? 'text-red-800 bg-red-50 dark:text-red-200 dark:bg-red-900/30' 
                          : room.scheduledFor 
                          ? 'text-blue-800 bg-blue-50 dark:text-blue-200 dark:bg-blue-900/30' 
                          : 'text-violet-800 bg-violet-50 dark:text-violet-200 dark:bg-violet-900/30'
                        }`}
                      >
                        {room.isLive && (
                          <span className="relative flex h-2 w-2 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-500"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 dark:bg-red-400"></span>
                          </span>
                        )}
                        <span className="truncate">
                          {room.isLive ? 'Live Now' : room.scheduledFor ? 'Upcoming' : 'Completed'}
                    </span>
                      </div>
                      
                      {/* Time and participant info */}
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                          <span className="truncate">
                            {room.startedAt 
                              ? new Date(room.startedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                              : room.scheduledFor 
                              ? new Date(room.scheduledFor).toLocaleDateString([], {month: 'short', day: 'numeric'})
                              : 'Recorded'
                            }
                    </span>
                  </div>
                  
                        <div className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{room.participantCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content area */}
                    <div className="flex flex-row gap-4 mb-4 flex-1">
                      {/* Host avatar column with neumorphic styling */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full overflow-hidden
                            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]
                            dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
                          >
                            <img 
                              src={room.hostAvatar} 
                              alt={room.hostName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full 
                            shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.7)]
                            dark:shadow-[1px_1px_2px_rgba(0,0,0,0.4),-1px_-1px_2px_rgba(255,255,255,0.05)]
                            ${room.isLive 
                              ? 'bg-red-400 dark:bg-red-500' 
                              : room.scheduledFor 
                              ? 'bg-blue-400 dark:bg-blue-500' 
                              : 'bg-violet-400 dark:bg-violet-500'
                            }`}
                          ></div>
                    </div>
                  </div>
                  
                      {/* Room info column */}
                      <div className="min-w-0 flex-1">
                        {/* Title */}
                        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1">
                          {room.title}
                        </h2>
                        
                        {/* Host name */}
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {room.hostName}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">• Host</span>
                      </div>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {room.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Footer with topics and action - no border */}
                    <div className="mt-auto pt-3 flex justify-between items-center gap-2">
                      {/* Topics with neumorphic styling */}
                      <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                      {room.topics.slice(0, 2).map((topic, index) => (
                        <span 
                          key={index}
                            className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs
                              bg-gray-100 text-gray-600
                              dark:bg-gray-700 dark:text-gray-300
                              shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
                              dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]"
                        >
                          {topic}
                        </span>
                      ))}
                      {room.topics.length > 2 && (
                          <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs
                            bg-gray-100 text-gray-600
                            dark:bg-gray-700 dark:text-gray-300
                            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
                            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]"
                          >
                            +{room.topics.length - 2} more
                        </span>
                      )}
                  </div>
                  
                      {/* Action button with neumorphic styling */}
                      <div>
                        {room.isLive ? (
                          <Link
                            to={`/join/${room.id}?isDiscovery=true`}
                            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg
                              text-red-600 bg-red-50 
                              dark:text-red-200 dark:bg-red-900/20
                              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                              dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                              active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                              dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                              transition-all duration-200 whitespace-nowrap`}
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                            <span className="font-medium text-xs">Join Now</span>
                          </Link>
                        ) : room.scheduledFor ? (
                          <button
                            onClick={() => handleRemindMe(room.id, room.title)}
                            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg
                              ${remindedRooms.includes(room.id)
                                ? 'text-green-600 bg-green-50 dark:text-green-200 dark:bg-green-900/20'
                                : 'text-blue-600 bg-blue-50 dark:text-blue-200 dark:bg-blue-900/20'
                              }
                              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                              dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                              active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                              dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                              transition-all duration-200 whitespace-nowrap`}
                          >
                            {remindedRooms.includes(room.id) ? (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium text-xs">Reminded</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium text-xs">Remind Me</span>
                              </>
                            )}
                          </button>
                        ) : (
                    <Link 
                      to={`/rooms/${room.id}`}
                            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg
                              text-violet-600 bg-violet-50 
                              dark:text-violet-200 dark:bg-violet-900/20
                              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                              dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                              active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                              dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                              transition-all duration-200 whitespace-nowrap`}
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="font-medium text-xs">View Room</span>
                    </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
          className="flex flex-col items-center justify-center text-center py-12 bg-white/80 dark:bg-gray-800/80 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11h.01M12 11h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No rooms found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Link
            to="/create-room"
            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
                Create a Room
          </Link>
          </motion.div>
        )}
    </div>
  );
};

export default RoomsListPage;
