import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiEdit3, FiUser, FiMessageCircle, FiCalendar, FiHeadphones, FiClock, FiGlobe } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    id: userId || '1',
    name: 'Alex Johnson',
    username: '@alexjohnson',
    bio: 'Digital product designer and voice tech enthusiast. Exploring the intersection of human connection and technology.',
    interests: ['Voice Technology', 'Product Design', 'UI/UX', 'AI', 'Digital Art'],
    joinDate: 'March 2023',
    location: 'San Francisco, CA',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    headerImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80',
    stats: {
      roomsCreated: 42,
      roomsJoined: 128,
      followers: 584,
      following: 267
    },
    socialLinks: {
      twitter: 'https://twitter.com/alexjohnson',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      website: 'https://alexjohnson.design'
    }
  });

  // Form state for editing
  const [formData, setFormData] = useState({ ...userData });

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ ...userData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    setShowEditSuccess(true);
    setTimeout(() => setShowEditSuccess(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto minimal-scrollbar">
      {/* Success notification */}
      <AnimatePresence>
        {showEditSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg 
              shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.8)]
              dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.05)]"
            role="alert"
          >
            <strong className="font-medium">Success!</strong>
            <span className="block sm:inline"> Profile updated successfully.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Sticky with neumorphic styling */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/95 dark:bg-gray-900/95 pb-5 pt-3 px-1">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="page-title text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          {!isEditing && (
            <motion.button
              onClick={handleEditClick}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-medium
                bg-gradient-to-r from-violet-500 to-violet-600
                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                transition-all duration-200 flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiEdit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </motion.button>
          )}
        </motion.div>
          </div>
          
      {/* Profile Content with neumorphic styling */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl
          shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
          dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]
          mb-8"
      >
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                    focus:border-violet-500 focus:ring-violet-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    px-4 py-2.5"
                />
              </div>
                  <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                    focus:border-violet-500 focus:ring-violet-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    px-4 py-2.5"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                    focus:border-violet-500 focus:ring-violet-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    px-4 py-2.5"
                />
                  </div>
                  <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                    focus:border-violet-500 focus:ring-violet-500 
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    px-4 py-2.5"
                />
                  </div>
                </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                  shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                  dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                  dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                  transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2.5 rounded-lg text-white
                  bg-gradient-to-r from-violet-500 to-violet-600
                  shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                  dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                  dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                  transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Changes
              </motion.button>
                  </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar with neumorphic styling */}
              <div className="flex-shrink-0 flex justify-center">
                <div className="rounded-full p-1.5 
                  shadow-[4px_4px_8px_rgba(0,0,0,0.06),-4px_-4px_8px_rgba(255,255,255,0.80)] 
                  dark:shadow-[4px_4px_8px_rgba(0,0,0,0.5),-4px_-4px_8px_rgba(255,255,255,0.05)]">
                  <img
                    src={userData.avatar} 
                    alt={userData.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{userData.username}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{userData.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center px-3 py-1.5 rounded-full
                    bg-gray-100 dark:bg-gray-700/50
                    shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
                    <FiCalendar className="mr-1.5" />
                    Joined {userData.joinDate}
                  </div>
                  <div className="flex items-center px-3 py-1.5 rounded-full
                    bg-gray-100 dark:bg-gray-700/50
                    shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]">
                    <FiGlobe className="mr-1.5" />
                    {userData.location}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats with neumorphic styling */}
            <div className="grid grid-cols-4 gap-4 my-6 border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <div className="text-center p-4 rounded-lg
                shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{userData.stats.roomsCreated}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rooms Created</p>
              </div>
              <div className="text-center p-4 rounded-lg
                shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{userData.stats.roomsJoined}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rooms Joined</p>
                  </div>
              <div className="text-center p-4 rounded-lg
                shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{userData.stats.followers}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                  </div>
              <div className="text-center p-4 rounded-lg
                shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{userData.stats.following}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
              </div>
            </div>
            
            {/* Interests with neumorphic styling */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {userData.interests.map((interest, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-sm
                      shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                      dark:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]"
                  >
                    {interest}
                          </span>
                      ))}
                    </div>
                  </div>
          </div>
        )}
        </motion.div>
    </div>
  );
};

export default ProfilePage;
