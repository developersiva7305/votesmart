
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import AppRoutes from '@/components/app/AppRoutes';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';
import { useElections } from '@/hooks/useElections.js';
import { useVotes } from '@/hooks/useVotes.js';
import { APP_VIEWS, AUTH_STEPS } from '@/services/appConstants.js';

function App() {
  const authHook = useAuth();
  const { elections, addElection, updateElection, deleteElection, getElectionResults } = useElections(
    localStorage.getItem('votesmart_elections') ? JSON.parse(localStorage.getItem('votesmart_elections')) : [],
    localStorage.getItem('votesmart_votes') ? JSON.parse(localStorage.getItem('votesmart_votes')) : []
  );
  const { votes, castVote } = useVotes(
    localStorage.getItem('votesmart_votes') ? JSON.parse(localStorage.getItem('votesmart_votes')) : [],
    authHook.currentUser,
    elections
  );
  
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem('votesmart_current_view');
    if (authHook.currentUser && (savedView === APP_VIEWS.AUTHENTICATION || savedView === APP_VIEWS.INTRODUCTION)) {
      return APP_VIEWS.DASHBOARD;
    }
    return savedView || APP_VIEWS.INTRODUCTION;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('votesmart_dark_mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [fontStyle, setFontStyle] = useState(() => {
    return localStorage.getItem('votesmart_font_style') || 'var(--font-family-sans)';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('votesmart_font_size') || '16px'; // Default 'Medium'
  });

  useEffect(() => {
    localStorage.setItem('votesmart_current_view', currentView);
    if (authHook.currentUser) {
      localStorage.setItem('votesmart_current_user', JSON.stringify(authHook.currentUser));
      localStorage.setItem('votesmart_auth_step', authHook.authStep);
    } else {
      localStorage.removeItem('votesmart_current_user');
      if (currentView !== APP_VIEWS.AUTHENTICATION) {
        localStorage.removeItem('votesmart_auth_step');
      }
    }
  }, [authHook.currentUser, currentView, authHook.authStep]);

  useEffect(() => {
    if (authHook.currentUser && authHook.currentUser.settings) {
      setDarkMode(authHook.currentUser.settings.darkMode ?? false);
      setFontStyle(authHook.currentUser.settings.fontStyle || 'var(--font-family-sans)');
      setFontSize(authHook.currentUser.settings.fontSize || '16px');
    } else {
      // Fallback to localStorage if no user or settings
      setDarkMode(JSON.parse(localStorage.getItem('votesmart_dark_mode') || 'false'));
      setFontStyle(localStorage.getItem('votesmart_font_style') || 'var(--font-family-sans)');
      setFontSize(localStorage.getItem('votesmart_font_size') || '16px');
    }
  }, [authHook.currentUser]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('votesmart_dark_mode', JSON.stringify(darkMode));
    if(authHook.currentUser) authHook.updateUserSetting('darkMode', darkMode);
  }, [darkMode, authHook.updateUserSetting, authHook.currentUser]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-family', fontStyle);
    localStorage.setItem('votesmart_font_style', fontStyle);
    if(authHook.currentUser) authHook.updateUserSetting('fontStyle', fontStyle);
  }, [fontStyle, authHook.updateUserSetting, authHook.currentUser]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', fontSize);
    localStorage.setItem('votesmart_font_size', fontSize);
    if(authHook.currentUser) authHook.updateUserSetting('fontSize', fontSize);
  }, [fontSize, authHook.updateUserSetting, authHook.currentUser]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  const handleFontStyleChange = useCallback((newFont) => {
    setFontStyle(newFont);
  }, [setFontStyle]);

  const handleFontSizeChange = useCallback((newSize) => { // newSize is '14px', '16px', '18px'
    setFontSize(newSize);
  }, [setFontSize]);
  
  const nonAuthProtectedViews = [
    APP_VIEWS.INTRODUCTION, APP_VIEWS.AUTHENTICATION, APP_VIEWS.CONTACT, 
    APP_VIEWS.OVERSEAS_REGISTRATION, APP_VIEWS.FAQ, APP_VIEWS.TERMS, 
    APP_VIEWS.VOTING_PROCEDURES, APP_VIEWS.PRIVACY_POLICY
  ];

  useEffect(() => {
    const isAuthProtectedView = !nonAuthProtectedViews.includes(currentView);
    if (authHook.currentUser && currentView === APP_VIEWS.AUTHENTICATION) {
      setCurrentView(APP_VIEWS.DASHBOARD);
    } else if (!authHook.currentUser && isAuthProtectedView) {
      setCurrentView(APP_VIEWS.INTRODUCTION);
      authHook.setAuthStep(AUTH_STEPS.LOGIN);
    }
  }, [authHook.currentUser, currentView, authHook.setAuthStep, nonAuthProtectedViews]);

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  const handleGetStarted = () => {
    navigateTo(APP_VIEWS.AUTHENTICATION);
    authHook.setAuthStep(AUTH_STEPS.LOGIN);
  };
  
  const handleOverseasRegister = (userData) => {
    const registeredUser = authHook.handleRegister(userData);
    if(registeredUser){
      toast({
        title: "Overseas Registration Success! 🌍",
        description: "Your registration is complete. Please login.",
      });
      navigateTo(APP_VIEWS.AUTHENTICATION);
      authHook.setAuthStep(AUTH_STEPS.LOGIN);
    }
  };
  
  const handleBackToLogin = () => {
    authHook.setAuthStep(AUTH_STEPS.LOGIN);
    authHook.setTempUserFor2FA(null);
    navigateTo(APP_VIEWS.AUTHENTICATION);
  };

  const handleBackToDashboard = () => {
    navigateTo(APP_VIEWS.DASHBOARD);
  };

  const handleBackToIntroduction = () => {
    navigateTo(APP_VIEWS.INTRODUCTION);
  };

  const processLoginAttempt = async (loginData) => {
    const result = await authHook.handleLoginAttempt(loginData);
    if (result.success) {
        authHook.setTempUserFor2FA(result.user);
        if (result.nextStep) {
            authHook.setAuthStep(result.nextStep);
            toast({ title: result.toast.title, description: result.toast.description });
        } else {
            authHook.setCurrentUser(result.user);
            authHook.setUserRole(result.user.role);
            if (result.user.settings) {
              setDarkMode(result.user.settings.darkMode ?? false);
              setFontStyle(result.user.settings.fontStyle || 'var(--font-family-sans)');
              setFontSize(result.user.settings.fontSize || '16px');
            }
            navigateTo(APP_VIEWS.DASHBOARD);
            toast({ title: `Welcome to VoteSmart, ${result.user.name}! 🎉`, description: result.user.role === 'admin' ? "Admin Logged In Successfully." : "Logged in as Voter." });
        }
    } else {
        toast({ title: result.toast.title, description: result.toast.description, variant: "destructive" });
    }
  };

  const processPinSuccess = async () => {
      const result = await authHook.handlePinSuccess();
      if(result.success) {
        authHook.setCurrentUser(result.user);
        authHook.setUserRole(result.user.role);
        if (result.user.settings) {
          setDarkMode(result.user.settings.darkMode ?? false);
          setFontStyle(result.user.settings.fontStyle || 'var(--font-family-sans)');
          setFontSize(result.user.settings.fontSize || '16px');
        }
        navigateTo(APP_VIEWS.DASHBOARD);
        toast({ title: `Welcome to VoteSmart, ${result.user.name}! 🎉`, description: result.user.role === 'admin' ? "Admin Logged In Successfully." : "Logged in as Voter." });
        authHook.setAuthStep(AUTH_STEPS.LOGIN); 
      } else {
         toast({ title: "Authentication Failed", description:"Incorrect PIN. Please try again.", variant: "destructive"});
      }
  };

  const handleLogoutAndRedirect = () => {
    authHook.handleLogout();
    navigateTo(APP_VIEWS.AUTHENTICATION);
    authHook.setAuthStep(AUTH_STEPS.LOGIN);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col`}>
      <AnimatePresence mode="wait">
        <AppRoutes
          currentView={currentView}
          currentUser={authHook.currentUser}
          userRole={authHook.userRole}
          authStep={authHook.authStep}
          tempUserFor2FA={authHook.tempUserFor2FA}
          appUsers={authHook.appUsers}
          elections={elections}
          votes={votes}
          darkMode={darkMode}
          fontStyle={fontStyle}
          fontSize={fontSize}
          navigateTo={navigateTo}
          handleGetStarted={handleGetStarted}
          handleRegister={authHook.handleRegister} 
          handleOverseasRegister={handleOverseasRegister}
          handleBackToLogin={handleBackToLogin}
          handleBackToDashboard={handleBackToDashboard}
          handleBackToIntroduction={handleBackToIntroduction}
          processLoginAttempt={processLoginAttempt}
          handleSecurityKeyAuthSuccess={authHook.handleSecurityKeyAuthSuccess} // Pass new handler
          handleBiometricSuccess={authHook.handleBiometricSuccess}
          processPinSuccess={processPinSuccess}
          handleAuthFailure={authHook.handleAuthFailure}
          handleLogoutAndRedirect={handleLogoutAndRedirect}
          updateUserProfile={authHook.updateUserProfile}
          updateUserEmailWithVerification={authHook.updateUserEmailWithVerification}
          updateUserPassword={authHook.updateUserPassword}
          updateUserPin={authHook.updateUserPin}
          deactivateCurrentUserAccount={authHook.deactivateCurrentUserAccount}
          toggleDarkMode={toggleDarkMode}
          handleFontStyleChange={handleFontStyleChange}
          handleFontSizeChange={handleFontSizeChange}
          updateUserSetting={authHook.updateUserSetting}
          addElection={addElection}
          updateElection={updateElection}
          deleteElection={deleteElection}
          getElectionResults={getElectionResults}
          castVote={castVote}
        />
      </AnimatePresence>
      <Toaster />
      <AnimatePresence>
        {currentView !== APP_VIEWS.INTRODUCTION && 
         currentView !== APP_VIEWS.CONTACT && 
         currentView !== APP_VIEWS.OVERSEAS_REGISTRATION && 
         !authHook.currentUser && (
          <motion.button
            key="global-back-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleBackToIntroduction}
            className="fixed bottom-4 left-4 bg-card/80 text-card-foreground dark:bg-card/80 dark:text-card-foreground backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-card/95 dark:hover:bg-card/95 transition-colors z-50"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
      {currentView !== APP_VIEWS.INTRODUCTION && currentView !== APP_VIEWS.AUTHENTICATION && <Footer navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
