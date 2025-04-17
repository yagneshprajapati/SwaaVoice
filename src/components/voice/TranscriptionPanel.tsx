import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TranscriptionPanelProps {
  isActive: boolean;
  transcriptions: string[];
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({ 
  isActive, 
  transcriptions 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest transcription
  useEffect(() => {
    if (panelRef.current && transcriptions.length > 0) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [transcriptions]);
  
  if (!isActive) return null;
  
  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden my-4
        shadow-[4px_4px_8px_rgba(0,0,0,0.05),-4px_-4px_8px_rgba(255,255,255,0.6)]
        dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.04)]"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="font-medium text-gray-900 dark:text-white">Live Transcription</h3>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Recording</span>
        </div>
      </div>
      
      <div 
        ref={panelRef}
        className="max-h-32 overflow-y-auto p-3 custom-scrollbar bg-gray-50 dark:bg-gray-800"
      >
        {transcriptions.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            Transcription will appear here as people speak...
          </p>
        ) : (
          <div className="space-y-2">
            {transcriptions.map((text, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg"
              >
                {text}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TranscriptionPanel; 