import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Clock, Star } from 'lucide-react';
import Header from '../components/Header';
import PronunciationArea from '../components/PronunciationArea';
import AnalysisResult from '../components/AnalysisResult';
import Navigation from '../components/Navigation';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAuth } from '../context/AuthContext';
import { Lesson } from '../types';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showPracticeUnlock, setShowPracticeUnlock] = useState(false);

  const {
    isRecording,
    isPlaying,
    audioLevel,
    audioBlob,
    startRecording,
    stopRecording,
    playRecording,
    resetRecording
  } = useAudioRecorder();

  useEffect(() => {
    // Load pronunciation data
    fetch('/data/pronunciation-data.json')
      .then(response => response.json())
      .then(data => {
        setLessons(data.lessons);
        if (id) {
          const lessonIndex = data.lessons.findIndex((lesson: Lesson) => lesson.id === parseInt(id));
          if (lessonIndex !== -1) {
            setCurrentLessonIndex(lessonIndex);
          }
        }
      })
      .catch(error => console.error('Error loading pronunciation data:', error));
  }, [id]);

  useEffect(() => {
    if (audioBlob && !isRecording) {
      // Simulate pronunciation analysis after recording
      setTimeout(() => {
        const currentLesson = lessons[currentLessonIndex];
        if (currentLesson) {
          setUserScore(currentLesson.overall_score);
          setShowResult(true);
          
          // Check if lesson is completed (score > 70%)
          if (currentLesson.overall_score >= 70 && !lessonCompleted) {
            setLessonCompleted(true);
            setShowPracticeUnlock(true);
          }
          
          // Update user progress
          if (user) {
            updateUser({
              studyTime: user.studyTime + 5, // Add 5 minutes
              points: user.points + Math.floor(currentLesson.overall_score / 10)
            });
          }
        }
      }, 1000);
    }
  }, [audioBlob, isRecording, lessons, currentLessonIndex, user, updateUser]);

  const currentLesson = lessons[currentLessonIndex];

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLessonId = lessons[currentLessonIndex + 1].id;
      navigate(`/lesson/${nextLessonId}`);
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowResult(false);
      resetRecording();
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLessonId = lessons[currentLessonIndex - 1].id;
      navigate(`/lesson/${prevLessonId}`);
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowResult(false);
      resetRecording();
    }
  };

  const handleReset = () => {
    setShowResult(false);
    resetRecording();
  };

  const handleStartPractice = () => {
    // Store lesson context for practice
    const practiceData = {
      lessonId: currentLesson.id,
      lessonTitle: `Lesson ${currentLesson.id}`,
      topic: getTopicFromLesson(currentLesson),
      scenarios: getPracticeScenarios(currentLesson)
    };
    localStorage.setItem('practiceSession', JSON.stringify(practiceData));
    navigate('/practice-conversation');
  };

  const getTopicFromLesson = (lesson: Lesson) => {
    // Map lesson content to topics
    const topicMap: { [key: number]: string } = {
      1: 'Greetings & Introductions',
      2: 'Daily Conversations',
      3: 'Restaurant & Food Ordering'
    };
    return topicMap[lesson.id] || 'General Conversation';
  };

  const getPracticeScenarios = (lesson: Lesson) => {
    // Generate practice scenarios based on lesson content
    const scenarioMap: { [key: number]: any[] } = {
      1: [
        {
          title: 'Meeting Someone New',
          roleA: 'Person introducing themselves',
          roleB: 'Person responding to introduction',
          context: 'You meet someone at a coffee shop',
          suggestedPhrases: ['Hello, nice to meet you', 'What\'s your name?', 'Where are you from?']
        }
      ],
      2: [
        {
          title: 'Daily Routine Chat',
          roleA: 'Friend asking about daily activities',
          roleB: 'Friend sharing their routine',
          context: 'Casual conversation about daily life',
          suggestedPhrases: ['What do you usually do?', 'I wake up at...', 'How about you?']
        }
      ],
      3: [
        {
          title: 'Restaurant Ordering',
          roleA: 'Customer',
          roleB: 'Waiter/Server',
          context: 'Ordering food at a restaurant',
          suggestedPhrases: ['Can I have the menu?', 'What do you recommend?', 'I\'ll have...']
        }
      ]
    };
    return scenarioMap[lesson.id] || [];
  };
  if (!currentLesson || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentLessonIndex + 1) / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Lessons</span>
        </button>
      </div>

      <Header 
        score={userScore} 
        progress={progress} 
        level={user.level} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <PronunciationArea
          sentence={currentLesson.sentence}
          phonetic={currentLesson.phonetic}
          isRecording={isRecording}
          isPlaying={isPlaying}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onPlayback={playRecording}
          onReset={handleReset}
          audioLevel={audioLevel}
        />
        
        <AnalysisResult
          wordAnalysis={currentLesson.word_analysis}
          overallScore={currentLesson.overall_score}
          showResult={showResult}
        />
      </main>
      
      {/* Practice Unlock Modal */}
      {showPracticeUnlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Completed! 🎉</h2>
              <p className="text-gray-600">
                Great job! You scored {userScore}% and unlocked practice conversation.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <Users size={24} className="text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Practice Conversation Unlocked!</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Now practice what you learned in real conversations with other learners or AI.
              </p>
              <div className="text-xs text-gray-500">
                Topic: {getTopicFromLesson(currentLesson)}
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleStartPractice}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all flex items-center justify-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Start Practice Session</span>
              </button>
              
              <button
                onClick={() => setShowPracticeUnlock(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Practice Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Navigation
        currentLesson={currentLessonIndex + 1}
        totalLessons={lessons.length}
        onPrevious={handlePreviousLesson}
        onNext={handleNextLesson}
        canGoPrevious={currentLessonIndex > 0}
        canGoNext={currentLessonIndex < lessons.length - 1}
      />
    </div>
  );
};

export default LessonDetail;