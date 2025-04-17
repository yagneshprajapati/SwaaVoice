import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { themeClasses } from '../theme/themeClasses';

const DiagnosticsPage: React.FC = () => {
  const { themeMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeClasses[themeMode].background}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Diagnostics Page</h1>
        
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Room Effects Test</h2>
          
          <div className="space-y-4">
            {/* No room effects test cases */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage; 