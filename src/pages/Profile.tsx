import React from 'react';
import { useAuth } from '../context/AuthContext';
import { achievements } from '../data/achievements';
import { Calendar, Clock, Target, Trophy, Star, Settings, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalAchievements = achievements.length;
  const studyDays = Math.floor(user.studyTime / 60);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">👤 Profile</h1>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-green-500">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">Level {user.level}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{user.points}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{user.accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="mr-3 text-blue-500" />
              Learning Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Lessons Completed</span>
                  <span className="text-sm font-semibold">{user.completedLessons}/{user.totalLessons}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${(user.completedLessons / user.totalLessons) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Accuracy</span>
                  <span className="text-sm font-semibold">{user.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                    style={{ width: `${user.accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-3 text-green-500" />
              Study Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-500">{Math.floor(user.studyTime / 60)}h</div>
                <div className="text-sm text-gray-600">Total Study Time</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-500">{studyDays}</div>
                <div className="text-sm text-gray-600">Study Days</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-500">{user.streak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-500">
                  {new Date().getFullYear() - new Date(user.joinDate).getFullYear()}
                </div>
                <div className="text-sm text-gray-600">Years Learning</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="mr-3 text-yellow-500" />
            Achievements ({earnedAchievements.length}/{totalAchievements})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.earned
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-gray-800">{achievement.title}</div>
                <div className="text-sm text-gray-600 mb-2">{achievement.description}</div>
                {achievement.earned && achievement.earnedDate && (
                  <div className="text-xs text-green-600 font-medium">
                    Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                  </div>
                )}
                {!achievement.earned && (
                  <div className="text-xs text-gray-500">Not earned yet</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;