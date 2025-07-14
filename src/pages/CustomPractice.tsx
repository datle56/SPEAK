import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAuth } from '../context/AuthContext';

const CustomPractice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customSentence, setCustomSentence] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const handleAnalyze = () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        wordAnalysis: customSentence.split(' ').map(word => ({
          word,
          phonetic: `/${word.toLowerCase()}/`,
          accuracy: Math.floor(Math.random() * 40) + 60,
          status: Math.random() > 0.7 ? 'incorrect' : Math.random() > 0.4 ? 'close' : 'correct'
        }))
      };
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    resetRecording();
    setAnalysisResult(null);
    setCustomSentence('');
  };

  const AudioVisualizer: React.FC<{ audioLevel: number }> = ({ audioLevel }) => {
    const bars = Array.from({ length: 20 }, (_, i) => {
      const height = Math.random() * audioLevel * 100 + 10;
      return (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-green-500 rounded-full mx-1 transition-all duration-100"
          style={{ height: `${height}%`, width: '4px' }}
        />
      );
    });

    return (
      <div className="flex items-end justify-center h-16 space-x-1">
        {bars}
      </div>
    );
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
            <Volume2 size={32} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold">🎯 Custom Practice</h1>
              <p className="text-blue-100">Practice pronunciation with your own sentences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Your Sentence</h2>
          <div className="space-y-4">
            <textarea
              value={customSentence}
              onChange={(e) => setCustomSentence(e.target.value)}
              placeholder="Type any sentence you want to practice pronouncing..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCustomSentence("Hello, how are you today?")}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                Sample: Greeting
              </button>
              <button
                onClick={() => setCustomSentence("I would like to order a coffee, please.")}
                className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors"
              >
                Sample: Ordering
              </button>
              <button
                onClick={() => setCustomSentence("Could you help me find the nearest subway station?")}
                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors"
              >
                Sample: Asking for help
              </button>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        {customSentence && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-relaxed">
                {customSentence}
              </h2>
              <p className="text-sm text-gray-600">
                Click the microphone to start recording your pronunciation
              </p>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse scale-125" />
                )}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`relative w-24 h-24 rounded-full shadow-2xl transition-all duration-300 transform ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 scale-110' 
                      : 'bg-gradient-to-br from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <Square size={32} className="text-white mx-auto" />
                  ) : (
                    <Mic size={32} className="text-white mx-auto" />
                  )}
                </button>
              </div>
            </div>
            
            {isRecording && (
              <div className="flex justify-center mb-6">
                <AudioVisualizer audioLevel={audioLevel} />
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={playRecording}
                disabled={!audioBlob || isRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={!audioBlob || isRecording || isAnalyzing}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={20} />
                    <span>Analyze</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                disabled={isRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-colors"
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pronunciation Analysis</h3>
              <div className={`text-4xl font-bold ${
                analysisResult.overallScore > 85 ? 'text-green-500' : 
                analysisResult.overallScore > 70 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {analysisResult.overallScore}%
              </div>
              <p className="text-gray-600 mt-2">
                {analysisResult.overallScore >= 80 ? 'Excellent!' : 
                 analysisResult.overallScore >= 60 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>

            <div className="grid gap-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Word-by-word Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.wordAnalysis.map((word: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      word.status === 'correct' ? 'border-green-200 bg-green-50' :
                      word.status === 'incorrect' ? 'border-red-200 bg-red-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-800">{word.word}</span>
                      <span className={`text-sm font-medium ${
                        word.status === 'correct' ? 'text-green-600' :
                        word.status === 'incorrect' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {word.accuracy}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded">
                      {word.phonetic}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Tips for Improvement</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Practice slowly and focus on each word clearly</li>
                <li>• Record multiple times to track your progress</li>
                <li>• Pay attention to word stress and intonation</li>
                <li>• Use the phonetic transcription as a guide</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomPractice;