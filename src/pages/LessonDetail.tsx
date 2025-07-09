import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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