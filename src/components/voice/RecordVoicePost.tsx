import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';

interface RecordVoicePostProps {
  onSave: (data: { title: string, audioBlob: Blob, duration: number }) => void;
  onCancel: () => void;
}

const RecordVoicePost = ({ onSave, onCancel }: RecordVoicePostProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [title, setTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingStep, setRecordingStep] = useState<'initial' | 'recording' | 'preview' | 'details'>('initial');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Stop any ongoing recordings
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Stop any ongoing audio playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Clear timers and animation frames
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      // Revoke object URLs
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [isRecording, audioUrl]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for visualizations
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start visualization
      visualize();
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setRecordingStep('preview');
        
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStep('recording');
      
      // Timer for recording duration
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Cannot access your microphone. Please check your browser permissions.');
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // Visualize audio levels for the recording
  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevels = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      
      // Get average level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      
      // Update visualization
      setAudioLevels(prev => [...prev, avg].slice(-50));
      
      animationFrameRef.current = requestAnimationFrame(updateLevels);
    };
    
    updateLevels();
  };

  // Preview recording
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  // Handle audio playback end
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Submit the new voice post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioBlob) return;
    
    onSave({
      title: title || 'Voice message',
      audioBlob,
      duration: recordingDuration
    });
  };

  return (
    <Dialog.Root open={true} onOpenChange={() => onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl z-50 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {recordingStep === 'details' ? 'Finish your voice post' : 'Record a voice post'}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {recordingStep === 'initial' && "Share your thoughts with voice. Tap the mic to start recording."}
            {recordingStep === 'recording' && "Recording in progress. Tap stop when you're done."}
            {recordingStep === 'preview' && "Preview your recording and proceed when ready."}
            {recordingStep === 'details' && "Add a title to your voice post."}
          </Dialog.Description>
          
          <AnimatePresence mode="wait">
            {/* Step 1: Start recording */}
            {recordingStep === 'initial' && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.button
                  onClick={startRecording}
                  className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </motion.button>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tap to start recording</p>
              </motion.div>
            )}
            
            {/* Step 2: Recording in progress */}
            {recordingStep === 'recording' && (
              <motion.div
                key="recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <div className="mb-6 relative">
                  <div className="flex justify-center items-end h-16 space-x-1">
                    {audioLevels.map((level, idx) => (
                      <motion.div
                        key={idx}
                        className="w-1.5 bg-red-500 dark:bg-red-400 rounded-t"
                        initial={{ height: 4 }}
                        animate={{ height: Math.max(4, level / 2) }}
                        transition={{ type: 'spring', damping: 10, stiffness: 300 }}
                      />
                    ))}
                  </div>
                  
                  <p className="text-center mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
                    {formatTime(recordingDuration)}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <motion.button
                    onClick={stopRecording}
                    className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Preview recording */}
            {recordingStep === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col py-4"
              >
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <button 
                      onClick={togglePlayback}
                      className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <p className="text-center text-gray-700 dark:text-gray-300">
                    Duration: {formatTime(recordingDuration)}
                  </p>
                  
                  <audio 
                    ref={audioRef} 
                    src={audioUrl || undefined} 
                    onEnded={handleAudioEnded} 
                    className="hidden"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setRecordingStep('initial');
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setAudioLevels([]);
                      setRecordingDuration(0);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Record again
                  </button>
                  
                  <button
                    onClick={() => setRecordingStep('details')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Step 4: Add details */}
            {recordingStep === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's this voice post about?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setRecordingStep('preview')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Dialog.Close asChild>
            <button 
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RecordVoicePost;
