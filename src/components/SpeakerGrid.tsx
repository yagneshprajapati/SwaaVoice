import React from 'react';
import { motion } from 'framer-motion';
import AudioWaveform from './AudioWaveform';

interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  isModerator: boolean;
  isHandRaised: boolean;
  audioLevel?: number;
}

interface SpeakerGridProps {
  speakers: Speaker[];
  layout?: 'grid' | 'stage';
  currentUserId?: string;
  onPromote?: (userId: string) => void;
  onDemote?: (userId: string) => void;
  onMute?: (userId: string) => void;
  isHost: boolean;
  className?: string;
}

const SpeakerGrid: React.FC<SpeakerGridProps> = ({
  speakers,
  layout = 'grid',
  currentUserId,
  onPromote,
  onDemote,
  onMute,
  isHost,
  className = '',
}) => {
  const activeSpeakers = speakers.filter(s => s.isSpeaking && !s.isMuted);

  if (layout === 'stage') {
    return (
      <div className={`relative ${className}`}>
        {/* Featured active speaker */}
        {activeSpeakers.length > 0 ? (
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-6 bg-black/5 dark:bg-white/5">
            <div className="absolute inset-0 flex items-center justify-center">
              {activeSpeakers.map((speaker, idx) => (
                <motion.div
                  key={speaker.id}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative max-w-md text-center">
                    <div className="mx-auto relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 mx-auto relative">
                        <img 
                          src={speaker.avatar} 
                          alt={speaker.name} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay effect when speaking */}
                        <motion.div
                          className="absolute inset-0 bg-black/10"
                          animate={{ opacity: [0.1, 0.2, 0.1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      
                      {/* Audio visualization */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2">
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                          <AudioWaveform 
                            isActive={true} 
                            type="bars"
                            audioLevel={speaker.audioLevel || 0.7}
                            color="green"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                      {speaker.name}
                      {speaker.isHost && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-full">Host</span>
                      )}
                      {speaker.isModerator && !speaker.isHost && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">Mod</span>
                      )}
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Speaking
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-gray-100 dark:bg-gray-700/30 p-10 text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No active speakers</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              When someone starts speaking, they will appear here
            </p>
          </div>
        )}
        
        {/* Other speakers in a row */}
        <div className="flex overflow-x-auto pb-3 space-x-3">
          {speakers.filter(s => !activeSpeakers.some(active => active.id === s.id)).map(speaker => (
            <div key={speaker.id} className="flex-shrink-0 w-24 text-center group relative">
              <div className={`w-16 h-16 mx-auto rounded-full overflow-hidden border-2 ${
                speaker.id === currentUserId 
                ? 'border-blue-400 dark:border-blue-500 ring-2 ring-offset-2 ring-blue-300 dark:ring-blue-700' 
                : speaker.isMuted 
                ? 'border-red-200 dark:border-red-900/30 grayscale opacity-80' 
                : 'border-gray-200 dark:border-gray-700'
              }`}>
                <img 
                  src={speaker.avatar} 
                  alt={speaker.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {speaker.id === currentUserId ? 'You' : speaker.name}
              </p>
              
              {speaker.isHost && (
                <span className="inline-block text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full">
                  Host
                </span>
              )}
              
              {/* Controls for host */}
              {isHost && speaker.id !== currentUserId && (
                <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => onMute && onMute(speaker.id)}
                    className="p-1 bg-red-500 text-white rounded-full"
                    title={speaker.isMuted ? "Unmute" : "Mute"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Grid layout
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {speakers.map((speaker) => (
        <motion.div
          key={speaker.id}
          className={`flex flex-col items-center p-3 rounded-xl relative group ${
            speaker.isSpeaking && !speaker.isMuted 
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 dark:from-green-500/20 dark:to-emerald-500/10'
              : speaker.id === currentUserId
              ? 'bg-blue-500/5 dark:bg-blue-500/10'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          whileHover={{ scale: 1.02 }}
          layout
        >
          <div className="relative">
            <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
              speaker.isSpeaking && !speaker.isMuted
                ? 'border-green-400 dark:border-green-500'
                : speaker.id === currentUserId
                ? 'border-blue-400 dark:border-blue-500'
                : speaker.isMuted
                ? 'border-red-300 dark:border-red-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <img 
                src={speaker.avatar} 
                alt={speaker.name}
                className={`w-full h-full object-cover ${
                  speaker.isMuted ? 'grayscale opacity-80' : ''
                }`}
              />
              
              {/* Voice activity visualization */}
              {speaker.isSpeaking && !speaker.isMuted && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <AudioWaveform 
                    isActive={true} 
                    audioLevel={speaker.audioLevel || 0.7}
                    color="green"
                    size="sm"
                  />
                </div>
              )}
            </div>
            
            {/* Microphone Status */}
            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-lg ${
              speaker.isMuted 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}>
              {speaker.isMuted ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </div>
            
            {/* Host Badge */}
            {speaker.isHost && (
              <motion.div 
                className="absolute -top-1 -left-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-xs text-white px-1.5 py-0.5 rounded-full shadow-md"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Host
              </motion.div>
            )}
            
            {/* Moderator Badge */}
            {speaker.isModerator && !speaker.isHost && (
              <motion.div 
                className="absolute -top-1 -left-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-xs text-white px-1.5 py-0.5 rounded-full shadow-md"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Mod
              </motion.div>
            )}
            
            {/* Your indicator */}
            {speaker.id === currentUserId && (
              <motion.div 
                className="absolute bottom-0 -left-1 bg-blue-500 text-xs text-white px-1.5 py-0.5 rounded-full shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                You
              </motion.div>
            )}
            
            {/* Speaking animation */}
            {speaker.isSpeaking && !speaker.isMuted && (
              <motion.div 
                className="absolute -inset-2 rounded-full border-2 border-green-400 opacity-0"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
              />
            )}
          </div>
          
          {/* Name display */}
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {speaker.name}
            </p>
            
            {/* Speaking indicator */}
            {speaker.isSpeaking && !speaker.isMuted && (
              <motion.p 
                className="text-xs text-green-600 dark:text-green-400 mt-0.5 flex items-center justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Speaking
              </motion.p>
            )}
          </div>
          
          {/* Host controls - visible on hover */}
          {isHost && speaker.id !== currentUserId && (
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {speaker.isModerator ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDemote && onDemote(speaker.id)}
                  className="p-2 bg-yellow-500 text-white rounded-full"
                  title="Remove moderator"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPromote && onPromote(speaker.id)}
                  className="p-2 bg-blue-500 text-white rounded-full"
                  title="Make moderator"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onMute && onMute(speaker.id)}
                className="p-2 bg-red-500 text-white rounded-full"
                title={speaker.isMuted ? "Unmute" : "Mute"}
              >
                {speaker.isMuted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SpeakerGrid;
