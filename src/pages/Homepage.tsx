import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, BookOpen, BarChart3, Trophy, Flame, Star, Mic, MessageCircle, Users } from 'lucide-react';
import { achievements } from '../data/achievements';

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const recentAchievements = achievements.filter(a => a.earned).slice(0, 3);
  const progressPercentage = (user.completedLessons / user.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user.name}! 👋</h1>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <Flame size={16} className="text-orange-300" />
                  <span>{user.streak} day streak</span>
                </div>
                <div>Level {user.level}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-sm opacity-90">points</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="mr-3 text-blue-500" />
            Your Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4A90E2" />
                      <stop offset="100%" stopColor="#7ED321" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
              <div className="text-lg font-semibold">{user.completedLessons}/{user.totalLessons}</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">{user.accuracy}%</div>
              <div className="text-sm text-gray-600">Average Accuracy</div>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(user.accuracy / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{Math.floor(user.studyTime / 60)}h</div>
              <div className="text-sm text-gray-600">Study Time</div>
              <div className="text-xs text-gray-500 mt-1">{user.studyTime % 60}m total</div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="mr-3 text-yellow-500" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-gray-800">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
                {achievement.earnedDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Practice Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Mic className="mr-3 text-purple-500" />
            Quick Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/custom-practice')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Mic size={32} className="mx-auto mb-3" />
              <div className="text-lg font-bold mb-2">Custom Pronunciation</div>
              <div className="text-sm opacity-90">Practice with your own sentences</div>
            </button>
            
            <button
              onClick={() => navigate('/roleplay-setup')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Users size={32} className="mx-auto mb-3" />
              <div className="text-lg font-bold mb-2">Role Play Chat</div>
              <div className="text-sm opacity-90">Practice conversations with AI</div>
            </button>
          </div>
        </div>
          <button
            onClick={() => navigate('/lesson/3')}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Play size={32} className="mx-auto mb-3" />
            <div className="text-xl font-bold mb-2">Continue Learning</div>
            <div className="text-sm opacity-90">Resume your current lesson</div>
          </button>
          
          <button
            onClick={() => navigate('/lessons')}
            className="bg-white border-2 border-blue-200 text-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <BookOpen size={32} className="mx-auto mb-3 text-blue-500" />
            <div className="text-xl font-bold mb-2">View All Lessons</div>
            <div className="text-sm text-gray-600">Explore the lesson map</div>
          </button>
          
          <button
            onClick={() => navigate('/chat')}
            className="bg-white border-2 border-green-200 text-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <MessageCircle size={32} className="mx-auto mb-3 text-green-500" />
            <div className="text-xl font-bold mb-2">AI Chat</div>
            <div className="text-sm text-gray-600">Practice with AI tutor</div>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="bg-white border-2 border-purple-200 text-gray-800 p-6 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <BarChart3 size={32} className="mx-auto mb-3 text-purple-500" />
            <div className="text-xl font-bold mb-2">Your Progress</div>
            <div className="text-sm text-gray-600">View achievements & stats</div>
          </button>
        </div>
      </main>
    </div>
  );
};

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
export default Homepage;