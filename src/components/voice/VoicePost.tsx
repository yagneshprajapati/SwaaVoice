import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Avatar from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';

export interface VoicePostProps {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  audioUrl: string;
  duration: number; // in seconds
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  waveformData?: number[]; // For visualization
  isLiked?: boolean;
}

const VoicePost = ({
  id,
  userId,
  userName,
  userAvatar,
  title,
  audioUrl,
  duration,
  createdAt,
  likesCount,
  commentsCount,
  waveformData = Array(40).fill(0).map(() => Math.random() * 100),
  isLiked = false,
}: VoicePostProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Toggle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle like action
  const handleLike = () => {
    setLiked(!liked);
    setLocalLikesCount(prev => liked ? prev - 1 : prev + 1);
    // In a real app, you'd make an API call here
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full">
          <Avatar.Image
            className="h-full w-full object-cover"
            src={userAvatar}
            alt={userName}
          />
          <Avatar.Fallback className="leading-none flex h-full w-full items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium">
            {userName.substring(0, 2).toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">{title}</h2>
      
      {/* Audio player */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <div className="flex items-center space-x-3 mb-3">
          <button 
            onClick={togglePlayback}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isPlaying 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
            }`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 space-y-1">
            {/* Waveform visualization */}
            <div className="flex items-end h-8 space-x-0.5">
              {waveformData.map((height, i) => {
                // Calculate position relative to current playback
                const percent = (i / waveformData.length) * 100;
                const isPlayed = (currentTime / duration) * 100 >= percent;
                
                return (
                  <motion.div
                    key={i}
                    className={`w-1 rounded-sm ${
                      isPlayed 
                        ? 'bg-primary-500 dark:bg-primary-400' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    initial={{ height: 4 }}
                    animate={{ height: `${(height / 100) * 32}px` }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  />
                );
              })}
            </div>
            
            {/* Time indicators */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between mt-3 text-gray-500 dark:text-gray-400">
        <button 
          onClick={handleLike}
          className={`flex items-center text-sm ${
            liked ? 'text-red-500 dark:text-red-400' : ''
          }`}
        >
          <svg className="w-5 h-5 mr-1" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {localLikesCount}
        </button>
        
        <button className="flex items-center text-sm">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {commentsCount}
        </button>
        
        <button className="flex items-center text-sm">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};

export default VoicePost;
