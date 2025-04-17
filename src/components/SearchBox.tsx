import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SearchType = 'room' | 'user' | 'location';

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedType: 'all' | SearchType;
  onTypeChange: (type: 'all' | SearchType) => void;
  isSearching: boolean;
  onSearch?: () => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  query, 
  onQueryChange, 
  selectedType,
  onTypeChange,
  isSearching,
  placeholder = 'Search rooms, people, or locations...',
  onSearch
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleClear = () => {
    onQueryChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };
  
  return (
    <div 
      ref={searchRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isExpanded ? 'ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-center p-3">
        {/* Search icon */}
        <div className="text-gray-400 dark:text-gray-500 mr-3">
          {isSearching ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Clear button */}
        {query && (
          <button 
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none p-1"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search button */}
        {onSearch && (
          <button
            onClick={onSearch}
            className="ml-2 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-md"
            aria-label="Search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="border-t border-gray-100 dark:border-gray-700 px-3 py-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Search for:</span>
              {(['all', 'room', 'user', 'location'] as ('all' | SearchType)[]).map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedType === type
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => onTypeChange(type)}
                >
                  {type === 'all' ? 'All' : type === 'room' ? 'Rooms' : type === 'user' ? 'People' : 'Locations'}
                </button>
              ))}
            </div>
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {selectedType === 'all' 
                ? 'Search across all categories'
                : selectedType === 'room'
                  ? 'Find rooms by name, description, or theme'
                  : selectedType === 'user'
                    ? 'Find people by name or username'
                    : 'Find rooms by location'
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;
