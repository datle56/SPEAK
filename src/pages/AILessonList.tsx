import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Target, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AILesson {
  id: number;
  title: string;
  icon: string;
  category: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  topics: string[];
  samplePhrases: string[];
}

const AILessonList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<AILesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    // Load AI chat lessons data
    fetch('/data/aiChatLessons.json')
      .then(response => response.json())
      .then(data => {
        setLessons(data.aiChatLessons);
      })
      .catch(error => {
        console.error('Error loading AI lessons:', error);
        // Fallback data
        setLessons([
          {
            id: 1,
            title: "Restaurant Conversation",
            icon: "🍽️",
            category: "Daily Life",
            description: "Practice ordering food and talking to waiters",
            difficulty: "Beginner",
            estimatedTime: "10-15 minutes",
            topics: ["Food", "Ordering", "Polite requests"],
            samplePhrases: [
              "I'd like to order...",
              "Could I have the menu, please?",
              "What do you recommend?",
              "The bill, please."
            ]
          }
        ]);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(lessons.map(lesson => lesson.category)))];
  const filteredLessons = selectedCategory === 'All' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleStartLesson = (lesson: AILesson) => {
    // Store lesson data for the chat
    localStorage.setItem('aiChatLesson', JSON.stringify(lesson));
    navigate('/chat?mode=lesson');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">💬 AI Conversation Lessons</h1>
              <p className="text-blue-100">Practice real-world conversations with AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{lesson.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.category}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{lesson.description}</p>

              {/* Info */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{lesson.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target size={16} />
                  <span>{lesson.topics.length} topics</span>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Topics covered:</h4>
                <div className="flex flex-wrap gap-1">
                  {lesson.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Phrases */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">You'll practice phrases like:</h4>
                <div className="space-y-1">
                  {lesson.samplePhrases.slice(0, 2).map((phrase, index) => (
                    <div key={index} className="text-sm text-gray-600 italic">
                      "• {phrase}"
                    </div>
                  ))}
                  {lesson.samplePhrases.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{lesson.samplePhrases.length - 2} more phrases
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={() => handleStartLesson(lesson)}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Play size={20} />
                <span>Start Lesson</span>
              </button>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No lessons found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AILessonList;