import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaUsers, FaComment, FaEllipsisH } from 'react-icons/fa';
import { IoMdHand } from 'react-icons/io';
import { AiFillAudio } from 'react-icons/ai';

// Define types for the messages and speakers
interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  hasRaisedHand?: boolean;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

interface RoomControlsProps {
  isMuted: boolean;
  isHandRaised: boolean;
  unreadMessages: number;
  onToggleMute: () => void;
  onToggleHand: () => void;
  onOpenChat: () => void;
  onOpenParticipants: () => void;
  onOpenSpeakers: () => void;
  participants?: Speaker[];
  speakers?: Speaker[];
  messages?: Message[];
}

const RoomControls: React.FC<RoomControlsProps> = ({
  isMuted,
  isHandRaised,
  unreadMessages,
  onToggleMute,
  onToggleHand,
  onOpenChat,
  onOpenParticipants,
  onOpenSpeakers,
  participants = [],
  speakers = [],
  messages = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'none' | 'participants' | 'chat' | 'speakers'>('none');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setActiveSection('none');
    }
  };

  const handleSectionClick = (section: 'participants' | 'chat' | 'speakers') => {
    if (activeSection === section) {
      setActiveSection('none');
    } else {
      setActiveSection(section);
      
      // Call the appropriate handler based on section
      if (section === 'participants') onOpenParticipants();
      if (section === 'chat') onOpenChat();
      if (section === 'speakers') onOpenSpeakers();
      
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  // Render a message in the chat
  const renderMessage = (message: Message) => {
    const isCurrentUser = message.sender === 'You';
    
    return (
      <div 
        key={message.id} 
        className={`mb-4 ${message.isSystem ? 'flex justify-center' : (isCurrentUser ? 'flex justify-end' : 'flex justify-start')}`}
      >
        {message.isSystem ? (
          <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
            {message.text}
          </div>
        ) : (
          <div className={`max-w-[80%] ${isCurrentUser ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-gray-100 dark:bg-gray-700'} rounded-2xl px-4 py-2`}>
            {!isCurrentUser && message.senderAvatar && (
              <div className="flex items-center mb-1">
                <img src={message.senderAvatar} alt={message.sender} className="w-5 h-5 rounded-full mr-2" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{message.sender}</span>
              </div>
            )}
            {!isCurrentUser && !message.senderAvatar && (
              <div className="flex items-center mb-1">
                <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{message.sender}</span>
              </div>
            )}
            <p className="text-sm text-gray-800 dark:text-gray-200">{message.text}</p>
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a participant or speaker
  const renderPerson = (person: Speaker) => (
    <div key={person.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="relative">
        <img 
          src={person.avatar} 
          alt={person.name} 
          className={`w-8 h-8 rounded-full ${person.isMuted ? 'grayscale' : ''}`}
        />
        {person.isSpeaking && !person.isMuted && (
          <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-pulse"></div>
        )}
        {person.isMuted && (
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.59 10.52c1.52.71 1.52 3.08 0 3.78m-5.71-9.37a11.05 11.05 0 0 1 0 14.96m-4.24-18.32a15.11 15.11 0 0 1 0 21.68"></path>
            </svg>
          </div>
        )}
        {person.hasRaisedHand && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6.5m0 0h5.375c2.383 0 4.75 0 4.75-1s-2.367-1-4.75-1H6.5m13 8A5.5 5.5 0 0111 14h-1m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{person.name}</span>
          {person.isHost && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 rounded text-xs">Host</span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {person.isMuted 
            ? "Muted" 
            : person.isSpeaking 
              ? "Speaking" 
              : "Not speaking"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded controls when active */}
      <AnimatePresence>
        {activeSection !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 rounded-2xl bg-white dark:bg-gray-800 shadow-neomorphic dark:shadow-neomorphic-dark p-4 w-80 max-h-96 overflow-hidden backdrop-blur-sm"
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 8px 24px, rgba(149, 157, 165, 0.1) 0px 8px 8px',
            }}
          >
            {activeSection === 'participants' && (
              <div className="h-full">
                <h3 className="text-lg font-medium mb-3 flex justify-between items-center">
                  <span>Participants ({participants.length})</span>
                  <button 
                    onClick={() => setActiveSection('none')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </h3>
                <div className="minimal-scrollbar overflow-y-auto max-h-80">
                  {participants.length > 0 ? (
                    <div className="space-y-1">
                      {participants.map(renderPerson)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                      No participants yet
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeSection === 'chat' && (
              <div className="h-full">
                <h3 className="text-lg font-medium mb-3 flex justify-between items-center">
                  <span>Chat</span>
                  <button 
                    onClick={() => setActiveSection('none')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </h3>
                <div className="minimal-scrollbar overflow-y-auto max-h-60">
                  {messages.length > 0 ? (
                    <div className="px-2">
                      {messages.map(renderMessage)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                      No messages yet
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-end space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 dark:bg-gray-700 border border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <button className="p-2 rounded-full bg-violet-500 text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'speakers' && (
              <div className="h-full">
                <h3 className="text-lg font-medium mb-3 flex justify-between items-center">
                  <span>Speakers ({speakers.length})</span>
                  <button 
                    onClick={() => setActiveSection('none')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </h3>
                <div className="minimal-scrollbar overflow-y-auto max-h-80">
                  {speakers.length > 0 ? (
                    <div className="space-y-2">
                      {speakers.map(renderPerson)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                      No active speakers
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main control bar */}
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-neomorphic dark:shadow-neomorphic-dark backdrop-blur-sm p-2"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 8px 24px, rgba(149, 157, 165, 0.1) 0px 8px 8px',
        }}
      >
        <AnimatePresence>
          {isExpanded && (
            <>
              <motion.button
                initial={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                animate={{ scale: 1, opacity: 1, width: 'auto', marginRight: 4 }}
                exit={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleSectionClick('speakers')}
                className={`relative p-3 rounded-full transition-colors ${
                  activeSection === 'speakers'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <AiFillAudio />
                {speakers.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {speakers.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                initial={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                animate={{ scale: 1, opacity: 1, width: 'auto', marginRight: 4 }}
                exit={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                onClick={() => handleSectionClick('participants')}
                className={`relative p-3 rounded-full transition-colors ${
                  activeSection === 'participants'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaUsers />
                {participants.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {participants.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                initial={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                animate={{ scale: 1, opacity: 1, width: 'auto', marginRight: 4 }}
                exit={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                onClick={onToggleHand}
                className={`p-3 rounded-full transition-colors ${
                  isHandRaised
                    ? 'bg-warning-100 dark:bg-warning-900 text-warning-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <IoMdHand />
              </motion.button>

              <motion.button
                initial={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                animate={{ scale: 1, opacity: 1, width: 'auto', marginRight: 4 }}
                exit={{ scale: 0.8, opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                onClick={() => handleSectionClick('chat')}
                className={`relative p-3 rounded-full transition-colors ${
                  activeSection === 'chat'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FaComment />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMute}
          className={`p-4 rounded-full transition-colors shadow-neomorphic-button ${
            isMuted
              ? 'bg-gradient-to-br from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'
              : 'bg-gradient-to-br from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
          }`}
        >
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleExpand}
          className="p-3 rounded-full bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-neomorphic-button"
        >
          <FaEllipsisH />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RoomControls;