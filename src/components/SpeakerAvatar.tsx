import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import AudioWaveform from './AudioWaveform';

type SpeakerAvatarProps = {
  name: string;
  imageUrl?: string;
  isMuted: boolean;
  isSpeaking: boolean;
  isModerator?: boolean;
  onClick?: () => void;
};

const SpeakerAvatar = ({
  name,
  imageUrl,
  isMuted,
  isSpeaking,
  isModerator = false,
  onClick
}: SpeakerAvatarProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.div
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            onClick={onClick}
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: isSpeaking 
                    ? [
                        '0 0 0 0 rgba(79, 70, 229, 0.7)',
                        '0 0 0 10px rgba(79, 70, 229, 0)'
                      ] 
                    : '0 0 0 0 rgba(79, 70, 229, 0)'
                }}
                transition={{ 
                  repeat: isSpeaking ? Infinity : 0,
                  duration: 1.5,
                  ease: 'easeInOut'
                }}
                className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer"
              >
                <Avatar.Root className="w-full h-full">
                  <Avatar.Image
                    className="h-full w-full object-cover"
                    src={imageUrl}
                    alt={name}
                  />
                  <Avatar.Fallback className="text-secondary-600 leading-none flex h-full w-full items-center justify-center bg-secondary-100 text-lg font-medium">
                    {name.substring(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                
                {isMuted && (
                  <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </div>
                )}
                
                {isModerator && (
                  <div className="absolute top-0 right-0 bg-primary-600 p-1 rounded-full">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>
            
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white max-w-[80px] truncate">
              {name}
            </p>
            
            {!isMuted && (
              <div className="mt-1">
                <AudioWaveform 
                  isActive={isSpeaking} 
                  color={isSpeaking ? "#6366F1" : "#CBD5E1"}
                  barCount={3}
                />
              </div>
            )}
          </motion.div>
        </Tooltip.Trigger>
        
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-lg z-50"
            sideOffset={5}
            side="bottom"
          >
            {isModerator ? 'Moderator: ' : ''}{name}
            {isMuted ? ' (Muted)' : ''}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default SpeakerAvatar;
