import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { useUser } from '../context/UserContext';
import RoomControls from '../components/voice/RoomControls';
import AISummary from '../components/voice/AISummary';
import TranscriptionPanel from '../components/voice/TranscriptionPanel';

// Global styles for custom scrollbars
const scrollbarStyles = `
  .minimal-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.5);
    border-radius: 4px;
  }
  
  .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.7);
  }
  
  .dark .minimal-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.5);
  }
  
  .dark .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(75, 85, 99, 0.7);
  }
`;

// Define Speaker interface
interface Speaker {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isHost: boolean;
  hasRaisedHand?: boolean;
}

// Define Message interface
interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

// Mock data for speakers
const mockSpeakers: Speaker[] = [
  { 
    id: 'host-user', 
    name: 'Alex Johnson', 
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&auto=format',
    isMuted: false,
    isSpeaking: true,
    isHost: true
  },
  { 
    id: 'user-2', 
    name: 'Sarah Miller', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format',
    isMuted: false,
    isSpeaking: false,
    isHost: false
  },
  { 
    id: 'user-3', 
    name: 'Michael Brown', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format',
    isMuted: true,
    isSpeaking: false,
    isHost: false
  },
  { 
    id: 'user-4', 
    name: 'Emily Chen', 
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&auto=format',
    isMuted: false,
    isSpeaking: false,
    isHost: false
  }
];

// Mock room data
const mockRoom = {
  id: 'room-1',
  title: 'The Future of AI and ML in 2024',
  description: 'Join us for an insightful discussion on where AI and ML are headed in 2024. We\'ll explore the latest trends, breakthroughs, and ethical considerations.',
  startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  scheduledFor: null,
  hostId: 'host-user',
  participantCount: 57,
  topics: [
    'Generative AI',
    'ML in Enterprise',
    'AI Ethics',
    'Creative AI'
  ],
  isRecording: true,
  isTranscribing: true
};

const defaultRoomSettings = {
  allowChat: true,
  allowHandRaise: true,
  recordingEnabled: true,
  transcriptionEnabled: true,
  aiSummaryEnabled: false,
  onlyHostsCanSpeak: false
};

// Helper component for floating audio controls
const FloatingControls = ({ micEnabled, toggleMicrophone, handRaised, toggleHandRaise, userRole, isSpeaking }) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-2 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <motion.button
          onClick={toggleMicrophone}
          className={`p-2.5 rounded-full
            ${micEnabled 
              ? 'bg-violet-500 text-white hover:bg-violet-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
            shadow-md hover:shadow-sm transition-all duration-200`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={userRole === 'listener'}
          title={micEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {micEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
        </motion.button>
        
        {userRole === 'listener' && (
          <motion.button
            onClick={toggleHandRaise}
            className={`p-2.5 rounded-full
              ${handRaised 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
              shadow-md hover:shadow-sm transition-all duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={handRaised ? "Lower hand" : "Raise hand to speak"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </motion.button>
        )}
        
        {/* Status indicator - only shown with tooltip now */}
        {(micEnabled || userRole === 'listener' && handRaised) && (
          <div className="h-2 w-2 rounded-full animate-pulse ml-1" 
            style={{ backgroundColor: micEnabled ? (isSpeaking ? '#10B981' : '#6D28D9') : '#F59E0B' }}
            title={userRole === 'listener' 
              ? handRaised ? "Hand Raised" : "Listener" 
              : micEnabled ? (isSpeaking ? "Speaking" : "Mic On") : "Mic Off"}
          />
        )}
      </div>
    </motion.div>
  );
};

// SpeakerCard component for consistent speaker display
const SpeakerCard = ({ 
  speaker, 
  currentUser, 
  userRole, 
  onToggleMute,
  onRemoveSpeaker
}: { 
  speaker: Speaker; 
  currentUser: any; 
  userRole: string; 
  onToggleMute: (speakerId: string) => void;
  onRemoveSpeaker?: (speakerId: string) => void;
}) => {
  const isSelf = speaker.id === currentUser.id;
  const canToggleMute = isSelf || userRole === 'host';
  
  return (
    <motion.div
      className={`
        bg-gray-50/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-3
        shadow-sm hover:shadow-md border border-transparent
        ${speaker.isSpeaking ? 'border-violet-500 shadow-violet-500/20' : 'hover:border-gray-200 dark:hover:border-gray-700'}
        transition-all duration-200
        relative
      `}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Active speech indicator */}
            {speaker.isSpeaking && !speaker.isMuted && (
              <motion.div 
                className="absolute -inset-1 rounded-full opacity-30"
                animate={{ 
                  scale: [1, 1.1, 1.2, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
                style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
              />
            )}
            
            <img 
              src={speaker.avatar} 
              alt={speaker.name}
              className={`w-10 h-10 rounded-full ${speaker.isMuted ? 'grayscale' : ''}`}
            />
            
            {/* Status indicators */}
            <div className="absolute -bottom-1 -right-1 flex space-x-1">
              {speaker.isMuted && (
                <div 
                  className={`flex items-center justify-center w-5 h-5 ${canToggleMute ? 'cursor-pointer' : ''} 
                    bg-red-500 text-white rounded-full
                    ${canToggleMute ? 'hover:bg-red-600 transform hover:scale-110 transition-transform' : ''}`}
                  onClick={canToggleMute ? () => onToggleMute(speaker.id) : undefined}
                  title={canToggleMute ? "Unmute microphone" : "Speaker is muted"}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </div>
              )}
              
              {speaker.hasRaisedHand && (
                <div className="flex items-center justify-center w-5 h-5 bg-yellow-500 text-white rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {speaker.name}
              </h3>
              <div className="flex ml-2 space-x-1">
                {speaker.isHost && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                    Host
                  </span>
                )}
                {isSelf && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    You
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {speaker.isMuted 
                ? "Muted" 
                : speaker.isSpeaking 
                  ? "Speaking now" 
                  : "Not speaking"}
            </p>
          </div>
        </div>
        
        {/* Quick actions */}
        {(canToggleMute || (userRole === 'host' && !speaker.isHost && speaker.id !== currentUser.id)) && (
          <div className="flex space-x-1">
            {canToggleMute && !speaker.isMuted && (
              <button
                onClick={() => onToggleMute(speaker.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Mute"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            
            {userRole === 'host' && !speaker.isHost && speaker.id !== currentUser.id && onRemoveSpeaker && (
              <button
                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => onRemoveSpeaker(speaker.id)}
                title="Remove speaker"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Voice activity indicator */}
      {speaker.isSpeaking && !speaker.isMuted && (
        <div className="mt-2">
          <motion.div 
            className="h-1 bg-violet-500 dark:bg-violet-600 rounded-full"
            initial={{ width: "20%" }}
            animate={{ 
              width: ["20%", "80%", "50%", "70%", "30%", "60%", "40%"],
              transition: { 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse" 
              }
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

const RoomPage: React.FC = () => {
  const { currentUser } = useUser();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  
  // Room state
  const [room, setRoom] = useState(mockRoom);
  const [speakers, setSpeakers] = useState<Speaker[]>(mockSpeakers);
  const [userRole, setUserRole] = useState<'host' | 'speaker' | 'listener'>('listener');
  const [roomSettings, setRoomSettings] = useState(defaultRoomSettings);
  const [isUserRoomOwner, setIsUserRoomOwner] = useState(false);
  const [roomStatus, setRoomStatus] = useState<'scheduled' | 'active' | 'past'>('active');
  const [roomVariant, setRoomVariant] = useState<'standard' | 'ama' | 'podcast' | 'townhall'>('standard');
  
  // UI state
  const [activeTab, setActiveTab] = useState<'speakers' | 'participants' | 'aiSummary'>('speakers');
  const [micEnabled, setMicEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [isRecording, setIsRecording] = useState(mockRoom.isRecording || false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  
  // Refs
  const speakingInterval = useRef<NodeJS.Timeout | null>(null);
  const transcriptionInterval = useRef<NodeJS.Timeout | null>(null);
  const voiceLevelInterval = useRef<NodeJS.Timeout | null>(null);
  const [voiceLevel, setVoiceLevel] = useState<number>(10);

  // Check if current user is the host
  useEffect(() => {
    // Check if this is the host's room
    if (room.hostId === 'host-user') {
      // Replace the host with current user data
      setRoom(prev => ({
        ...prev,
        hostId: currentUser.id
      }));
      
      setSpeakers(prev => {
        // Find the host speaker
        const hostIndex = prev.findIndex(s => s.isHost);
        if (hostIndex >= 0) {
          // Create a new array with the current user as host
          const newSpeakers = [...prev];
          newSpeakers[hostIndex] = {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            isMuted: false,
            isSpeaking: false,
            isHost: true
          };
          return newSpeakers;
        }
        return prev;
      });
      
      setUserRole('host');
      setIsUserRoomOwner(true);
    } else if (room.hostId === currentUser.id) {
      // User is the actual host of the room (not a mock)
      setUserRole('host');
      setIsUserRoomOwner(true);
    } else {
      // User is a listener by default
      setUserRole('listener');
      setIsUserRoomOwner(false);
    }
  }, [currentUser, room.hostId]);

  // Simulate transcription when it's enabled
  useEffect(() => {
    if (showTranscription) {
      const transcriptExamples = [
        "As I was saying, the ethical implications of AI are profound and far-reaching...",
        "Let me build on that point about machine learning in enterprise settings...",
        "I think we need to consider both the technical and societal aspects...",
        "When we look at generative AI models, the progress has been remarkable...",
        "The challenge lies in balancing innovation with responsible development..."
      ];
      
      // Set up interval to add transcription snippets
      transcriptionInterval.current = setInterval(() => {
        if (Math.random() > 0.6) { // Only add new transcription sometimes
          const randomPhrase = transcriptExamples[Math.floor(Math.random() * transcriptExamples.length)];
          setTranscription(prev => [...prev, randomPhrase]);
        }
      }, 6000);
    } else {
      // Clear interval when transcription is disabled
      if (transcriptionInterval.current) {
        clearInterval(transcriptionInterval.current);
      }
    }
    
    return () => {
      if (transcriptionInterval.current) {
        clearInterval(transcriptionInterval.current);
      }
    };
  }, [showTranscription]);

  // Simulate speaking effect
  useEffect(() => {
    if (micEnabled && userRole !== 'listener') {
      // Simulate speaking status changes
      speakingInterval.current = setInterval(() => {
        setIsSpeaking(prev => !prev);
        
        // Update speaker list to show who's speaking
        setSpeakers(prev => prev.map(speaker => 
          speaker.id === currentUser.id 
            ? { ...speaker, isSpeaking: !speaker.isSpeaking }
            : speaker
        ));
      }, 3000);
      
      // Simulate dynamic voice level changes
      voiceLevelInterval.current = setInterval(() => {
        if (isSpeaking) {
          setVoiceLevel(Math.floor(Math.random() * 60) + 30); // 30-90% level
        } else {
          setVoiceLevel(Math.floor(Math.random() * 10) + 5); // 5-15% level
        }
      }, 200);
    } else {
      setIsSpeaking(false);
      setVoiceLevel(5);
      if (speakingInterval.current) {
        clearInterval(speakingInterval.current);
      }
      if (voiceLevelInterval.current) {
        clearInterval(voiceLevelInterval.current);
      }
      
      // Ensure user is not shown as speaking when mic is off
      setSpeakers(prev => prev.map(speaker => 
        speaker.id === currentUser.id 
          ? { ...speaker, isSpeaking: false }
          : speaker
      ));
    }

    return () => {
      if (speakingInterval.current) {
        clearInterval(speakingInterval.current);
      }
      if (voiceLevelInterval.current) {
        clearInterval(voiceLevelInterval.current);
      }
    };
  }, [micEnabled, userRole, currentUser.id, isSpeaking]);

  // Cleanup all intervals when component unmounts
  useEffect(() => {
    return () => {
      if (speakingInterval.current) {
        clearInterval(speakingInterval.current);
      }
      if (voiceLevelInterval.current) {
        clearInterval(voiceLevelInterval.current);
      }
      if (transcriptionInterval.current) {
        clearInterval(transcriptionInterval.current);
      }
    };
  }, []);

  // Function to toggle microphone
  const toggleMicrophone = () => {
    if (userRole === 'listener') {
      // Add system message that listener must raise hand first
      addSystemMessage('You need to be a speaker to use the microphone. Try raising your hand first.');
      return;
    }
    
    setMicEnabled(!micEnabled);
    
    // Update speakers list to show mute status
    setSpeakers(prev => prev.map(speaker => 
      speaker.id === currentUser.id 
        ? { ...speaker, isMuted: !micEnabled }
        : speaker
    ));
  };

  // Function to toggle hand raise
  const toggleHandRaise = () => {
    if (userRole !== 'listener') return;
    
    setHandRaised(!handRaised);
    
    // Add system message
    addSystemMessage(!handRaised 
      ? `${currentUser.name} raised their hand to speak` 
      : `${currentUser.name} lowered their hand`
    );
    
    // Update speaker list to show raised hand
    const isUserInSpeakers = speakers.some(s => s.id === currentUser.id);
    
    if (!isUserInSpeakers) {
      // Add user to speakers list
      setSpeakers(prev => [
        ...prev,
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          isMuted: true,
          isSpeaking: false,
          isHost: false,
          hasRaisedHand: !handRaised
        }
      ]);
    } else {
      // Update existing user
      setSpeakers(prev => prev.map(speaker => 
        speaker.id === currentUser.id 
          ? { ...speaker, hasRaisedHand: !handRaised }
          : speaker
      ));
    }
    
    // Auto approve hand raise if there's no host or the user is in their own room
    if (!handRaised && isUserRoomOwner) {
      // Self-approve if it's the user's own room
      setTimeout(() => {
        promoteToSpeaker(currentUser.id);
      }, 500);
    } else if (!handRaised && !speakers.some(s => s.isHost)) {
      // Auto-approve if no host is present
      setTimeout(() => {
        setUserRole('speaker');
        setMicEnabled(true);
        addSystemMessage(`${currentUser.name} is now a speaker (auto-approved)`);
        setSpeakers(prev => prev.map(speaker => 
          speaker.id === currentUser.id 
            ? { ...speaker, hasRaisedHand: false }
            : speaker
        ));
      }, 1000);
    } else {
      // Show notification to hosts
      if (!handRaised) {
        speakers.forEach(speaker => {
          if (speaker.isHost) {
            // In a real app, this would be a notification to the host
            console.log(`Notification to host ${speaker.name}: ${currentUser.name} wants to speak`);
          }
        });
      }
    }
  };

  // Toggle mute for a specific speaker
  const toggleSpeakerMute = (speakerId: string) => {
    setSpeakers(prev => prev.map(speaker => 
      speaker.id === speakerId 
        ? { ...speaker, isMuted: !speaker.isMuted }
        : speaker
    ));
    
    // If it's the current user, also update mic state
    if (speakerId === currentUser.id) {
      setMicEnabled(prev => !prev);
    }
    
    // Add system message
    const speaker = speakers.find(s => s.id === speakerId);
    if (speaker) {
      const newMuteState = !speaker.isMuted;
      addSystemMessage(`${speaker.name} ${newMuteState ? 'unmuted' : 'muted'} their microphone`);
    }
  };

  // Add a system message
  const addSystemMessage = (text: string) => {
    // Do nothing - chat functionality has been removed
  };

  // Send message function
  const sendMessage = (e: React.FormEvent) => {
    // Do nothing - chat functionality has been removed
    e.preventDefault();
  };

  // Toggle transcription (host only)
  const toggleTranscription = () => {
    if (userRole !== 'host') return;
    
    const newTranscriptionState = !showTranscription;
    setShowTranscription(newTranscriptionState);
    
    // Switch to aiSummary tab when enabling since transcription tab is removed
    if (newTranscriptionState) {
      setActiveTab('aiSummary');
    }
    
    addSystemMessage(newTranscriptionState 
      ? 'Transcription has been enabled' 
      : 'Transcription has been disabled'
    );
  };

  // Toggle AI summary
  const toggleAISummary = () => {
    if (!showAISummary) {
      // Generate a mock AI summary
      const summary = "This discussion explored various aspects of AI and machine learning in 2024. Key points included:\n\n1️⃣ The ethical considerations of AI development and deployment\n2️⃣ Progress in generative AI for creative and business tasks\n3️⃣ Implementation challenges in enterprise settings\n4️⃣ The importance of data privacy and security\n\nParticipants raised questions about the future direction of AI regulation and the potential impact on job markets. The conversation highlighted the need for responsible AI development with appropriate guardrails while enabling innovation.";
      setAiSummary(summary);
    }
    setShowAISummary(!showAISummary);
  };

  // Function to make listener a speaker (for host)
  const promoteToSpeaker = (speakerId: string) => {
    if (userRole !== 'host') return;
    
    // Find the speaker
    const targetSpeaker = speakers.find(s => s.id === speakerId);
    if (!targetSpeaker) return;
    
    // Update the speaker status
    setSpeakers(prev => prev.map(speaker => 
      speaker.id === speakerId
        ? { 
            ...speaker, 
            hasRaisedHand: false,
            isMuted: false  // Automatically unmute when promoted
          }
        : speaker
    ));
    
    // Update user role if it's the current user
    if (speakerId === currentUser.id) {
      setUserRole('speaker');
      setMicEnabled(true); // Automatically enable mic
    }
    
    // Add system message
    const speakerName = targetSpeaker?.name || 'User';
    addSystemMessage(`${speakerName} is now a speaker`);
    
    // Show animation effect (in a real app, this would trigger a notification to the user)
    if (speakerId === currentUser.id) {
      // Notify this user they are now a speaker
      console.log('You are now a speaker! Your microphone has been enabled.');
    }
  };

  // Function to remove a speaker (for host)
  const removeSpeaker = (speakerId: string) => {
    if (userRole !== 'host') return;
    
    // Cannot remove the host
    const speakerToRemove = speakers.find(s => s.id === speakerId);
    if (speakerToRemove?.isHost) return;
    
    const speakerName = speakerToRemove?.name || 'User';
    setSpeakers(prev => prev.filter(speaker => speaker.id !== speakerId));
    
    // Add system message
    addSystemMessage(`${speakerName} was removed from speakers`);
  };

  // End room function (for host)
  const endRoom = () => {
    if (isUserRoomOwner) {
      // In a real app, this would make an API call to end the room
      addSystemMessage('Room ended by host');
      // Add a small delay before redirecting to simulate API call
      setTimeout(() => {
        navigate('/my-rooms');
      }, 1000);
    } else {
      // Host is leaving but not ending the room
      addSystemMessage(`${currentUser.name} (host) left the room`);
      navigate('/discover');
    }
  };

  // Leave room function (for participants)
  const leaveRoom = () => {
    // In a real app, this would make an API call
    addSystemMessage(`${currentUser.name} left the room`);
    navigate('/discover');
  };

  // Toggle recording (host only)
  const toggleRecording = () => {
    if (userRole !== 'host') return;
    
    setIsRecording(!isRecording);
    setRoom(prev => ({
      ...prev,
      isRecording: !isRecording
    }));
    
    addSystemMessage(!isRecording 
      ? 'Recording has been started' 
      : 'Recording has been stopped'
    );
  };

  // Check room status based on start time
  useEffect(() => {
    const now = new Date();
    const startTime = room.scheduledFor ? new Date(room.scheduledFor) : new Date(room.startedAt);
    
    if (room.scheduledFor && startTime > now) {
      // Room is scheduled for the future
      setRoomStatus('scheduled');
    } else if (startTime <= now && now.getTime() - startTime.getTime() < 3 * 60 * 60 * 1000) {
      // Room is active (less than 3 hours since start)
      setRoomStatus('active');
    } else {
      // Room has ended
      setRoomStatus('past');
    }
  }, [room.startedAt, room.scheduledFor]);

  // Function to format scheduled time
  const formatScheduledTime = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate time until scheduled start
  const getTimeUntilStart = (scheduledFor: string | null) => {
    if (!scheduledFor) return '';
    
    const now = new Date();
    const scheduled = new Date(scheduledFor);
    const diff = scheduled.getTime() - now.getTime();
    
    // Return empty if in the past
    if (diff <= 0) return '';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h until start`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m until start`;
    } else {
      return `${minutes}m until start`;
    }
  };
  
  // Function to render scheduled room UI
  const renderScheduledRoomContent = () => {
    return (
      <div className="p-10 flex flex-col items-center justify-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-xl w-full
          shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.6)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.04)]">
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              This room hasn't started yet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatScheduledTime(room.scheduledFor)}
            </p>
            <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium mt-2">
              {getTimeUntilStart(room.scheduledFor)}
            </p>
          </div>
          
          <div className="space-y-4">
            {isUserRoomOwner && (
              <motion.button
                onClick={() => {
                  // In a real app, this would start the room early
                  setRoomStatus('active');
                  addSystemMessage('Room started by host');
                }}
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium
                  bg-violet-500 hover:bg-violet-600
                  shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                  active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                  transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Room Now
              </motion.button>
            )}
            
            <motion.button
              onClick={() => {
                // Set a reminder
                addSystemMessage('Reminder set for this room');
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium
                bg-gray-100 text-gray-700 hover:bg-gray-200 
                dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Remind Me
            </motion.button>
          </div>
        </div>
      </div>
    );
  };
  
  // Function to render past room UI
  const renderPastRoomContent = () => {
    return (
      <div className="p-10 flex flex-col items-center justify-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-xl w-full
          shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.6)]
          dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.04)]">
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              This room has ended
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The room ended on {new Date(room.startedAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="space-y-4">
            {isUserRoomOwner && (
              <motion.button
                onClick={() => {
                  // In a real app, this would navigate to recordings
                  navigate('/my-rooms');
                }}
                className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium
                  bg-violet-500 hover:bg-violet-600
                  shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                  active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                  transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Recording
              </motion.button>
            )}
            
            <motion.button
              onClick={() => {
                // Navigate back
                navigate('/discover');
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium
                bg-gray-100 text-gray-700 hover:bg-gray-200 
                dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Discover
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  // Check for special room variant types (in a real app, this would come from the API)
  useEffect(() => {
    // Simulate checking room type from data
    if (room.title.toLowerCase().includes('ama') || room.description.toLowerCase().includes('ask me anything')) {
      setRoomVariant('ama');
    } else if (room.title.toLowerCase().includes('podcast') || room.description.toLowerCase().includes('podcast')) {
      setRoomVariant('podcast');
    } else if (room.title.toLowerCase().includes('townhall') || room.description.toLowerCase().includes('town hall')) {
      setRoomVariant('townhall');
    } else {
      setRoomVariant('standard');
    }
  }, [room.title, room.description]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    
      
      {/* Room Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-gray-50/95 dark:bg-gray-900/95 pb-5 pt-3 px-4">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {mockRoom.title}
              {isUserRoomOwner && (
                <span className="ml-3 text-xs bg-violet-500 text-white px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>My Room</span>
                </span>
              )}
              {roomVariant !== 'standard' && (
                <span className={`ml-3 text-xs px-2.5 py-1 rounded-full flex items-center space-x-1
                  ${roomVariant === 'ama' ? 'bg-blue-500 text-white' : 
                    roomVariant === 'podcast' ? 'bg-green-500 text-white' :
                    'bg-orange-500 text-white'}`}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {roomVariant === 'ama' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : roomVariant === 'podcast' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    )}
                  </svg>
                  <span>{roomVariant === 'ama' ? 'AMA' : roomVariant === 'podcast' ? 'Podcast' : 'Town Hall'}</span>
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 max-w-md">
              {mockRoom.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockRoom.topics.map((topic, index) => (
                <span 
                  key={index}
                  className="text-xs font-medium px-2.5 py-1 rounded-full
                    bg-violet-50 text-violet-700
                    dark:bg-violet-900/30 dark:text-violet-300
                    shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05),inset_-1px_-1px_2px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.03)]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isRecording && (
              <div className="flex items-center text-red-600 dark:text-red-400 text-sm font-medium">
                <span className="relative flex h-3 w-3 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Recording
              </div>
            )}
            
            <div className={`flex items-center text-sm font-medium
              ${roomStatus === 'active' ? 'text-green-600 dark:text-green-400' : 
                roomStatus === 'scheduled' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-gray-600 dark:text-gray-400'}`}>
              <span className="relative flex h-3 w-3 mr-1.5">
                {roomStatus === 'active' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 
                  ${roomStatus === 'active' ? 'bg-green-500' : 
                    roomStatus === 'scheduled' ? 'bg-yellow-500' : 
                    'bg-gray-500'}`}></span>
              </span>
              {roomStatus === 'active' ? 'Live Now' : 
               roomStatus === 'scheduled' ? 'Upcoming' : 
               'Ended'}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{mockRoom.participantCount}</span> listening
            </div>
            {userRole === 'host' && roomStatus === 'active' && (
              <motion.button
                onClick={toggleRecording}
                className={`mr-2 p-2 rounded-full
                  ${isRecording 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                  shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                  dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                  dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                  transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isRecording ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
              </motion.button>
            )}
            {/* Action buttons with conditional rendering based on room status and role */}
            {roomStatus === 'active' ? (
              /* For active rooms */
              userRole === 'host' ? (
                <motion.button
                  onClick={endRoom}
                  className="px-4 py-2 rounded-xl text-white text-sm font-medium
                    bg-red-500 hover:bg-red-600
                    shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                    transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isUserRoomOwner ? "End Room" : "Leave as Host"}
                </motion.button>
              ) : (
                <motion.button
                  onClick={leaveRoom}
                  className="px-4 py-2 rounded-xl text-white text-sm font-medium
                    bg-gray-500 hover:bg-gray-600
                    shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                    transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Leave Room
                </motion.button>
              )
            ) : roomStatus === 'scheduled' ? (
              /* For scheduled rooms */
              isUserRoomOwner ? (
                <motion.button
                  onClick={() => {
                    // In a real app, this would start the room early from here
                    setRoomStatus('active');
                    addSystemMessage('Room started by host');
                  }}
                  className="px-4 py-2 rounded-xl text-white text-sm font-medium
                    bg-violet-500 hover:bg-violet-600
                    shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                    transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Room
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => {
                    // Set a reminder
                    addSystemMessage('Reminder set for this room');
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium
                    bg-yellow-500 text-white hover:bg-yellow-600
                    shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                    active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                    transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Remind Me
                </motion.button>
              )
            ) : (
              /* For past rooms */
              <motion.button
                onClick={() => navigate('/discover')}
                className="px-4 py-2 rounded-xl text-white text-sm font-medium
                  bg-gray-500 hover:bg-gray-600
                  shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                  active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]
                  transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Discover
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Tab Navigation - Only show for active rooms - Updated to match MyRoomsPage style */}
        {roomStatus === 'active' && (
          <motion.div 
            className="flex space-x-3 overflow-x-auto pb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {(['speakers', 'participants', 'aiSummary'] as const).map((tabOption) => (
              <button
                key={tabOption}
                className={`px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 
                  ${activeTab === tabOption
                    ? `text-${tabOption === 'speakers' ? 'violet' : tabOption === 'participants' ? 'green' : 'indigo'}-700 
                       dark:text-${tabOption === 'speakers' ? 'violet' : tabOption === 'participants' ? 'green' : 'indigo'}-300 
                       bg-${tabOption === 'speakers' ? 'violet' : tabOption === 'participants' ? 'green' : 'indigo'}-50 
                       dark:bg-${tabOption === 'speakers' ? 'violet' : tabOption === 'participants' ? 'green' : 'indigo'}-900/20 
                       shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] 
                       dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]`
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]'
                  }`}
                onClick={() => setActiveTab(tabOption)}
              >
                {tabOption.charAt(0).toUpperCase() + tabOption.slice(1)}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Main Content Area - Adjusted to use 100vh space without excess scrolling */}
      <div className="px-4 pt-4 flex flex-col">
        {roomStatus === 'scheduled' && renderScheduledRoomContent()}
        
        {roomStatus === 'past' && renderPastRoomContent()}
        
        {roomStatus === 'active' && (
          <>
            {/* Content based on selected tab */}
            <motion.div 
              className="flex-grow overflow-y-auto minimal-scrollbar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'speakers' && (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Speakers</h2>
                    {userRole === 'host' && (
                      <button 
                        className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center"
                        onClick={() => {/* Functionality to invite speakers */}}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Invite speakers
                      </button>
                    )}
                  </div>
                  
                  {/* Speakers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {speakers.map((speaker) => (
                      <SpeakerCard 
                        key={speaker.id} 
                        speaker={speaker} 
                        currentUser={currentUser}
                        userRole={userRole}
                        onToggleMute={toggleSpeakerMute}
                        onRemoveSpeaker={removeSpeaker}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'participants' && (
                <div className="h-full">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Participants ({mockRoom.participantCount})</h3>
                  <div className="space-y-2">
                    {speakers.map((speaker) => (
                      <div key={speaker.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={speaker.avatar} 
                            alt={speaker.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{speaker.name}</p>
                            {speaker.isHost && (
                              <p className="text-xs text-violet-600 dark:text-violet-400">Host</p>
                            )}
                          </div>
                        </div>
                        {userRole === 'host' && !speaker.isHost && (
                          <div className="flex space-x-2">
                            <button
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                              onClick={() => promoteToSpeaker(speaker.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
                              </svg>
                            </button>
                            <button
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              onClick={() => removeSpeaker(speaker.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  
                  </div>
                </div>
              )}
              
              {activeTab === 'aiSummary' && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">AI Summary</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Get an AI-powered summary of this conversation in real-time
                  </p>
                  <button 
                    className="px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg
                      shadow-lg hover:shadow-xl transition-all duration-200
                      transform hover:-translate-y-1 active:translate-y-0"
                    onClick={() => {/* Functionality to generate AI summary */}}
                  >
                    Generate Summary
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
        
        {/* User Profile Button - Floating in bottom right with microphone control */}
        {roomStatus === 'active' && (
          <motion.div
            className="fixed bottom-6 right-6 flex items-center space-x-3 bg-white/90 dark:bg-gray-800/90 
              backdrop-blur-sm p-2 pr-4 rounded-full shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border-2 border-violet-500"
            />
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleMicrophone}
                className={`p-2 rounded-full
                  ${micEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-red-500 text-white hover:bg-red-600'}
                  shadow-[2px_2px_4px_rgba(0,0,0,0.1),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  hover:shadow-[1px_1px_2px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.05)]
                  transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={micEnabled ? "Mute microphone" : "Unmute microphone"}
              >
                {micEnabled ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </motion.button>
              
              {userRole !== 'speaker' && (
                <motion.button
                  onClick={toggleHandRaise}
                  className={`p-2 rounded-full
                    ${handRaised 
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                    shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                    dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                    hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                    dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                    transition-all duration-200`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={handRaised ? "Lower hand" : "Raise hand to speak"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomPage; 