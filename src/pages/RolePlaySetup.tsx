import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Users, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  aiPersonality: string;
  userRole: string;
  context: string;
}

const RolePlaySetup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario | null>(null);
  const [customScenario, setCustomScenario] = useState({
    aiRole: '',
    aiPersonality: '',
    userRole: '',
    context: ''
  });
  const [isCustomMode, setIsCustomMode] = useState(false);

  const predefinedScenarios: RolePlayScenario[] = [
    {
      id: "customer-service",
      title: "Customer Service Representative",
      description: "AI will act as a helpful customer service agent",
      aiPersonality: "Professional, patient, and solution-oriented",
      userRole: "Customer with a problem or question",
      context: "You're calling customer service about an issue with your order/service"
    },
    {
      id: "language-tutor",
      title: "English Language Tutor",
      description: "AI will act as an encouraging English teacher",
      aiPersonality: "Patient, encouraging, and educational",
      userRole: "English language learner",
      context: "You're having a lesson with your English tutor"
    },
    {
      id: "job-interviewer",
      title: "Job Interviewer",
      description: "AI will conduct a professional job interview",
      aiPersonality: "Professional, inquisitive, and evaluative",
      userRole: "Job candidate",
      context: "You're interviewing for your dream job"
    },
    {
      id: "travel-guide",
      title: "Local Travel Guide",
      description: "AI will act as a knowledgeable local guide",
      aiPersonality: "Friendly, knowledgeable, and enthusiastic",
      userRole: "Tourist",
      context: "You're exploring a new city and need recommendations"
    },
    {
      id: "doctor",
      title: "Medical Doctor",
      description: "AI will act as a caring healthcare provider",
      aiPersonality: "Professional, caring, and thorough",
      userRole: "Patient",
      context: "You're visiting the doctor for a check-up"
    },
    {
      id: "restaurant-server",
      title: "Restaurant Server",
      description: "AI will act as a friendly restaurant server",
      aiPersonality: "Friendly, helpful, and knowledgeable about the menu",
      userRole: "Restaurant customer",
      context: "You're dining at a restaurant and ordering food"
    }
  ];

  const handleStartRolePlay = () => {
    const scenario = isCustomMode ? {
      id: 'custom',
      title: customScenario.aiRole,
      description: `Custom role-play scenario`,
      aiPersonality: customScenario.aiPersonality,
      userRole: customScenario.userRole,
      context: customScenario.context
    } : selectedScenario;

    if (scenario) {
      // Store scenario in localStorage for the chat page
      localStorage.setItem('rolePlayScenario', JSON.stringify(scenario));
      navigate('/chat?mode=roleplay');
    }
  };

  const isFormValid = isCustomMode 
    ? customScenario.aiRole && customScenario.aiPersonality && customScenario.userRole && customScenario.context
    : selectedScenario !== null;

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
            <Users size={32} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold">🎭 Role Play Setup</h1>
              <p className="text-blue-100">Choose your conversation scenario</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Mode Selection */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Setup Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`p-6 rounded-xl border-2 transition-all ${
                !isCustomMode 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <MessageCircle size={32} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Predefined Scenarios</h3>
              <p className="text-sm text-gray-600">Choose from ready-made conversation scenarios</p>
            </button>
            
            <button
              onClick={() => setIsCustomMode(true)}
              className={`p-6 rounded-xl border-2 transition-all ${
                isCustomMode 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <Settings size={32} className="mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Custom Scenario</h3>
              <p className="text-sm text-gray-600">Create your own unique role-play situation</p>
            </button>
          </div>
        </div>

        {/* Predefined Scenarios */}
        {!isCustomMode && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Scenario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedScenario?.id === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-blue-600">AI Role:</span>
                      <span className="text-gray-600 ml-1">{scenario.aiPersonality}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Your Role:</span>
                      <span className="text-gray-600 ml-1">{scenario.userRole}</span>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">Context:</span>
                      <span className="text-gray-600 ml-1">{scenario.context}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Scenario Form */}
        {isCustomMode && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Custom Scenario</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Role/Character
                </label>
                <input
                  type="text"
                  value={customScenario.aiRole}
                  onChange={(e) => setCustomScenario({...customScenario, aiRole: e.target.value})}
                  placeholder="e.g., Friendly shopkeeper, Strict teacher, Helpful librarian..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Personality & Traits
                </label>
                <textarea
                  value={customScenario.aiPersonality}
                  onChange={(e) => setCustomScenario({...customScenario, aiPersonality: e.target.value})}
                  placeholder="Describe how the AI should behave: patient, enthusiastic, formal, casual, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  value={customScenario.userRole}
                  onChange={(e) => setCustomScenario({...customScenario, userRole: e.target.value})}
                  placeholder="e.g., Customer, Student, Tourist, Job applicant..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation/Context
                </label>
                <textarea
                  value={customScenario.context}
                  onChange={(e) => setCustomScenario({...customScenario, context: e.target.value})}
                  placeholder="Describe the situation: where you are, what's happening, what you want to achieve..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview & Start */}
        {(selectedScenario || (isCustomMode && isFormValid)) && (
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scenario Preview</h2>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">🤖 AI Character</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Role:</strong> {isCustomMode ? customScenario.aiRole : selectedScenario?.title}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Personality:</strong> {isCustomMode ? customScenario.aiPersonality : selectedScenario?.aiPersonality}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">👤 Your Role</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>You are:</strong> {isCustomMode ? customScenario.userRole : selectedScenario?.userRole}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Situation:</strong> {isCustomMode ? customScenario.context : selectedScenario?.context}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartRolePlay}
                disabled={!isFormValid}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <Play size={20} />
                <span>Start Role Play</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RolePlaySetup;