import React from 'react';
import { Volume2, Settings, Trophy } from 'lucide-react';

interface HeaderProps {
  score: number;
  progress: number;
  level: number;
}

const Header: React.FC<HeaderProps> = ({ score, progress, level }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Volume2 size={32} className="text-white" />
          <h1 className="text-2xl font-bold">SpeakPro</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Trophy size={20} />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
            <div className="text-xs opacity-90">Score: {score}%</div>
          </div>
          
          <div className="w-24 bg-white/20 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;