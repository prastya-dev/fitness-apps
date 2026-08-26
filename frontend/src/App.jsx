import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';

/**
 * ProtectedRoute — redirect ke /login jika belum autentikasi
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <svg className="animate-spin w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

/**
 * PublicRoute — redirect ke /home jika sudah login
 */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" replace /> : children;
}

function AppRoutes() {
  return (
    <div className="w-full min-h-screen text-slate-100 flex justify-center bg-transparent relative overflow-hidden">
      {/* Mobile Container wrapper */}
      <div className="w-full max-w-md min-h-screen relative flex flex-col shadow-2xl bg-transparent border-x border-white/10 z-10">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login"      element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"   element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/setup/*" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/home/*"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
