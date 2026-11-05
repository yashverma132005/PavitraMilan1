import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import api, { setAuthTokenGetter } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useClerkAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch the local user from our backend.
   * The backend auto-creates a local DB user on first Clerk auth call.
   */
  const fetchLocalUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setLocalUser(res.data.data);
      setError(null);
      return res.data.data;
    } catch (err) {
      console.error('Failed to sync user with backend:', err);
      setError(err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED'
        ? 'Cannot reach the HaihayaMilan API. Start the server and check VITE_API_URL.'
        : err.response?.data?.message || 'Could not load your account from the server.');
      setLocalUser(null);
      return null;
    }
  }, []);

  /**
   * Once Clerk is loaded and the user is signed in, sync them with
   * our backend (which auto-creates the local DB record if needed).
   */
  useEffect(() => {
    const syncUser = async () => {
      if (!clerkLoaded) return;

      if (!isSignedIn) {
        setLocalUser(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchLocalUser();
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [clerkLoaded, isSignedIn, clerkUser?.id, fetchLocalUser]);

  /**
   * Re-fetch the user from backend.
   * Call this after profile creation to update isProfileComplete.
   */
  const refreshUser = useCallback(async () => {
    if (isSignedIn) {
      setLoading(true);
      try {
        return await fetchLocalUser();
      } finally {
        setLoading(false);
      }
    }
    return null;
  }, [isSignedIn, fetchLocalUser]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setLocalUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, [signOut]);

  const updateUser = useCallback((data) => {
    setLocalUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticated = clerkLoaded && isSignedIn && !!localUser;
  const isProfileComplete = localUser?.isProfileComplete ?? false;

  return (
    <AuthContext.Provider value={{
      user: localUser,
      clerkUser,
      loading: !clerkLoaded || loading,
      isClerkSignedIn: clerkLoaded && !!isSignedIn,
      isAuthenticated,
      isProfileComplete,
      error,
      logout,
      updateUser,
      refreshUser,
      clearError,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

