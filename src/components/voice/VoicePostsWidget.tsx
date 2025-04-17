import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoicePost, { VoicePostProps } from './VoicePost';
import * as Avatar from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';

interface VoicePostsWidgetProps {
  title?: string;
  posts: VoicePostProps[];
  maxPosts?: number;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
}

const VoicePostsWidget = ({
  title = 'Voice Posts',
  posts,
  maxPosts = 3,
  showViewAll = true,
  onViewAllClick
}: VoicePostsWidgetProps) => {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  
  // Toggle expand/collapse for a post
  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause for audio
  const togglePlayback = (postId: string, audioUrl: string) => {
    // Create audio element if it doesn't exist
    if (!audioRefs.current[postId]) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
      });
      audioRefs.current[postId] = audio;
    }

    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== postId) {
      audioRefs.current[currentlyPlaying]?.pause();
    }
    
    // Toggle play/pause
    if (currentlyPlaying === postId) {
      audioRefs.current[postId].pause();
      setCurrentlyPlaying(null);
    } else {
      audioRefs.current[postId].play();
      setCurrentlyPlaying(postId);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          {title}
        </h3>
        
        {showViewAll && posts.length > 0 && (
          <button
            onClick={onViewAllClick}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            View all
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <AnimatePresence initial={false}>
          {posts.length > 0 ? (
            posts.slice(0, maxPosts).map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3"
              >
                {/* Compact view by default */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <Avatar.Root className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Avatar.Image
                        src={post.userAvatar}
                        alt={post.userName}
                        className="h-full w-full object-cover"
                      />
                      <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium">
                        {post.userName.substring(0, 2).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {post.title}
                        </p>
                        <span className="ml-2 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(post.duration)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="truncate">{post.userName}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    <button
                      onClick={() => togglePlayback(post.id, post.audioUrl)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        currentlyPlaying === post.id 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      }`}
                      aria-label={currentlyPlaying === post.id ? "Pause" : "Play"}
                    >
                      {currentlyPlaying === post.id ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => togglePostExpansion(post.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      aria-label="Expand"
                    >
                      <svg className={`w-4 h-4 transition-transform ${expandedPostId === post.id ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Expanded view */}
                <AnimatePresence>
                  {expandedPostId === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 overflow-hidden"
                    >
                      {/* Simple waveform visualization */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-end h-8 space-x-0.5 mb-1">
                          {Array(40).fill(0).map((_, i) => {
                            const height = Math.random() * 100;
                            return (
                              <motion.div
                                key={i}
                                className="w-1 rounded-sm bg-primary-500/50 dark:bg-primary-400/50"
                                initial={{ height: 4 }}
                                animate={{ height: `${(height / 100) * 32}px` }}
                              />
                            );
                          })}
                        </div>
                        
                        {/* Engagement stats */}
                        <div className="flex text-xs text-gray-500 dark:text-gray-400 justify-between">
                          <div className="flex space-x-3">
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {post.likesCount}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {post.commentsCount}
                            </span>
                          </div>
                          <span className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="p-6 text-center">
              <svg className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No voice posts available</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* View all link for mobile */}
      {showViewAll && posts.length > maxPosts && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={onViewAllClick}
            className="text-sm text-primary-600 dark:text-primary-400 font-medium"
          >
            View all {posts.length} voice posts
          </button>
        </div>
      )}
    </div>
  );
};

export default VoicePostsWidget;
