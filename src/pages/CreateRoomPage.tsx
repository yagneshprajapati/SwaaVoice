import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiCalendar, FiCheck, FiLock, FiGlobe } from 'react-icons/fi';

// Room theme options
const roomThemes = [
  { id: 'default', name: 'Default', color: 'bg-gradient-to-r from-violet-500 to-purple-600' },
  { id: 'nature', name: 'Nature', color: 'bg-gradient-to-r from-green-500 to-teal-500' }, 
  { id: 'sunset', name: 'Sunset', color: 'bg-gradient-to-r from-orange-500 to-pink-500' },
  { id: 'space', name: 'Space', color: 'bg-gradient-to-r from-purple-600 to-indigo-700' },
  { id: 'ocean', name: 'Ocean', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
];

// Function to generate a unique ID
const generateId = () => `room-${Date.now()}`;

const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    title: '',
    description: '',
    topics: [''],
    theme: 'default',
    isPrivate: false,
    scheduledFor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value
    });
  };

  const handleTopicChange = (index: number, value: string) => {
    const updatedTopics = [...roomData.topics];
    updatedTopics[index] = value;
    setRoomData({
      ...roomData,
      topics: updatedTopics
    });
  };

  const addTopic = () => {
    if (roomData.topics.length < 5) {
      setRoomData({
        ...roomData,
        topics: [...roomData.topics, '']
      });
    }
  };

  const removeTopic = (index: number) => {
    if (roomData.topics.length > 1) {
      setRoomData({
        ...roomData,
        topics: roomData.topics.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create new room object
      const newRoom = {
        id: generateId(),
        title: roomData.title,
        description: roomData.description,
        participantCount: 1,
        speakerCount: 1,
        startedAt: roomData.scheduledFor ? null : new Date().toISOString(),
        scheduledFor: roomData.scheduledFor ? new Date(roomData.scheduledFor).toISOString() : null,
        isLive: !roomData.scheduledFor,
        isHost: true,
        hostName: 'You',
        hostAvatar: 'Y',
        topics: roomData.topics.filter(t => t.trim() !== ''),
        theme: roomData.theme,
        isPrivate: roomData.isPrivate,
        roomEffects: {
          background: "default",
          audio: "none",
          visual: null
        }
      };
      
      // Simulate API call - wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the new room in localStorage so it persists across page reloads
      const existingRooms = JSON.parse(localStorage.getItem('myCreatedRooms') || '[]');
      existingRooms.push(newRoom);
      localStorage.setItem('myCreatedRooms', JSON.stringify(existingRooms));
      
      // Navigate to the new room if it's live, otherwise to My Rooms
      if (newRoom.isLive) {
        navigate(`/room/${newRoom.id}`);
      } else {
        navigate('/my-rooms');
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {/* Header Section */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-gray-50/90 dark:bg-gray-900/90 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/my-rooms')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">
              Create a New Room
            </h1>
          </div>
          <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-10 h-1 ${
                currentStep > 1 ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>
            </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
          {currentStep === 1 && (
                    <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h2>
                  
                  {/* Room Title */}
                  <div className="mb-6">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Room Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                      name="title"
                      value={roomData.title}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Enter a descriptive title for your room"
                      required
                    />
                        </div>
                        
                  {/* Room Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                      name="description"
                      value={roomData.description}
                      onChange={handleChange}
                            rows={4}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="What will you be discussing in this room?"
                      required
                    />
                  </div>
                </div>

                {/* Topics Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Topics</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{roomData.topics.filter(t => t.trim() !== '').length}/5</span>
                        </div>

                  <div className="space-y-3">
                    {roomData.topics.map((topic, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="text"
                          value={topic}
                          onChange={(e) => handleTopicChange(index, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                          placeholder={`Topic ${index + 1}`}
                          required
                        />
                        {roomData.topics.length > 1 && (
                          <button
                                type="button"
                            onClick={() => removeTopic(index)}
                            className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
                            aria-label="Remove topic"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {roomData.topics.length < 5 && (
                      <button
                              type="button"
                        onClick={addTopic}
                        className="mt-3 w-full flex items-center justify-center p-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/10 transition-colors"
                      >
                        <FiPlus className="w-5 h-5 mr-2" />
                        Add Topic
                      </button>
                    )}
                  </div>
                        </div>
                      </div>
                      
              {/* Right Column - Preview */}
              <div className="space-y-6">
                {/* Room Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className={`h-32 ${roomThemes.find(t => t.id === roomData.theme)?.color || roomThemes[0].color}`}></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {roomData.title || "Your Room Title"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {roomData.description || "Room description will appear here..."}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {roomData.topics.filter(t => t.trim() !== '').map((topic, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                      {roomData.topics.filter(t => t.trim() !== '').length === 0 && (
                        <span className="text-sm text-gray-400 italic">Add topics to see them here</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center mr-4">
                        <span className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-medium">Y</span>
                        <span className="ml-2">You (Host)</span>
                      </div>
                      {roomData.isPrivate ? (
                        <div className="flex items-center text-amber-600 dark:text-amber-400">
                          <FiLock className="w-4 h-4 mr-1" />
                          Private
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <FiGlobe className="w-4 h-4 mr-1" />
                          Public
                        </div>
                      )}
                                </div>
                                </div>
                            </div>
                            
                {/* Navigation Buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium flex items-center"
                  >
                    Continue to Settings
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                                    </div>
                                  </div>
            </motion.div>
                                  )}
                                  
          {currentStep === 2 && (
                                    <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Left Column - Room Settings */}
              <div className="space-y-6">
                {/* Theme Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Room Theme</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {roomThemes.map(theme => (
                      <div 
                        key={theme.id}
                        onClick={() => setRoomData({...roomData, theme: theme.id})}
                        className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          roomData.theme === theme.id 
                            ? 'border-violet-600 shadow-lg scale-105' 
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`h-16 ${theme.color}`}></div>
                        <div className="p-2 text-center bg-white dark:bg-gray-800">
                          <span className="text-xs font-medium">{theme.name}</span>
                        </div>
                              </div>
                    ))}
                            </div>
                          </div>
                          
                {/* Privacy & Schedule Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Room Settings</h2>
                  
                  {/* Privacy */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Room Privacy
                            </label>
                    <div className="flex space-x-4">
                      <div 
                        className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          !roomData.isPrivate 
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setRoomData({...roomData, isPrivate: false})}
                              >
                                <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            !roomData.isPrivate ? 'border-violet-500 bg-violet-500' : 'border-gray-400'
                          }`}>
                            {!roomData.isPrivate && <FiCheck className="w-3 h-3 text-white" />}
                                  </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Public</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Anyone can join this room</p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          roomData.isPrivate 
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setRoomData({...roomData, isPrivate: true})}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            roomData.isPrivate ? 'border-violet-500 bg-violet-500' : 'border-gray-400'
                          }`}>
                            {roomData.isPrivate && <FiCheck className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Private</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Only people with invite can join</p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Schedule */}
                  <div>
                    <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Schedule For Later (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        id="scheduledFor"
                        name="scheduledFor"
                        value={roomData.scheduledFor}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Leave empty to start the room immediately
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary & Actions */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Room Summary</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Title</span>
                      <span className="block text-gray-900 dark:text-white">{roomData.title}</span>
                </div>
                
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Description</span>
                      <span className="block text-gray-900 dark:text-white">{roomData.description}</span>
                        </div>
                    
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Topics</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {roomData.topics.filter(t => t.trim() !== '').map((topic, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center">
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Theme:</span>
                        <span className="inline-flex items-center">
                          <span className={`inline-block w-4 h-4 rounded-full mr-1 ${roomThemes.find(t => t.id === roomData.theme)?.color || roomThemes[0].color}`}></span>
                          {roomThemes.find(t => t.id === roomData.theme)?.name || 'Default'}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Privacy:</span>
                        <span className="flex items-center">
                          {roomData.isPrivate ? (
                            <>
                              <FiLock className="w-4 h-4 mr-1 text-amber-600 dark:text-amber-400" />
                              <span className="text-amber-600 dark:text-amber-400">Private</span>
                        </>
                      ) : (
                        <>
                              <FiGlobe className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400">Public</span>
                            </>
                          )}
                        </span>
                      </div>
                      
                      {roomData.scheduledFor && (
                        <div className="flex items-center">
                          <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Scheduled for:</span>
                          <span className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                            {new Date(roomData.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Room
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CreateRoomPage;