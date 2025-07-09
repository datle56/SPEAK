import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react';

interface WordAnalysis {
  word: string;
  phonetic: string;
  accuracy: number;
  status: 'correct' | 'incorrect' | 'close';
}

interface AnalysisResultProps {
  wordAnalysis: WordAnalysis[];
  overallScore: number;
  showResult: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  wordAnalysis,
  overallScore,
  showResult
}) => {
  if (!showResult) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'text-green-600 bg-green-50';
      case 'incorrect': return 'text-red-600 bg-red-50';
      case 'close': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle size={16} className="text-green-600" />;
      case 'incorrect': return <XCircle size={16} className="text-red-600" />;
      case 'close': return <AlertCircle size={16} className="text-yellow-600" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStarCount = (score: number) => {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 50) return 1;
    return 0;
  };

  const stars = getStarCount(overallScore);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Star
              key={i}
              size={32}
              className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Pronunciation Analysis</h3>
        <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
        <p className="text-gray-600 mt-2">
          {overallScore >= 80 ? 'Excellent!' : overallScore >= 60 ? 'Good job!' : 'Keep practicing!'}
        </p>
      </div>

      <div className="grid gap-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Word-by-word Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wordAnalysis.map((word, index) => (
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
                <div className="flex items-center space-x-2">
                  {getStatusIcon(word.status)}
                  <span className={`text-sm font-medium ${getStatusColor(word.status)}`}>
                    {word.accuracy}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded">
                {word.phonetic}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Pronunciation Tips</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Focus on words marked in red - they need more practice</li>
          <li>• Yellow words are close - small adjustments needed</li>
          <li>• Practice with the phonetic transcription to improve accuracy</li>
          <li>• Record multiple times to track your improvement</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisResult;