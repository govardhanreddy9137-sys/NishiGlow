import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApiUrl } from '../authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Regular client user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nishiglow_client_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nishiglow_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authReady, setAuthReady] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // If backend session is available, optionally sync with it; but never wipe client state if backend is offline
    let cancelled = false;

    fetch(authApiUrl('/api/auth/session'), { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) return null;
        const data = await response.json();
        if (!response.ok || !data.success) return null;
        return data.user;
      })
      .then((user) => {
        if (!cancelled && user) {
          if (user.isAdmin) {
            setAdminUser(user);
            localStorage.setItem('nishiglow_admin_user', JSON.stringify(user));
          } else {
            setCurrentUser(user);
            localStorage.setItem('nishiglow_client_user', JSON.stringify(user));
          }
        }
      })
      .catch(() => {
        // Backend server is not running; client authentication continues locally without interruption
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData) => {
    setAdminUser(null);
    setCurrentUser(userData);
    localStorage.removeItem('nishiglow_admin_user');
    localStorage.setItem('nishiglow_client_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const loginAdmin = (adminData) => {
    setCurrentUser(null);
    setAdminUser(adminData);
    localStorage.removeItem('nishiglow_client_user');
    localStorage.setItem('nishiglow_admin_user', JSON.stringify(adminData));
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await fetch(authApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Ignore network errors when logging out locally
    }
    localStorage.removeItem('nishiglow_client_user');
    localStorage.removeItem('nishiglow_admin_user');
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
