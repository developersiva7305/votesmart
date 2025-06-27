
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroductionPage from '@/components/IntroductionPage';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import SecurityKeyAuth from '@/components/SecurityKeyAuth'; // New component
import BiometricCheck from '@/components/BiometricCheck';
import PinLock from '@/components/PinLock';
import ContactUsPage from '@/components/ContactUsPage';
import OverseasVoterRegistrationPage from '@/components/OverseasVoterRegistrationPage';
import UserProfilePage from '@/components/UserProfilePage';
import SettingsPage from '@/components/SettingsPage';
import FAQPage from '@/components/FAQPage';
import TermsOfServicePage from '@/components/TermsOfServicePage';
import VotingProceduresPage from '@/components/VotingProceduresPage';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage';

import VoterEducationPortal from '@/components/features/VoterEducationPortal';
import LiveHelpChatbot from '@/components/features/LiveHelpChatbot';
import AccessibilityFeaturesMenu from '@/components/features/AccessibilityFeaturesMenu';
import RealTimeQueueStatus from '@/components/features/RealTimeQueueStatus';
import VoteAuditTrail from '@/components/features/VoteAuditTrail';
import GeoFencingValidator from '@/components/features/GeoFencingValidator';
import BlockchainIntegrationDisplay from '@/components/features/BlockchainIntegrationDisplay';
import CommunityFeedbackReporter from '@/components/features/CommunityFeedbackReporter';
import CommunityHubPage from '@/components/features/CommunityHubPage';
import BlockchainPledgeWallPage from '@/components/features/BlockchainPledgeWallPage';
import TimeCapsuleMessagePage from '@/components/features/TimeCapsuleMessagePage';
import BlockchainTimeCapsuleAuditPage from '@/components/features/BlockchainTimeCapsuleAuditPage';
import WellbeingCheckModal from '@/components/features/WellbeingCheckModal';
import EcoImpactReport from '@/components/features/EcoImpactReport';
import VoteDNASealProcess from '@/components/features/VoteDNASealProcess';


import { Vote } from 'lucide-react';
import { APP_VIEWS, AUTH_STEPS, ADMIN_EMAIL } from '@/services/appConstants.js';

const AppRoutes = ({
  currentView,
  currentUser,
  userRole,
  authStep,
  tempUserFor2FA,
  appUsers,
  elections,
  votes,
  darkMode,
  fontStyle,
  fontSize,
  navigateTo,
  handleGetStarted,
  handleRegister, 
  handleOverseasRegister,
  handleBackToLogin,
  handleBackToDashboard,
  handleBackToIntroduction,
  processLoginAttempt,
  handleSecurityKeyAuthSuccess, // New prop
  handleBiometricSuccess,
  processPinSuccess,
  handleAuthFailure,
  handleLogoutAndRedirect,
  updateUserProfile,
  updateUserEmailWithVerification,
  updateUserPassword,
  updateUserPin,
  deactivateCurrentUserAccount,
  toggleDarkMode,
  handleFontStyleChange,
  handleFontSizeChange,
  updateUserSetting,
  addElection,
  updateElection,
  deleteElection,
  getElectionResults,
  castVote,
}) => {

  const renderAuthContent = () => {
    const showBiometric = tempUserFor2FA?.settings?.biometricAuthEnabled ?? (currentUser?.settings?.biometricAuthEnabled ?? false);

    switch (authStep) {
      case AUTH_STEPS.LOGIN:
        return <LoginPage 
                  onLoginAttempt={processLoginAttempt} 
                  onRegister={handleRegister} 
                  onBack={handleBackToIntroduction} 
                  navigateTo={navigateTo} 
                  adminEmail={ADMIN_EMAIL}
                  showBiometricOption={showBiometric}
                />;
      case AUTH_STEPS.SECURITY_KEY_AUTH: // New case
        return <SecurityKeyAuth key="security-key" onSuccess={handleSecurityKeyAuthSuccess} onFailure={() => handleAuthFailure(false, true)} onBack={handleBackToLogin} userName={tempUserFor2FA?.name} />;
      case AUTH_STEPS.BIOMETRIC:
        return <BiometricCheck key="biometric" onSuccess={handleBiometricSuccess} onFailure={() => handleAuthFailure(false)} onBack={handleBackToLogin} userName={tempUserFor2FA?.name} />;
      case AUTH_STEPS.PIN:
        return <PinLock key="pin" onSuccess={processPinSuccess} onFailure={() => handleAuthFailure(true)} onBack={handleBackToLogin} userName={tempUserFor2FA?.name} correctPin={tempUserFor2FA?.encryptedPin} />;
      default:
        return <LoginPage 
                  onLoginAttempt={processLoginAttempt} 
                  onRegister={handleRegister} 
                  onBack={handleBackToIntroduction} 
                  navigateTo={navigateTo} 
                  adminEmail={ADMIN_EMAIL}
                  showBiometricOption={showBiometric}
                />;
    }
  };

  const commonPageProps = {
    onBack: currentUser ? handleBackToDashboard : handleBackToIntroduction,
    navigateTo: navigateTo,
  };
  
  const userSpecificVotes = currentUser ? votes.filter(v => v.voterId === currentUser.id) : [];

  switch (currentView) {
    case APP_VIEWS.INTRODUCTION:
      return <IntroductionPage key="intro" onGetStarted={handleGetStarted} navigateTo={navigateTo} />;
    case APP_VIEWS.CONTACT:
      return <ContactUsPage key="contact" {...commonPageProps} />;
    case APP_VIEWS.OVERSEAS_REGISTRATION:
      return <OverseasVoterRegistrationPage key="overseas-reg" onRegister={handleOverseasRegister} onBack={handleBackToIntroduction} />;
    case APP_VIEWS.PROFILE:
      if (!currentUser) { navigateTo(APP_VIEWS.INTRODUCTION); return null; }
      return <UserProfilePage key="profile" currentUser={currentUser} onUpdateProfile={updateUserProfile} onBack={handleBackToDashboard} />;
    case APP_VIEWS.SETTINGS:
      if (!currentUser) { navigateTo(APP_VIEWS.INTRODUCTION); return null; }
      return <SettingsPage 
                key="settings" 
                currentUser={currentUser} 
                onBack={handleBackToDashboard} 
                onUpdateEmail={updateUserEmailWithVerification}
                onUpdatePassword={updateUserPassword}
                onUpdatePin={updateUserPin}
                onCloseAccount={deactivateCurrentUserAccount}
                onLogout={handleLogoutAndRedirect}
                votes={userSpecificVotes}
                elections={elections}
                toggleDarkMode={toggleDarkMode}
                darkMode={darkMode}
                fontStyle={fontStyle}
                onFontStyleChange={handleFontStyleChange}
                fontSize={fontSize} 
                onFontSizeChange={handleFontSizeChange}
                navigateTo={navigateTo}
                updateUserSetting={updateUserSetting}
              />;
    case APP_VIEWS.FAQ:
      return <FAQPage key="faq" {...commonPageProps} />;
    case APP_VIEWS.TERMS:
      return <TermsOfServicePage key="terms" {...commonPageProps} />;
    case APP_VIEWS.VOTING_PROCEDURES:
      return <VotingProceduresPage key="procedures" {...commonPageProps} />;
    case APP_VIEWS.PRIVACY_POLICY:
      return <PrivacyPolicyPage key="privacy" {...commonPageProps} />;
    
    case APP_VIEWS.VOTER_EDUCATION: return <VoterEducationPortal key="voter-edu" {...commonPageProps} />;
    case APP_VIEWS.LIVE_CHAT: return <LiveHelpChatbot key="live-chat" {...commonPageProps} />;
    case APP_VIEWS.ACCESSIBILITY: return <AccessibilityFeaturesMenu key="accessibility" {...commonPageProps} />;
    case APP_VIEWS.QUEUE_STATUS: return <RealTimeQueueStatus key="queue-status" {...commonPageProps} />;
    case APP_VIEWS.AUDIT_TRAIL: return <VoteAuditTrail key="audit-trail" {...commonPageProps} />;
    case APP_VIEWS.GEO_VALIDATOR: return <GeoFencingValidator key="geo-validator" {...commonPageProps} />;
    case APP_VIEWS.BLOCKCHAIN_INFO: return <BlockchainIntegrationDisplay key="blockchain" {...commonPageProps} />;
    case APP_VIEWS.COMMUNITY_FEEDBACK: return <CommunityFeedbackReporter key="feedback" {...commonPageProps} />;
    
    case APP_VIEWS.COMMUNITY_HUB: 
      if (!currentUser || !currentUser.settings?.communityHubEnabled) { navigateTo(APP_VIEWS.DASHBOARD); return null; }
      return <CommunityHubPage key="community-hub" {...commonPageProps} currentUser={currentUser} />;
    case APP_VIEWS.PLEDGE_WALL:
      if (!currentUser || !currentUser.settings?.pledgeWallEnabled) { navigateTo(APP_VIEWS.DASHBOARD); return null; }
      return <BlockchainPledgeWallPage key="pledge-wall" {...commonPageProps} currentUser={currentUser} />;
    case APP_VIEWS.TIME_CAPSULE_MESSAGE:
      if (!currentUser || !currentUser.settings?.timeCapsuleEnabled) { navigateTo(APP_VIEWS.DASHBOARD); return null; }
      return <TimeCapsuleMessagePage key="time-capsule" {...commonPageProps} currentUser={currentUser} />;
    case APP_VIEWS.BLOCKCHAIN_TIME_CAPSULE_AUDIT:
      if (!currentUser || !currentUser.settings?.blockchainAuditEnabled) { navigateTo(APP_VIEWS.DASHBOARD); return null; }
      return <BlockchainTimeCapsuleAuditPage key="bc-audit" {...commonPageProps} currentUser={currentUser} />;

    case APP_VIEWS.AUTHENTICATION:
      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4 dark:bg-gray-900">
          <motion.div
            key="auth-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-8">
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Vote className="h-12 w-12 text-white mr-3 animate-float" />
                <h1 className="text-5xl font-bold text-white">VoteSmart</h1>
              </motion.div>
               <motion.p
                className="text-lg text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Secure, Transparent, and Intelligent E-Voting
              </motion.p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={authStep}
                initial={{ opacity: 0, x: authStep === AUTH_STEPS.LOGIN ? 0 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderAuthContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      );
    case APP_VIEWS.DASHBOARD:
      if (!currentUser) {
        navigateTo(APP_VIEWS.INTRODUCTION);
        return <IntroductionPage key="fallback-intro" onGetStarted={handleGetStarted} navigateTo={navigateTo} />;
      }
      if (userRole === 'admin') {
        return (
          <AdminDashboard
            key="admin"
            currentUser={currentUser}
            elections={elections}
            votes={votes}
            appUsers={appUsers}
            onLogout={handleLogoutAndRedirect}
            onAddElection={addElection}
            onUpdateElection={updateElection}
            onDeleteElection={deleteElection}
            getElectionResults={getElectionResults}
            navigateTo={navigateTo}
          />
        );
      } else {
        return (
          <UserDashboard
            key="user"
            currentUser={currentUser}
            elections={elections}
            votes={votes}
            onLogout={handleLogoutAndRedirect}
            onCastVote={castVote}
            getElectionResults={getElectionResults}
            navigateTo={navigateTo}
            WellbeingCheckModal={currentUser.settings?.wellbeingCheckEnabled ? WellbeingCheckModal : null}
            EcoImpactReport={currentUser.settings?.ecoImpactEnabled ? EcoImpactReport : null}
            VoteDNASealProcess={currentUser.settings?.voteDNASealEnabled ? VoteDNASealProcess : null}
          />
        );
      }
    default:
      return <IntroductionPage key="default-intro" onGetStarted={handleGetStarted} navigateTo={navigateTo} />;
  }
};

export default AppRoutes;
