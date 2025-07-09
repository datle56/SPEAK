import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNavigation from './components/BottomNavigation';
import Homepage from './pages/Homepage';
import LessonMap from './pages/LessonMap';
import LessonDetail from './pages/LessonDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AIChat from './pages/AIChat';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path="/lessons" element={
          <ProtectedRoute>
            <LessonMap />
          </ProtectedRoute>
        } />
        <Route path="/lesson/:id" element={
          <ProtectedRoute>
            <LessonDetail />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        } />
      </Routes>
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;