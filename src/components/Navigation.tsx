import React from 'react';
import { Home, BookOpen, BarChart3, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentLesson: number;
  totalLessons: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentLesson,
  totalLessons,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}) => {
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: BookOpen, label: 'Lessons', active: false },
    { icon: BarChart3, label: 'Progress', active: false },
    { icon: User, label: 'Profile', active: false },
  ];

  return (
    <footer className="bg-white rounded-t-3xl shadow-lg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Lesson Progress</div>
            <div className="text-lg font-bold text-gray-800">
              {currentLesson} / {totalLessons}
            </div>
          </div>
          
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex justify-center space-x-8">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all ${
                item.active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Navigation;