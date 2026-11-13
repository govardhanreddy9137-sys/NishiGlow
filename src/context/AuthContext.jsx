import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApiUrl } from '../authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Regular client user
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      localStorage.removeItem('nishiglow_user');
      localStorage.removeItem('nishiglow_admin');
    } catch (error) {
      console.error('[Auth] Could not clear the legacy local sign-in state:', error);
    }

    fetch(authApiUrl('/api/auth/session'), { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) return null;
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Could not restore the sign-in session.');
        }
        return data.user;
      })
      .then((user) => {
        if (!cancelled && user) {
          if (user.isAdmin) setAdminUser(user);
          else setCurrentUser(user);
        }
      })
      .catch((error) => {
        console.error('[Auth] Could not restore the sign-in session:', error);
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthModalOpen(false);
  };

  const loginAdmin = (adminData) => {
    setAdminUser(adminData);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      const response = await fetch(authApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('The server could not end the sign-in session.');
      }
    } catch (error) {
      console.error('[Auth] Could not end the sign-in session:', error);
    }
    setCurrentUser(null);
    setAdminUser(null);
  };

  const logoutAdmin = logout;

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authReady,
        login,
        logout,
        adminUser,
        isAdmin: !!adminUser,
        loginAdmin,
        logoutAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
