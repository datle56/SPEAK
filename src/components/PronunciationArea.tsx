import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';

interface PronunciationAreaProps {
  sentence: string;
  phonetic: string;
  isRecording: boolean;
  isPlaying: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayback: () => void;
  onReset: () => void;
  audioLevel: number;
}

const PronunciationArea: React.FC<PronunciationAreaProps> = ({
  sentence,
  phonetic,
  isRecording,
  isPlaying,
  onStartRecording,
  onStopRecording,
  onPlayback,
  onReset,
  audioLevel
}) => {
  const [micScale, setMicScale] = useState(1);

  useEffect(() => {
    if (isRecording) {
      const scale = 1 + (audioLevel * 0.3);
      setMicScale(scale);
    } else {
      setMicScale(1);
    }
  }, [audioLevel, isRecording]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-relaxed">
          {sentence}
        </h2>
        <p className="text-lg text-gray-600 font-mono bg-gray-50 px-4 py-2 rounded-xl inline-block">
          {phonetic}
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse scale-125" />
          )}
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`relative w-24 h-24 rounded-full shadow-2xl transition-all duration-300 transform ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-gradient-to-br from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 hover:scale-105'
            }`}
            style={{ transform: `scale(${micScale})` }}
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
          onClick={onPlayback}
          disabled={isRecording}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        <button
          onClick={onReset}
          disabled={isRecording}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-colors"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
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

export default PronunciationArea;