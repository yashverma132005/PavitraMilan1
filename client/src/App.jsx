import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { FullPageLoader } from './components/common/Loader';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import SearchProfiles from './pages/SearchProfiles/SearchProfiles';
import ProfileCreate from './pages/ProfileCreate/ProfileCreate';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import ProfileDetails from './pages/ProfileDetails/ProfileDetails';
import Interests from './pages/Interests/Interests';
import Matches from './pages/Matches/Matches';
import Settings from './pages/Settings/Settings';
import ReportUser from './pages/ReportUser/ReportUser';
import About from './pages/About/About';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import NotFound from './pages/NotFound/NotFound';

/**
 * Protects a route — redirects unauthenticated users to /login.
 * If authenticated but profile is not complete, redirects to /profile/create.
 */
function ProtectedRoute({ children, allowIncompleteProfile = false }) {
  const { isAuthenticated, isClerkSignedIn, isProfileComplete, loading, error, refreshUser, logout } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!isClerkSignedIn) return <Navigate to="/login" replace />;
  if (!isAuthenticated) {
    return (
      <main className="container section" role="alert" style={{ maxWidth: '640px', textAlign: 'center' }}>
        <h1>We couldn’t connect to your account</h1>
        <p className="text-secondary">{error || 'Your Clerk session is active, but the application server did not return your account.'}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={refreshUser}>Retry connection</button>
          <button className="btn btn-outline" onClick={logout}>Sign out</button>
        </div>
      </main>
    );
  }
  if (!allowIncompleteProfile && !isProfileComplete) {
    return <Navigate to="/profile/create" replace />;
  }
  return children;
}

/**
 * Redirect authenticated users away from auth pages (login/register).
 */
function AuthRoute({ children }) {
  const { isAuthenticated, isClerkSignedIn, isProfileComplete, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (isClerkSignedIn) {
    return <Navigate to={isAuthenticated && !isProfileComplete ? '/profile/create' : '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Auth pages — redirect if already logged in */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

      {/* Profile creation — must be authenticated, but profile can be incomplete */}
      <Route path="/profile/create" element={
        <ProtectedRoute allowIncompleteProfile={true}><ProfileCreate /></ProtectedRoute>
      } />

      {/* Protected — require both auth AND complete profile */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchProfiles /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfileDetails /></ProtectedRoute>} />
      <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
      <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/report/:userId" element={<ProtectedRoute><ReportUser /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}
