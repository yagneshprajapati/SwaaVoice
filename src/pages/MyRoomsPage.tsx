import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for user's rooms
const initialRooms = [
  {
    id: 'room-2',
    title: 'Design Systems for Modern Web Applications',
    description: 'Exploring best practices for creating scalable design systems.',
    participantCount: 32,
    speakerCount: 2,
    startedAt: null,
    scheduledFor: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    isLive: false,
    isHost: true,
    topics: ['Design', 'UI/UX', 'Web Development'],
  },
  {
    id: 'room-3',
    title: 'Blockchain and Web3: Beyond the Hype',
    description: 'A critical analysis of blockchain technology and its real-world applications.',
    participantCount: 45,
    speakerCount: 3,
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    scheduledFor: null,
    isLive: true,
    isHost: false,
    topics: ['Blockchain', 'Web3', 'Cryptocurrency'],
  },
  {
    id: 'room-4',
    title: 'Remote Work Strategies for Distributed Teams',
    description: 'Best practices for managing and thriving in remote work environments.',
    participantCount: 28,
    speakerCount: 2,
    startedAt: null,
    scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    isLive: false,
    isHost: true,
    topics: ['Remote Work', 'Management', 'Productivity'],
  }
];

const MyRoomsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'hosted' | 'joined' | 'upcoming'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [myRooms, setMyRooms] = useState(initialRooms);
  const [newRoomData, setNewRoomData] = useState({
    title: '',
    description: '',
    isPrivate: false,
    scheduledFor: '',
    topics: ['']
  });
  const navigate = useNavigate();

  // Get search params to check if we should open the create modal
  const [searchParams] = useSearchParams();
  
  // Load rooms from localStorage on mount
  useEffect(() => {
    try {
      const storedRooms = JSON.parse(localStorage.getItem('myCreatedRooms') || '[]');
      if (storedRooms && storedRooms.length > 0) {
        setMyRooms([...initialRooms, ...storedRooms]);
      }
    } catch (error) {
      console.error('Error loading rooms from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    const shouldCreate = searchParams.get('create') === 'true';
    if (shouldCreate) {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  // Filter rooms based on current filter
  const filteredRooms = myRooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'hosted') return room.isHost;
    if (filter === 'joined') return !room.isHost;
    if (filter === 'upcoming') return room.scheduledFor !== null;
    return true;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating room with data:", newRoomData);
    // Here you would typically make an API call to create the room
    setShowCreateModal(false);
    
    // Navigate to the new create room page instead
    navigate('/create-room');
    
    // Reset form
    setNewRoomData({
      title: '',
      description: '',
      isPrivate: false,
      scheduledFor: '',
      topics: ['']
    });
  };

  const addTopic = () => {
    if (newRoomData.topics.length < 5) {
      setNewRoomData({
        ...newRoomData,
        topics: [...newRoomData.topics, '']
      });
    }
  };

  const updateTopic = (index: number, value: string) => {
    const updatedTopics = [...newRoomData.topics];
    updatedTopics[index] = value;
    setNewRoomData({
      ...newRoomData,
      topics: updatedTopics
    });
  };

  const removeTopic = (index: number) => {
    if (newRoomData.topics.length > 1) {
      setNewRoomData({
        ...newRoomData,
        topics: newRoomData.topics.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Header - sticky with neumorphic styling */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/95 dark:bg-gray-900/95 pb-5 pt-3 px-1">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="page-title text-2xl font-bold text-gray-900 dark:text-white">My Rooms</h1>

              {/* Filters with neumorphic styling */}
        <motion.div 
          className="flex space-x-3 mb-5 overflow-x-auto pb-1 pr-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {(['all', 'hosted', 'joined', 'upcoming'] as const).map((filterOption) => (
            <button
              key={filterOption}
              className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 
                ${filter === filterOption
                  ? `text-${filterOption === 'all' ? 'violet' : filterOption === 'hosted' ? 'green' : filterOption === 'joined' ? 'purple' : 'blue'}-700 
                     dark:text-${filterOption === 'all' ? 'violet' : filterOption === 'hosted' ? 'green' : filterOption === 'joined' ? 'purple' : 'blue'}-300 
                     bg-${filterOption === 'all' ? 'violet' : filterOption === 'hosted' ? 'green' : filterOption === 'joined' ? 'purple' : 'blue'}-50 
                     dark:bg-${filterOption === 'all' ? 'violet' : filterOption === 'hosted' ? 'green' : filterOption === 'joined' ? 'purple' : 'blue'}-900/20 
                     shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] 
                     dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]`
                  : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]'
                }`}
              onClick={() => setFilter(filterOption)}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} Rooms
            </button>

          ))}
            <motion.button
            className="px-4 pr-4 py-2.5 rounded-xl text-white text-sm font-medium
              bg-gradient-to-r from-violet-500 to-violet-600
              shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
              dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
              hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
              dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
              transition-all duration-200 flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/create-room')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Room
          </motion.button>
          
        </motion.div>
        
        </motion.div>
        
    
      </div>
      
      {/* Room cards with neumorphic styling */}
      {filteredRooms.length > 0 ? (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
          {filteredRooms.map((room, index) => (
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
              {/* Neumorphic card container */}
              <div className={`w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden
                shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
                dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]
                dark:border dark:border-gray-700/30
                transform transition-all duration-300
                hover:shadow-[8px_8px_16px_0px_rgba(0,0,0,0.08),-8px_-8px_16px_0px_rgba(255,255,255,0.9)] 
                dark:hover:shadow-[7px_7px_14px_0px_rgba(0,0,0,0.6),-7px_-7px_14px_0px_rgba(255,255,255,0.07)]
                hover:translate-y-[-4px] hover:scale-[1.01]`}
              >
                <div className="p-5 h-full flex flex-col">
                  {/* Room status badge */}
                  <div className="flex justify-between items-start mb-4">
                    {/* Status indicator */}
                    {room.isLive ? (
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        text-red-800 bg-red-50 dark:text-red-200 dark:bg-red-900/30"
                      >
                        <span className="relative flex h-2 w-2 mr-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-500"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 dark:bg-red-400"></span>
                        </span>
                        <span>Live Now</span>
                      </div>
                    ) : room.scheduledFor ? (
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        text-blue-800 bg-blue-50 dark:text-blue-200 dark:bg-blue-900/30"
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Upcoming</span>
                      </div>
                    ) : room.isHost ? (
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        text-green-800 bg-green-50 dark:text-green-200 dark:bg-green-900/30"
                      >
                        <span>Hosted by You</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-700/50"
                      >
                        <span>Attended</span>
                      </div>
                    )}
                    
                    {/* Participant and speaker count */}
                    <div className="flex space-x-3 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {room.participantCount}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        {room.speakerCount}
                      </div>
                    </div>
                  </div>
                  
                  {/* Room title and description */}
                  <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1.5 line-clamp-2">{room.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{room.description}</p>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
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
                  
                  {/* Footer with time and action button */}
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      {room.scheduledFor && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(room.scheduledFor).toLocaleDateString()} at {new Date(room.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      {room.startedAt && !room.isLive && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(room.startedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/room/${room.id}`}
                      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg
                        ${room.isLive 
                          ? 'text-red-600 bg-red-50 dark:text-red-200 dark:bg-red-900/20' 
                          : room.scheduledFor
                          ? 'text-blue-600 bg-blue-50 dark:text-blue-200 dark:bg-blue-900/20'
                          : 'text-violet-600 bg-violet-50 dark:text-violet-200 dark:bg-violet-900/20'
                        }
                        shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                        dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                        hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                        dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                        active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                        dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                        transition-all duration-200 whitespace-nowrap text-xs font-medium`}
                    >
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {room.isLive ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        ) : room.scheduledFor ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                      </svg>
                      {room.isLive ? 'Join Now' : room.scheduledFor ? 'View Details' : 'View Recap'}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center text-center py-16 bg-white/80 dark:bg-gray-800/80 rounded-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11h.01M12 11h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No rooms found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {filter === 'hosted' 
              ? "You haven't hosted any rooms yet. Create one to get started!" 
              : filter === 'joined' 
              ? "You haven't joined any rooms yet. Explore and find rooms that interest you."
              : filter === 'upcoming'
              ? "You don't have any upcoming scheduled rooms."
              : "There are no rooms matching your current filter."}
          </p>
          <button
            className="mt-6 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium flex items-center"
            onClick={() => navigate('/create-room')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create a Room
          </button>
        </motion.div>
      )}
      
      {/* Create Room Modal - Portal for proper z-index */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gray-50 dark:bg-gray-800 rounded-xl 
              shadow-[6px_6px_12px_0px_rgba(0,0,0,0.1),-6px_-6px_12px_0px_rgba(255,255,255,0.8)] 
              dark:shadow-[6px_6px_12px_0px_rgba(0,0,0,0.3),-6px_-6px_12px_0px_rgba(255,255,255,0.05)]
              max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">Create a New Room</h2>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full
                    bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                    shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                    dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                    dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                    transition-all duration-200"
                  onClick={() => setShowCreateModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newRoomData.title}
                      onChange={(e) => setNewRoomData({...newRoomData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200
                        bg-gray-50 dark:bg-gray-800
                        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                        dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                        border-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        transition-all duration-200"
                      placeholder="Enter a descriptive title for your room"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={newRoomData.description}
                      onChange={(e) => setNewRoomData({...newRoomData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200
                        bg-gray-50 dark:bg-gray-800
                        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                        dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                        border-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent
                        placeholder:text-gray-400 dark:placeholder:text-gray-500
                        transition-all duration-200"
                      placeholder="What will you be discussing in this room?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topics <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {newRoomData.topics.map((topic, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => updateTopic(index, e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200
                              bg-gray-50 dark:bg-gray-800
                              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                              border-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent
                              placeholder:text-gray-400 dark:placeholder:text-gray-500
                              transition-all duration-200"
                            placeholder={`Topic ${index + 1} (e.g. Design, Technology, Business)`}
                            required
                          />
                          {newRoomData.topics.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTopic(index)}
                              className="p-3 rounded-xl
                                text-red-600 bg-red-50
                                dark:text-red-400 dark:bg-red-900/20
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      {newRoomData.topics.length < 5 && (
                        <button
                          type="button"
                          onClick={addTopic}
                          className="mt-2 flex items-center text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Topic ({5 - newRoomData.topics.length} remaining)
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Add up to 5 topics that describe what your room is about
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledFor"
                      value={newRoomData.scheduledFor}
                      onChange={(e) => setNewRoomData({...newRoomData, scheduledFor: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200
                        bg-gray-50 dark:bg-gray-800
                        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                        dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                        border-transparent focus:ring-2 focus:ring-violet-500 focus:border-transparent
                        transition-all duration-200"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Leave blank to start the room immediately
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center">
                      <div className="relative inline-block w-10 mr-3 align-middle">
                        <input 
                          id="isPrivate" 
                          type="checkbox"
                          checked={newRoomData.isPrivate}
                          onChange={(e) => setNewRoomData({...newRoomData, isPrivate: e.target.checked})} 
                          className="peer sr-only" 
                        />
                        <label 
                          htmlFor="isPrivate"
                          className="block h-6 rounded-full cursor-pointer
                            bg-gray-300 dark:bg-gray-600
                            shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.2)]
                            dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]
                            peer-checked:bg-violet-500 dark:peer-checked:bg-violet-700
                            transition-all duration-300 ease-in-out
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:dark:bg-gray-200 after:rounded-full after:h-5 after:w-5
                            after:shadow-md after:transition-all after:duration-300
                            peer-checked:after:translate-x-4"
                        >
                        </label>
                      </div>
                      <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Make this room private
                      </label>
                    </div>
                    <p className="mt-1 ml-12 text-xs text-gray-500 dark:text-gray-400">
                      Private rooms are only visible to invited participants
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2.5 rounded-xl
                      bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                      shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                      dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                      hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                      dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                      dark:active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                      transition-all duration-200 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl
                      bg-gradient-to-r from-violet-500 to-violet-600 text-white
                      shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                      active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                      transition-all duration-200 text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Room
                    </span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyRoomsPage;
