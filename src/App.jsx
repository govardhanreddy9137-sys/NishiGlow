import React, { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StudioDataProvider } from './context/StudioDataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingInstagram from './components/FloatingInstagram';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import LegalPages from './pages/LegalPages';
import AdminDashboard from './pages/AdminDashboard';

const pagePaths = {
  home: '/',
  about: '/about',
  services: '/services',
  portfolio: '/portfolio',
  contact: '/contact',
  admin: '/admin',
  privacy: '/privacy',
  terms: '/terms'
};

const getPageFromPath = (pathname) => {
  const normalizedPath = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  return Object.entries(pagePaths).find(([, path]) => path === normalizedPath)?.[0] || 'home';
};

export default function App() {
  const [activePage, setActivePageState] = useState(() => getPageFromPath(window.location.pathname));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactPrefill, setContactPrefill] = useState(null);

  useEffect(() => {
    const currentPath = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const page = getPageFromPath(currentPath);
    if (!Object.values(pagePaths).includes(currentPath)) {
      window.history.replaceState({}, '', pagePaths[page]);
    }

    const handlePopState = () => {
      setActivePageState(getPageFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActivePage = (page) => {
    const path = pagePaths[page] || pagePaths.home;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setActivePageState(pagePaths[page] ? page : 'home');
  };

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage 
            setActivePage={setActivePage} 
            setSelectedCategory={setSelectedCategory} 
          />
        );
      case 'about':
        return <AboutPage setActivePage={setActivePage} />;
      case 'services':
        return (
          <ServicesPage 
            setActivePage={setActivePage} 
            setContactPrefill={setContactPrefill} 
          />
        );
      case 'portfolio':
        return (
          <PortfolioPage 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
        );
      case 'contact':
        return <ContactPage contactPrefill={contactPrefill} />;
      case 'admin':
        return <AdminDashboard setActivePage={setActivePage} />;
      case 'privacy':
        return <LegalPages type="privacy" setActivePage={setActivePage} />;
      case 'terms':
        return <LegalPages type="terms" setActivePage={setActivePage} />;
      default:
        return (
          <HomePage 
            setActivePage={setActivePage} 
            setSelectedCategory={setSelectedCategory} 
          />
        );
    }
  };

  return (
    <AuthProvider>
      <StudioDataProvider>
        <div className="min-h-screen flex flex-col bg-[#06080f] text-slate-100 selection:bg-purple-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
          
          {/* Top Navigation Bar */}
          <Navbar activePage={activePage} setActivePage={setActivePage} />

          {/* Dynamic Page Content */}
          <main className="flex-grow">
            {renderCurrentPage()}
          </main>

          <FloatingInstagram />

          {/* Google sign-in modal for customer accounts and approved studio admins */}
          <AuthModal onSuccessNavigate={(target) => {
            setActivePage(target);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />

          {/* Website Footer */}
          <Footer setActivePage={setActivePage} />
        </div>
      </StudioDataProvider>
    </AuthProvider>
  );
}
