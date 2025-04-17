import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoicePost, { VoicePostProps } from './VoicePost';

interface VoicePostsListProps {
  posts: VoicePostProps[];
  emptyMessage?: string;
  isLoading?: boolean;
}

const VoicePostsList = ({ 
  posts, 
  emptyMessage = "No voice posts yet", 
  isLoading = false 
}: VoicePostsListProps) => {
  const [visiblePosts, setVisiblePosts] = useState(5);

  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 5);
  };

  // Render a skeleton loader for loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10 animate-pulse"></div>
              <div className="ml-3 space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="rounded-full bg-gray-200 dark:bg-gray-600 h-10 w-10 animate-pulse"></div>
                <div className="flex-1">
                  <div className="flex items-end h-8 space-x-0.5">
                    {[...Array(20)].map((_, j) => (
                      <div
                        key={j}
                        className="w-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-sm animate-pulse"
                        style={{ height: `${Math.random() * 24 + 4}px` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render empty state
  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <p className="text-base text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.slice(0, visiblePosts).map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <VoicePost {...post} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {visiblePosts < posts.length && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Load more
            <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VoicePostsList;
