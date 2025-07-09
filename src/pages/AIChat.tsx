import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Mic, Volume2, MoreVertical, ArrowLeft, X, Edit3, Check, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAIResponse } from '../data/chatResponses';

interface ChatMessage {
  id: string;
  timestamp: Date;
  sender: 'user' | 'ai';
  content: string;
  status: 'sending' | 'sent' | 'delivered' | 'error';
  type: 'text' | 'audio';
  audioUrl?: string;
  isEditable?: boolean;
  originalContent?: string;
}

interface PronunciationAnalysis {
  accuracy: number;
  intonation: number;
  rhythm: number;
  feedback: string;
  suggestions: string[];
}

interface GrammarCheck {
  isCorrect: boolean;
  errors: Array<{
    type: string;
    message: string;
    suggestion: string;
  }>;
}

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      timestamp: new Date(),
      sender: 'ai',
      content: "Hello! I'm your AI pronunciation tutor. Let's practice English together! You can type messages or use voice messages to practice speaking. What would you like to work on today?",
      status: 'delivered',
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showTranscriptEdit, setShowTranscriptEdit] = useState(false);
  const [transcriptMessages, setTranscriptMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTypingMessage]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('aiChatHistory');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(prev => [...prev, ...parsedMessages]);
    }
  }, []);

  const saveToLocalStorage = (newMessages: ChatMessage[]) => {
    localStorage.setItem('aiChatHistory', JSON.stringify(newMessages.slice(1))); // Don't save welcome message
  };

  const typewriterEffect = (text: string, messageId: string) => {
    setCurrentTypingMessage('');
    setTypingIndex(0);
    
    typingIntervalRef.current = setInterval(() => {
      setTypingIndex(prevIndex => {
        if (prevIndex >= text.length) {
          // Typing complete
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, content: text } : msg
          ));
          setCurrentTypingMessage('');
          setIsTyping(false);
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
          return prevIndex;
        }
        
        const newText = text.substring(0, prevIndex + 1);
        setCurrentTypingMessage(newText);
        return prevIndex + 1;
      });
    }, 50); // 50ms per character
  };

  const generateAIResponse = (userMessage: string): string => {
    return getAIResponse(userMessage);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sender: 'user',
      content: inputMessage,
      status: 'sending',
      type: 'text',
      isEditable: true,
      originalContent: inputMessage
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
      ));
    }, 500);

    // Simulate AI response with typewriter effect
    setTimeout(() => {
      const responseText = generateAIResponse(inputMessage);
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        sender: 'ai',
        content: '', // Will be filled by typewriter effect
        status: 'delivered',
        type: 'text'
      };

      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);
      
      // Start typewriter effect
      typewriterEffect(responseText, aiResponse.id);
      
      saveToLocalStorage(updatedMessages);
    }, 1500);
  };

  const handleEndConversation = () => {
    const userMessages = messages.filter(msg => msg.sender === 'user');
    setTranscriptMessages(userMessages);
    setShowTranscriptEdit(true);
  };

  const handleSubmitTranscript = () => {
    setShowTranscriptEdit(false);
    setShowReview(true);
  };

  const handleEditTranscriptMessage = (messageId: string, newContent: string) => {
    setTranscriptMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: editContent } : msg
    ));
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const generatePronunciationAnalysis = (message: string): PronunciationAnalysis => {
    // Mock pronunciation analysis
    const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
    const intonation = Math.floor(Math.random() * 25) + 75; // 75-100%
    const rhythm = Math.floor(Math.random() * 20) + 80; // 80-100%
    
    return {
      accuracy,
      intonation,
      rhythm,
      feedback: accuracy > 85 ? "Excellent pronunciation! Your clarity is very good." : 
                accuracy > 70 ? "Good pronunciation with room for improvement." : 
                "Focus on clearer articulation and slower speech.",
      suggestions: [
        "Practice vowel sounds more clearly",
        "Work on word stress patterns",
        "Slow down for better clarity"
      ]
    };
  };

  const generateGrammarCheck = (message: string): GrammarCheck => {
    // Mock grammar check
    const hasErrors = Math.random() > 0.7;
    
    return {
      isCorrect: !hasErrors,
      errors: hasErrors ? [
        {
          type: "Subject-verb agreement",
          message: "The verb doesn't match the subject",
          suggestion: "Use 'is' instead of 'are' with singular subjects"
        }
      ] : []
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const isEditing = editingMessageId === message.id;
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
        <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-2">
                <Volume2 size={16} className="text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">AI Tutor</span>
            </div>
          )}
          
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm relative group ${
              isUser
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
            }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-white text-gray-800 border border-gray-300 rounded"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(message.id)}
                    className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed">{message.content}</p>
                {isUser && message.isEditable && !showReview && (
                  <button
                    onClick={() => handleEditMessage(message.id, message.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white/20 rounded hover:bg-white/30 transition-all"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
              </>
            )}
            
            <div className={`flex items-center justify-between mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              <span className="text-xs">{formatTime(message.timestamp)}</span>
              {isUser && (
                <div className="flex items-center space-x-1">
                  {message.status === 'sending' && (
                    <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />
                  )}
                  {message.status === 'sent' && (
                    <div className="w-2 h-2 bg-blue-200 rounded-full" />
                  )}
                  {message.status === 'delivered' && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-200 rounded-full" />
                      <div className="w-2 h-2 bg-blue-200 rounded-full" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
          <Volume2 size={16} className="text-white" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          {currentTypingMessage ? (
            <p className="text-sm text-gray-800">{currentTypingMessage}<span className="animate-pulse">|</span></p>
          ) : (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TranscriptEditInterface: React.FC = () => {
    const [editingTranscriptId, setEditingTranscriptId] = useState<string | null>(null);
    const [editTranscriptContent, setEditTranscriptContent] = useState('');

    const handleStartEdit = (messageId: string, content: string) => {
      setEditingTranscriptId(messageId);
      setEditTranscriptContent(content);
    };

    const handleSaveTranscriptEdit = (messageId: string) => {
      handleEditTranscriptMessage(messageId, editTranscriptContent);
      setEditingTranscriptId(null);
      setEditTranscriptContent('');
    };

    const handleCancelTranscriptEdit = () => {
      setEditingTranscriptId(null);
      setEditTranscriptContent('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Review Your Messages</h2>
              <button
                onClick={() => setShowTranscriptEdit(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Please review and edit your messages if needed. Click on any message to correct speech recognition errors.
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {transcriptMessages.map((message, index) => (
              <div key={message.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      {index + 1}
                    </div>
                    Message {index + 1}
                  </h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors">
                      <Play size={14} />
                      <span>Play</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm hover:bg-green-200 transition-colors">
                      <RotateCcw size={14} />
                      <span>Re-record</span>
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message:</label>
                  {editingTranscriptId === message.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editTranscriptContent}
                        onChange={(e) => setEditTranscriptContent(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveTranscriptEdit(message.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                        >
                          <Check size={16} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelTranscriptEdit}
                          className="flex items-center space-x-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleStartEdit(message.id, message.content)}
                      className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 flex-1">{message.content}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                          <Edit3 size={16} className="text-blue-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span>Sent at {formatTime(message.timestamp)}</span>
                  <span className="text-blue-600">Click to edit if needed</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">💡 Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Click on any message to edit speech recognition errors</li>
                  <li>• Make sure your messages are exactly what you intended to say</li>
                  <li>• This will help provide more accurate pronunciation feedback</li>
                </ul>
              </div>
              <button
                onClick={handleSubmitTranscript}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105"
              >
                Submit & Continue to Review
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReviewInterface: React.FC = () => {
    const userMessages = transcriptMessages.length > 0 ? transcriptMessages : messages.filter(msg => msg.sender === 'user');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Conversation Review</h2>
              <button
                onClick={() => setShowReview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mt-2">Review and improve your pronunciation and grammar</p>
          </div>
          
          <div className="p-6 space-y-6">
            {userMessages.map((message, index) => {
              const analysis = generatePronunciationAnalysis(message.content);
              const grammar = generateGrammarCheck(message.content);
              
              return (
                <div key={message.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Message {index + 1}</h3>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors">
                        <Play size={14} />
                        <span>Play</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm hover:bg-green-200 transition-colors">
                        <RotateCcw size={14} />
                        <span>Re-record</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Original Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Message:</label>
                    <div className="bg-white p-3 rounded-xl border border-gray-200">
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  </div>
                  
                  {/* Pronunciation Analysis */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Pronunciation Analysis</h4>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${analysis.accuracy > 85 ? 'text-green-500' : analysis.accuracy > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {analysis.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${analysis.intonation > 85 ? 'text-green-500' : analysis.intonation > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {analysis.intonation}%
                        </div>
                        <div className="text-sm text-gray-600">Intonation</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${analysis.rhythm > 85 ? 'text-green-500' : analysis.rhythm > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {analysis.rhythm}%
                        </div>
                        <div className="text-sm text-gray-600">Rhythm</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <p className="text-sm text-blue-800">{analysis.feedback}</p>
                    </div>
                  </div>
                  
                  {/* Grammar Check */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Grammar Check</h4>
                    {grammar.isCorrect ? (
                      <div className="bg-green-50 p-3 rounded-xl">
                        <p className="text-sm text-green-800">✓ Grammar is correct!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {grammar.errors.map((error, errorIndex) => (
                          <div key={errorIndex} className="bg-red-50 p-3 rounded-xl">
                            <p className="text-sm text-red-800 font-medium">{error.type}</p>
                            <p className="text-sm text-red-700">{error.message}</p>
                            <p className="text-sm text-red-600 mt-1">💡 {error.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Improvement Suggestions</h4>
                    <div className="space-y-2">
                      {analysis.suggestions.map((suggestion, suggestionIndex) => (
                        <div key={suggestionIndex} className="bg-yellow-50 p-2 rounded-lg">
                          <p className="text-sm text-yellow-800">• {suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                setShowReview(false);
                setMessages([messages[0]]); // Keep only welcome message
                localStorage.removeItem('aiChatHistory');
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all"
            >
              Start New Conversation
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                <Volume2 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">AI Pronunciation Tutor</h1>
                <p className="text-sm text-green-500">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEndConversation}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
              >
                End Conversation
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message to practice..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 transition-all"
                  disabled={isTyping}
                />
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Mic size={18} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setInputMessage("Help me with pronunciation")}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                Need help with pronunciation
              </button>
              <button
                onClick={() => setInputMessage("Let's practice a conversation")}
                className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors"
              >
                Practice conversation
              </button>
              <button
                onClick={() => setInputMessage("Correct my pronunciation")}
                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors"
              >
                Correct my pronunciation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Interface Modal */}
      {showReview && <ReviewInterface />}
      
      {/* Transcript Edit Interface Modal */}
      {showTranscriptEdit && <TranscriptEditInterface />}
    </>
  );
};

export default AIChat;