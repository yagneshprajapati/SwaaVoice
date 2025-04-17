import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveAnimationProps {
  audioLevel: number;
  isSpeaking: boolean;
  color?: string;
}

const VoiceWaveAnimation: React.FC<VoiceWaveAnimationProps> = ({ 
  audioLevel, 
  isSpeaking, 
  color = 'rgba(59, 130, 246, 0.7)' // Default blue color with transparency
}) => {
  const maxBars = 18; // Number of bars in the animation
  const threshold = 20; // Threshold for considering speaking

  // Generate bars based on audio level
  const getWaveBars = () => {
    const bars: JSX.Element[] = [];
    for (let i = 0; i < maxBars; i++) {
      // Calculate height based on audio level and position
      // Center bars are taller
      const positionFactor = 1 - Math.abs((i - maxBars/2) / (maxBars/2)) * 0.6;
      let height = isSpeaking ? 
        Math.max(5, audioLevel * positionFactor * 0.5) : 
        5 + Math.sin(Date.now() / 1000 + i) * 3;
      
      // Ensure bars have a minimum height
      if (height < 5) height = 5;
      
      // Add each bar as a motion.div
      bars.push(
        <motion.div
          key={i}
          className="mx-0.5 rounded-full"
          style={{ 
            backgroundColor: color,
            width: '3px'
          }}
          initial={{ height: 5 }}
          animate={{ 
            height: height,
            transition: { duration: 0.1, ease: "easeOut" }
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div className="flex items-center justify-center h-12">
      <div className="flex items-end justify-center space-x-0.5">
        {getWaveBars()}
      </div>
    </div>
  );
};

export default VoiceWaveAnimation; 