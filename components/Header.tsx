import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
            H
          </div>
          <span className="font-serif text-xl font-bold text-gray-900 tracking-tight">HairAI</span>
        </div>

        {/* Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
          <button className="px-4 py-1.5 rounded-full bg-white text-indigo-600 shadow-sm text-sm font-medium flex items-center gap-2">
            <span>✂️</span> Simulator
          </button>
          <button className="px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-2">
            <span>💬</span> Consultant
          </button>
          <button className="px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-2">
            <span>🖼️</span> Inspiration
          </button>
          <button className="px-4 py-1.5 rounded-full text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors flex items-center gap-2">
            <span>📈</span> Trends
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           <button className="text-gray-400 hover:text-gray-600">
             <span className="sr-only">Settings</span>
             ⚙️
           </button>
        </div>
      </div>
    </header>
  );
};
