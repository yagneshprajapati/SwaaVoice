import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import VoiceWaveAnimation from '../components/VoiceWaveAnimation';

interface RoomHost {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

interface JoinRoomProps {
  id: string;
  title: string;
  description: string;
  started: boolean;
  participants: number;
  host: RoomHost;
  topics: string[];
}

const JoinRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<JoinRoomProps | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [joinAs, setJoinAs] = useState<'speaker' | 'listener'>('speaker');
  
  // Check if user is joining from the discovery page
  const isDiscovery = new URLSearchParams(location.search).get('isDiscovery') === 'true';
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Simulate fetching room data
  useEffect(() => {
    // In a real app, you would fetch data from backend
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockRoom: JoinRoomProps = {
          id: roomId || 'room-1',
          title: 'The Future of AI and Voice Technology',
          description: 'Join us for an insightful discussion on the latest advancements in AI and voice technology. We\'ll explore emerging trends and practical applications.',
          started: true,
          participants: 42,
          host: {
            id: 'host-1',
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format',
            bio: 'AI researcher and voice technology enthusiast. Host of weekly tech discussions.'
          },
          topics: ['Artificial Intelligence', 'Voice Tech', 'Machine Learning', 'Future Trends']
        };
        
        setRoom(mockRoom);
        setLoading(false);
      } catch (err) {
        setError('Failed to load room data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Check microphone permission
    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setMicPermission(result.state === 'granted');
      })
      .catch(() => {
        // Browser might not support permission API
        setMicPermission(null);
      });
      
    return () => {
      stopAudioMonitoring();
    };
  }, [roomId]);
  
  // Start audio monitoring
  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          setIsSpeaking(average > 30);
        }
        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      setMicrophoneEnabled(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermission(false);
      setMicrophoneEnabled(false);
    }
  };
  
  // Stop audio monitoring
  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }
    
    setAudioLevel(0);
    setIsSpeaking(false);
    setMicrophoneEnabled(false);
  };
  
  // Join the room
  const joinRoom = () => {
    // If joining as a listener, we don't need microphone permission
    if (joinAs === 'listener') {
      // Pass isDiscovery and joinAs parameters
      navigate(`/room/${roomId}?isDiscovery=${isDiscovery}&role=${joinAs}`);
      return;
    }
    
    // If joining as a speaker, check microphone first
    if (micPermission) {
      // Pass isDiscovery and joinAs parameters
      navigate(`/room/${roomId}?isDiscovery=${isDiscovery}&role=${joinAs}`);
    } else {
      // Prompt for microphone permission
      startAudioMonitoring().then(() => {
        navigate(`/room/${roomId}?isDiscovery=${isDiscovery}&role=${joinAs}`);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="mb-4 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Room Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "We couldn't find the room you're looking for."}</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto minimal-scrollbar">
    
      {/* Room Details with neumorphic styling */}
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden
            shadow-[6px_6px_12px_0px_rgba(0,0,0,0.06),-6px_-6px_12px_0px_rgba(255,255,255,0.80)] 
            dark:shadow-[5px_5px_10px_0px_rgba(0,0,0,0.5),-5px_-5px_10px_0px_rgba(255,255,255,0.05)]
            mb-8"
        >
         
          {/* Room Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Host Information - Only show if joining from discovery */}
              {isDiscovery && (
                <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800
                  shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                  dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Host</h2>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 mr-4
                      shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                      dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]">
                      <img 
                        src={room.host.avatar} 
                        alt={room.host.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{room.host.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{room.host.bio}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Topics */}
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800
                shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {room.topics.map((topic, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 rounded-full text-sm
                        shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                        dark:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Room guidelines - Show if joining from discovery */}
              {isDiscovery && (
                <div className="p-5 rounded-xl bg-violet-50 dark:bg-violet-900/20
                  shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
                  dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
                  <h3 className="text-md font-medium text-violet-800 dark:text-violet-300 mb-2">Room Guidelines</h3>
                  <ul className="space-y-2 text-sm text-violet-700 dark:text-violet-300">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Be respectful to all participants and the host</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mute your microphone when not speaking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Use the raise hand feature to request to speak</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Join Controls with neumorphic styling */}
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800
              shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)]
              dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {isDiscovery ? 'Join this room' : 'Rejoin your room'}
              </h2>
              
              {/* Microphone Test - Only show if joining as speaker */}
              {(joinAs === 'speaker' || !isDiscovery) && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Microphone Test</h3>
                  <div className="p-4 bg-white dark:bg-gray-700 rounded-lg
                    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]">
                    {micPermission === false ? (
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Microphone access denied</p>
                        <motion.button
                          onClick={startAudioMonitoring}
                          className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm
                            shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                            dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                            hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                            dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                            transition-all duration-200"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Allow Access
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <motion.button
                              onClick={microphoneEnabled ? stopAudioMonitoring : startAudioMonitoring}
                              className={`p-2 rounded-full mr-2 ${microphoneEnabled ? 'bg-red-500' : 'bg-violet-500'} text-white
                                shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)]
                                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)]
                                hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)]
                                dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)]
                                transition-all duration-200`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {microphoneEnabled ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM5.53 5.53a8 8 0 1011.31 11.31M3.34 7a10 10 0 0114.32 14.32" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                              )}
                            </motion.button>
                            
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {microphoneEnabled ? (isSpeaking ? 'Speaking' : 'Mic on') : 'Test mic'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Voice Animation */}
                        <div className="h-10 rounded-lg overflow-hidden mb-2
                          shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
                          dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]
                          bg-gray-100 dark:bg-gray-600">
                          <VoiceWaveAnimation
                            audioLevel={audioLevel}
                            isSpeaking={isSpeaking && microphoneEnabled}
                            color={isSpeaking ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.4)'}
                          />
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {microphoneEnabled 
                            ? "Speak to test your microphone. If the bars move, you're good to go!" 
                            : "Click the button above to test your microphone before joining."}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Join as speaker/listener option - Only show if joining from discovery */}
              {isDiscovery && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Join as</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      className={`rounded-lg p-3 cursor-pointer transition-colors flex flex-col items-center ${
                        joinAs === 'speaker' 
                          ? 'bg-violet-100 dark:bg-violet-900/30 shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]' 
                          : 'bg-gray-100 dark:bg-gray-700/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]'
                      }`}
                      onClick={() => setJoinAs('speaker')}
                    >
                      <svg className={`w-8 h-8 mb-1 ${joinAs === 'speaker' ? 'text-violet-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className={`text-sm font-medium ${joinAs === 'speaker' ? 'text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400'}`}>Speaker</span>
                    </div>
                    <div 
                      className={`rounded-lg p-3 cursor-pointer transition-colors flex flex-col items-center ${
                        joinAs === 'listener' 
                          ? 'bg-violet-100 dark:bg-violet-900/30 shadow-[3px_3px_6px_rgba(0,0,0,0.05),-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.04)]' 
                          : 'bg-gray-100 dark:bg-gray-700/50 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.03)]'
                      }`}
                      onClick={() => setJoinAs('listener')}
                    >
                      <svg className={`w-8 h-8 mb-1 ${joinAs === 'listener' ? 'text-violet-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className={`text-sm font-medium ${joinAs === 'listener' ? 'text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-400'}`}>Listener</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Join Button with neumorphic styling */}
              <motion.button
                onClick={joinRoom}
                disabled={(joinAs === 'speaker' && micPermission === false)}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  (joinAs === 'speaker' && micPermission === false)
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-600 dark:text-gray-400'
                    : 'bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.04)] hover:shadow-[1px_1px_2px_rgba(0,0,0,0.05),-1px_-1px_2px_rgba(255,255,255,0.7)] dark:hover:shadow-[1px_1px_2px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.04)] transition-all duration-200'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isDiscovery ? 'Join Room' : 'Rejoin Room'}
              </motion.button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                {isDiscovery ? 'By joining, you agree to our community guidelines' : 'Rejoin your room session'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinRoomPage; 