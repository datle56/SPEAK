import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Bot, Clock, Mic, MicOff, Phone, PhoneOff, Star, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PracticeSession {
  lessonId: number;
  lessonTitle: string;
  topic: string;
  scenarios: PracticeScenario[];
}

interface PracticeScenario {
  title: string;
  roleA: string;
  roleB: string;
  context: string;
  suggestedPhrases: string[];
}

interface MatchmakingState {
  status: 'waiting' | 'searching' | 'found' | 'connected' | 'ai-mode';
  waitTime: number;
  partner?: {
    name: string;
    avatar: string;
    level: number;
  };
}

const PracticeConversation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<PracticeScenario | null>(null);
  const [matchmaking, setMatchmaking] = useState<MatchmakingState>({
    status: 'waiting',
    waitTime: 0
  });
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userRole, setUserRole] = useState<'A' | 'B'>('A');
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<any>(null);

  useEffect(() => {
    // Load practice session data
    const savedSession = localStorage.getItem('practiceSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setPracticeSession(session);
      if (session.scenarios.length > 0) {
        setSelectedScenario(session.scenarios[0]);
      }
    } else {
      // Redirect back if no session data
      navigate('/lessons');
    }
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (matchmaking.status === 'searching') {
      interval = setInterval(() => {
        setMatchmaking(prev => ({
          ...prev,
          waitTime: prev.waitTime + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [matchmaking.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const handleStartMatchmaking = () => {
    setMatchmaking({ status: 'searching', waitTime: 0 });
    
    // Simulate matchmaking process
    setTimeout(() => {
      const foundPartner = Math.random() > 0.3; // 70% chance to find partner
      
      if (foundPartner) {
        const mockPartner = {
          name: 'Sarah Chen',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          level: Math.floor(Math.random() * 3) + 3
        };
        
        setMatchmaking({
          status: 'found',
          waitTime: 0,
          partner: mockPartner
        });
        
        // Auto-connect after 3 seconds
        setTimeout(() => {
          setMatchmaking(prev => ({ ...prev, status: 'connected' }));
          setUserRole(Math.random() > 0.5 ? 'A' : 'B');
        }, 3000);
      } else {
        // No partner found after 10 seconds
        setTimeout(() => {
          if (matchmaking.status === 'searching') {
            setMatchmaking(prev => ({ ...prev, status: 'waiting' }));
          }
        }, 10000);
      }
    }, Math.random() * 5000 + 2000); // 2-7 seconds
  };

  const handleUseAI = () => {
    setMatchmaking({ status: 'ai-mode', waitTime: 0 });
    setUserRole('A'); // User is always role A with AI
    setTimeout(() => {
      setIsInCall(true);
    }, 1000);
  };

  const handleStartCall = () => {
    setIsInCall(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    
    // Generate mock feedback
    const feedback = {
      duration: callDuration,
      vocabularyUsed: Math.floor(Math.random() * 15) + 10,
      pronunciationScore: Math.floor(Math.random() * 30) + 70,
      fluencyScore: Math.floor(Math.random() * 25) + 75,
      correctPhrases: [
        "Great use of 'Can I have...'",
        "Perfect pronunciation of 'restaurant'",
        "Good intonation in questions"
      ],
      improvements: [
        "Practice 'th' sound in 'thank you'",
        "Speak a bit slower for clarity",
        "Use more varied vocabulary"
      ],
      xpEarned: Math.floor(Math.random() * 50) + 30
    };
    
    setSessionFeedback(feedback);
    setShowFeedback(true);
    
    // Update user progress
    if (user) {
      // This would normally be handled by the updateUser function
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!practiceSession || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/lessons')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <Users size={32} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold">🗣️ Practice Conversation</h1>
              <p className="text-blue-100">{practiceSession.topic}</p>
            </div>
          </div>
          {isInCall && (
            <div className="text-right">
              <div className="text-lg font-bold">{formatTime(callDuration)}</div>
              <div className="text-sm opacity-90">Call Duration</div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Scenario Selection */}
        {!isInCall && matchmaking.status === 'waiting' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Practice Scenario</h2>
            <p className="text-gray-600 mb-6">
              You just completed {practiceSession.lessonTitle}. Now practice with a conversation partner!
            </p>
            
            <div className="space-y-4">
              {practiceSession.scenarios.map((scenario, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedScenario?.title === scenario.title
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{scenario.context}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-700">Role A</div>
                      <div className="text-sm text-blue-600">{scenario.roleA}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-700">Role B</div>
                      <div className="text-sm text-green-600">{scenario.roleB}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Sample phrases: {scenario.suggestedPhrases.slice(0, 2).join(', ')}...
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={handleStartMatchmaking}
                disabled={!selectedScenario}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Find Practice Partner
              </button>
            </div>
          </div>
        )}

        {/* Matchmaking */}
        {matchmaking.status === 'searching' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Practice Partner...</h2>
              <p className="text-gray-600">Searching for someone who studied the same topic</p>
              <div className="text-lg font-semibold text-blue-600 mt-2">
                {formatTime(matchmaking.waitTime)}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  💡 Tip: While waiting, review the key phrases from your lesson!
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setMatchmaking({ status: 'waiting', waitTime: 0 })}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel Search
                </button>
                
                <button
                  onClick={handleUseAI}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
                >
                  <Bot size={20} />
                  <span>Practice with AI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Partner Found */}
        {matchmaking.status === 'found' && matchmaking.partner && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-green-400">
                <img 
                  src={matchmaking.partner.avatar} 
                  alt={matchmaking.partner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Partner Found! 🎉</h2>
              <p className="text-lg text-gray-700">{matchmaking.partner.name}</p>
              <p className="text-sm text-gray-600">Level {matchmaking.partner.level}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800">
                Connecting you both now... Get ready to practice!
              </p>
            </div>
          </div>
        )}

        {/* AI Mode */}
        {matchmaking.status === 'ai-mode' && !isInCall && (
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Practice Partner</h2>
              <p className="text-gray-600">Ready to practice with your AI conversation partner</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-purple-800">
                🤖 Your AI partner will play the role of: <strong>{selectedScenario?.roleB}</strong>
              </p>
            </div>
            
            <button
              onClick={handleStartCall}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Start AI Practice Session
            </button>
          </div>
        )}

        {/* In Call Interface */}
        {isInCall && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedScenario?.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedScenario?.context}</p>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${userRole === 'A' ? 'bg-blue-100 border-2 border-blue-400' : 'bg-gray-100'}`}>
                    <div className="text-sm font-medium text-gray-700">Your Role</div>
                    <div className="text-sm text-gray-600">{selectedScenario?.roleA}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${userRole === 'B' ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-100'}`}>
                    <div className="text-sm font-medium text-gray-700">Partner Role</div>
                    <div className="text-sm text-gray-600">{selectedScenario?.roleB}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested Phrases</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedScenario?.suggestedPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              
              <button
                onClick={handleEndCall}
                className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && sessionFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Practice Session Complete! 🎉</h2>
                <p className="text-gray-600">Duration: {formatTime(sessionFeedback.duration)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{sessionFeedback.vocabularyUsed}</div>
                  <div className="text-sm text-blue-700">Words Used</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{sessionFeedback.pronunciationScore}%</div>
                  <div className="text-sm text-green-700">Pronunciation</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{sessionFeedback.fluencyScore}%</div>
                  <div className="text-sm text-purple-700">Fluency</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ What you did well:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    {sessionFeedback.correctPhrases.map((phrase: string, index: number) => (
                      <li key={index}>• {phrase}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Areas to improve:</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {sessionFeedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6 text-center">
                <div className="text-lg font-bold text-gray-800">+{sessionFeedback.xpEarned} XP Earned!</div>
                <div className="text-sm text-gray-600">Keep practicing to maintain your streak!</div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    navigate('/lessons');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all"
                >
                  Continue Learning
                </button>
                
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setMatchmaking({ status: 'waiting', waitTime: 0 });
                    setIsInCall(false);
                    setCallDuration(0);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Practice Again
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PracticeConversation;