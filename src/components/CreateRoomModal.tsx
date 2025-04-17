import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomData: {
    title: string;
    description: string;
    theme: string;
    isPrivate: boolean;
  }) => void;
};

const themes = [
  "Technology",
  "Business",
  "Music",
  "Gaming",
  "Art & Culture",
  "Sports",
  "Science",
  "Education",
  "Lifestyle",
  "Wellness",
  "Politics",
  "Entertainment",
];

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('Technology');
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateRoom({
      title,
      description,
      theme: selectedTheme,
      isPrivate,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedTheme('Technology');
    setIsPrivate(false);
    setCurrentStep(0);
    onClose();
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
  };
  
  const stepVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } }
  };
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" asChild>
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6"
              >
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Create a new room
                </Dialog.Title>
                <Dialog.Description className="text-gray-600 dark:text-gray-300 mb-6">
                  Set up your room details and start the conversation
                </Dialog.Description>
                
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="step-0"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="space-y-4 mb-6">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Room Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="Give your room a catchy title"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Description
                            </label>
                            <textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="What will this room be about?"
                              rows={4}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <motion.button
                            type="button"
                            className="btn btn-primary"
                            onClick={nextStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!title || !description}
                          >
                            Next
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        variants={stepVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Room Theme
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {themes.map((theme) => (
                                <motion.button
                                  key={theme}
                                  type="button"
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    selectedTheme === theme
                                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-500 dark:bg-primary-900/30 dark:text-primary-400'
                                      : 'bg-gray-100 text-gray-700 border-2 border-transparent dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                  onClick={() => setSelectedTheme(theme)}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  {theme}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <label htmlFor="private" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Private Room
                            </label>
                            <input
                              type="checkbox"
                              id="private"
                              checked={isPrivate}
                              onChange={(e) => setIsPrivate(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (Only people with the link can join)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <motion.button
                            type="button"
                            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            onClick={prevStep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Back
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Create Room
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
                
                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default CreateRoomModal;
