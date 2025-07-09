import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lessonNodes } from '../data/lessonMap';
import { Star, Lock, Play, CheckCircle, Crown, ArrowRight, Clock, Target } from 'lucide-react';

const LessonMap: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const getCardStyle = (node: any) => {
    switch (node.status) {
      case 'perfect':
        return 'bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-white border-yellow-500 shadow-yellow-200';
      case 'completed':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-500 shadow-green-200';
      case 'current':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-500 shadow-blue-200 ring-4 ring-blue-200 animate-pulse';
      case 'available':
        return 'bg-white text-gray-800 border-gray-200 hover:border-blue-400 hover:shadow-blue-100 shadow-gray-100';
      case 'locked':
      default:
        return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-gray-50';
    }
  };

  const getActionButton = (node: any) => {
    if (node.status === 'locked') {
      return (
        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-xl">
          <Lock size={16} />
          <span className="text-sm font-medium">Locked</span>
        </div>
      );
    }
    
    if (node.status === 'current') {
      return (
        <button className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all transform hover:scale-105">
          <Play size={16} />
          <span className="text-sm font-bold">Continue</span>
        </button>
      );
    }
    
    if (node.status === 'completed' || node.status === 'perfect') {
      return (
        <button className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all transform hover:scale-105">
          <ArrowRight size={16} />
          <span className="text-sm font-bold">Review</span>
        </button>
      );
    }
    
    return (
      <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all transform hover:scale-105">
        <Play size={16} />
        <span className="text-sm font-bold">Start</span>
      </button>
    );
  };

  const getProgressPercentage = (node: any) => {
    switch (node.status) {
      case 'perfect':
      case 'completed':
        return 100;
      case 'current':
        return 65;
      case 'available':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusIcon = (node: any) => {
    switch (node.status) {
      case 'perfect':
        return <Crown size={24} className="text-yellow-300" />;
      case 'completed':
        return <CheckCircle size={24} className="text-green-300" />;
      case 'current':
        return <Play size={24} className="text-blue-300" />;
      case 'locked':
        return <Lock size={24} className="text-gray-400" />;
      default:
        return <Target size={24} className="text-blue-500" />;
    }
  };

  const handleCardClick = (node: any) => {
    if (node.status !== 'locked') {
      navigate(`/lesson/${node.id}`);
    }
  };

  const progressPercentage = (user.completedLessons / user.totalLessons) * 100;
  const completedLessons = lessonNodes.filter(node => node.status === 'completed' || node.status === 'perfect').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-b-3xl shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">📚 Pronunciation Lessons</h1>
              <p className="text-blue-100">Master English pronunciation step by step</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">Level {user.level}</div>
              <div className="text-sm opacity-90">{user.points} points</div>
            </div>
          </div>
          
          <div className="bg-white/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold">{completedLessons}/{lessonNodes.length} lessons</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-1000 shadow-lg"
                style={{ width: `${(completedLessons / lessonNodes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Lesson Cards */}
        <div className="space-y-4">
          {lessonNodes.map((node, index) => (
            <div
              key={node.id}
              onClick={() => handleCardClick(node)}
              className={`lesson-card relative overflow-hidden rounded-2xl border-2 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer ${getCardStyle(node)}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
              </div>

              <div className="relative flex items-center p-6">
                {/* Left: Icon */}
                <div className="flex-shrink-0 mr-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                    node.status === 'locked' ? 'bg-gray-200' : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    {node.status === 'locked' ? (
                      <Lock size={24} className="text-gray-400" />
                    ) : (
                      <span>{node.icon}</span>
                    )}
                  </div>
                </div>

                {/* Center: Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold truncate">{node.title}</h3>
                    {getStatusIcon(node)}
                    {node.status === 'perfect' && (
                      <div className="flex space-x-1">
                        {Array.from({ length: 3 }, (_, i) => (
                          <Star key={i} size={16} className="text-yellow-300 fill-current animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${node.status === 'locked' ? 'text-gray-500' : 'opacity-90'}`}>
                    {node.category} • {node.status === 'locked' ? 'Complete previous lessons to unlock' : 'Practice pronunciation and improve your skills'}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium opacity-75">Progress</span>
                      <span className="text-xs font-bold">{getProgressPercentage(node)}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${node.status === 'locked' ? 'bg-gray-300' : 'bg-white/30'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          node.status === 'perfect' ? 'bg-gradient-to-r from-yellow-300 to-orange-300' :
                          node.status === 'completed' ? 'bg-gradient-to-r from-green-300 to-green-400' :
                          node.status === 'current' ? 'bg-gradient-to-r from-blue-300 to-blue-400' :
                          'bg-blue-400'
                        }`}
                        style={{ width: `${getProgressPercentage(node)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Action */}
                <div className="flex-shrink-0 ml-6">
                  <div className="text-center">
                    {node.status === 'completed' || node.status === 'perfect' ? (
                      <div className="mb-2">
                        <div className="text-lg font-bold">
                          {node.status === 'perfect' ? '100%' : '85%'}
                        </div>
                        <div className="text-xs opacity-75">Best Score</div>
                      </div>
                    ) : node.status === 'current' ? (
                      <div className="mb-2">
                        <div className="text-lg font-bold">65%</div>
                        <div className="text-xs opacity-75">Current</div>
                      </div>
                    ) : null}
                    {getActionButton(node)}
                  </div>
                </div>
              </div>

              {/* Shimmer Effect for Current Lesson */}
              {node.status === 'current' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="mr-3 text-blue-500" />
            Learning Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-sm text-green-700">Lessons Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600">{user.accuracy}%</div>
              <div className="text-sm text-blue-700">Average Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-600">{Math.floor(user.studyTime / 60)}h</div>
              <div className="text-sm text-purple-700">Study Time</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonMap;