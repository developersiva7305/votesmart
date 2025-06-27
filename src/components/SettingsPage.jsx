
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { 
  UserCircle, Lock, ShieldCheck, Bell, Palette, HelpCircle, Cpu, MessageSquare, HeartHandshake, Link as LinkIcon, Leaf, Fingerprint, Archive, BookOpen, FileText, Edit, Key, Brain, BarChart3, DatabaseZap, AlertTriangle
} from 'lucide-react'; // Added new icons
import { APP_VIEWS } from '@/services/appConstants';

import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsSection from '@/components/settings/SettingsSection';
import ChangeEmailDialog from '@/components/settings/dialogs/ChangeEmailDialog';
import CloseAccountDialog from '@/components/settings/dialogs/CloseAccountDialog';
import ChangePasswordDialog from '@/components/settings/dialogs/ChangePasswordDialog';
import ManagePinDialog from '@/components/settings/dialogs/ManagePinDialog';
import LoginHistoryDialog from '@/components/settings/dialogs/LoginHistoryDialog';
import ViewVotesDialog from '@/components/settings/dialogs/ViewVotesDialog';
import ManageSecurityKeysDialog from '@/components/settings/dialogs/ManageSecurityKeysDialog'; 

const availableFonts = [
  { value: "var(--font-family-sans)", label: "Sans Serif (Default)" },
  { value: "var(--font-family-serif)", label: "Serif" },
  { value: "var(--font-family-dyslexic)", label: "Dyslexic Friendly" }, 
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

const fontSizes = [
    { label: "Small", value: "14px" },
    { label: "Medium (Default)", value: "16px" },
    { label: "Large", value: "18px" },
];


const SettingsPage = ({ 
  currentUser, onBack, onUpdateEmail, onUpdatePassword, onUpdatePin, 
  onCloseAccount, onLogout, votes, elections, 
  toggleDarkMode, darkMode, 
  fontStyle, onFontStyleChange,
  fontSize, onFontSizeChange, 
  navigateTo,
  updateUserSetting
}) => {

  const initialSettings = {
    enableEmailNotifications: true,
    enablePushNotifications: false,
    biometricAuthEnabled: false,
    activityLogVisible: true,
    electionAlertsEnabled: true,
    securityKeyEnabled: false, 
    securityKeys: [], 
    requireSecurityKeyForVoting: false, 
    communityHubEnabled: false,
    wellbeingCheckEnabled: false,
    pledgeWallEnabled: false,
    timeCapsuleEnabled: false,
    ecoImpactEnabled: false,
    blockchainAuditEnabled: false,
    voteDNASealEnabled: false,
    aiVoteAssistantEnabled: false, // New
    realTimeAuditDashboardEnabled: false, // New (admin)
    allowAnonymizedDataForResearch: true, // New
    dynamicThreatDetectionEnabled: false, // New (admin)
    fontSize: currentUser?.settings?.fontSize || '16px', 
    fontStyle: currentUser?.settings?.fontStyle || 'var(--font-family-sans)',
  };

  const [settingsData, setSettingsData] = useState(() => {
    const userSettings = currentUser?.settings || {};
    return { ...initialSettings, ...userSettings };
  });
  
  useEffect(() => {
    if (currentUser && currentUser.settings) {
      setSettingsData(prev => ({ ...initialSettings, ...prev, ...currentUser.settings }));
    }
  }, [currentUser]);

  const safeParseFontSize = (fsValue) => {
    if (typeof fsValue === 'string' && fsValue.includes('px')) {
      return parseInt(fsValue.replace('px', ''), 10);
    }
    return typeof fsValue === 'number' ? fsValue : 16; 
  };
  
  const [currentSliderFontSize, setCurrentSliderFontSize] = useState(safeParseFontSize(fontSize));

  useEffect(() => {
    setCurrentSliderFontSize(safeParseFontSize(fontSize));
  }, [fontSize]);


  const handleGenericSettingChange = (key, value) => {
    setSettingsData(prev => ({ ...prev, [key]: value }));
    updateUserSetting(key, value); 
    toast({ title: "Setting Updated", description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}.` });
  };

  const handleCloseAccountConfirm = () => {
    onCloseAccount();
    onLogout();
  };

  const downloadUserData = () => {
    const userVotes = votes.map(vote => {
      const election = elections.find(e => e.id === vote.electionId);
      return {
        electionId: vote.electionId,
        electionTitle: election ? election.title : "Unknown Election",
        voteTimestamp: vote.timestamp,
        voteReceiptConceptual: vote.voteSignature, 
      };
    });
    const dataToDownload = {
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      registrationDate: currentUser.registrationDate || "Not Available",
      votingActivity: userVotes,
      profilePicture: null, 
      settings: currentUser.settings,
      loginHistory: currentUser.loginHistory || [],
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToDownload, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `votesmart_userdata_${currentUser.id}.json`;
    link.click();
    toast({ title: "Data Download Started", description: "Your user data (metadata only) is being downloaded." });
  };
  
  const handleLocalSliderFontSizeChange = (value) => {
    setCurrentSliderFontSize(value[0]);
  };

  const handleSliderFontSizeApplied = () => {
    const selectedSize = fontSizes.find(fs => parseInt(fs.value.replace('px','')) === currentSliderFontSize) || fontSizes.find(fs => fs.value === '16px');
    onFontSizeChange(selectedSize.value); 
    toast({ title: "Font Size Updated", description: `Font size set to ${selectedSize.label} (${selectedSize.value}).` });
  };
  
  const handleSelectFontSizeChange = (value) => { 
    onFontSizeChange(value);
    const selectedLabel = fontSizes.find(fs => fs.value === value)?.label || 'Medium';
    toast({ title: "Font Size Updated", description: `Font size set to ${selectedLabel} (${value}).` });
  };


  const settingSectionsConfig = [
    {
      title: "Account Settings",
      icon: UserCircle,
      options: [
        { label: "Update Profile Information", action: () => navigateTo(APP_VIEWS.PROFILE), icon: Edit },
        { 
          label: "Change Email Address", 
          dialog: <ChangeEmailDialog currentEmail={currentUser.email} onUpdateEmail={onUpdateEmail} />,
          icon: UserCircle,
        },
        { 
          label: "Close Account", 
          variant: "destructive",
          dialog: <CloseAccountDialog onCloseAccountConfirm={handleCloseAccountConfirm} />,
          icon: UserCircle,
        },
      ]
    },
    {
      title: "Login & Security",
      icon: Lock,
      options: [
        { 
          label: "Change Password", 
          dialog: <ChangePasswordDialog onUpdatePassword={onUpdatePassword} />,
          icon: Lock,
        },
        { 
          label: "Manage PIN", 
          dialog: <ManagePinDialog onUpdatePin={onUpdatePin} />,
          icon: Lock,
        },
        { label: "Biometric Authentication", type: "switch", key: "biometricAuthEnabled", info: "Enable/disable biometric login (conceptual).", icon: Fingerprint},
        { 
          label: "Manage Security Keys (WebAuthn)", 
          dialog: <ManageSecurityKeysDialog currentUser={currentUser} updateUserSetting={updateUserSetting} />,
          icon: Key,
        },
        { label: "Enable Security Key (WebAuthn)", type: "switch", key: "securityKeyEnabled", info: "Use hardware security key for login.", icon: Key},
        { label: "Require Security Key for Voting", type: "switch", key: "requireSecurityKeyForVoting", info: "Mandate security key tap for final vote submission.", icon: Key},
        { 
          label: "View Login History", 
          dialog: <LoginHistoryDialog loginHistory={currentUser?.loginHistory} />,
          icon: Lock,
        },
        ...(currentUser.role === 'admin' ? [
          { label: "Enable Dynamic Threat Detection", type: "switch", key: "dynamicThreatDetectionEnabled", info: "AI-powered system to detect unusual voting patterns and alert admins (Admin Only).", icon: AlertTriangle }
        ] : []),
      ]
    },
    {
      title: "Privacy Settings",
      icon: ShieldCheck,
      options: [
        { 
          label: "Manage Data Sharing (View Votes)", 
          dialog: <ViewVotesDialog votes={votes} elections={elections} />,
          icon: ShieldCheck,
        },
        { label: "Download Your Data", action: downloadUserData, icon: ShieldCheck, },
        { label: "Activity Log Visibility", type: "switch", key: "activityLogVisible", info: "Toggle visibility of your activity log in your profile (conceptual).", icon: ShieldCheck},
        { label: "Allow Anonymized Data for Research", type: "switch", key: "allowAnonymizedDataForResearch", info: "Permit use of your anonymized voting metadata for research purposes.", icon: DatabaseZap},
      ]
    },
    {
      title: "Notification Settings",
      icon: Bell,
      options: [
        { label: "Email Notifications", type: "switch", key: "enableEmailNotifications", icon: Bell },
        { label: "Push Notifications (App)", type: "switch", key: "enablePushNotifications", info: "Conceptual in-app push notifications.", icon: Bell },
        { label: "Election Alerts", type: "switch", key: "electionAlertsEnabled", info: "Receive alerts for new elections.", icon: Bell },
      ]
    },
     {
      title: "Appearance",
      icon: Palette,
      options: [
        { label: "Dark Mode", type: "switch", key: "darkMode", action: toggleDarkMode, info: "Toggle dark mode for the app.", icon: Palette},
        { 
          label: "Font Style", 
          type: "select", 
          key: "fontStyle", 
          currentVal: fontStyle, 
          action: onFontStyleChange, 
          options: availableFonts,
          info: "Change the application font.",
          icon: Palette,
        },
        { 
          label: `Font Size`, 
          type: "select", 
          key: "fontSize", 
          currentVal: fontSize || '16px', 
          action: handleSelectFontSizeChange, 
          options: fontSizes,
          info: "Adjust the application font size.",
          icon: Palette,
        },
      ]
    },
    {
      title: "Advanced Features",
      icon: Cpu,
      options: [
        { label: "Enable AI Vote Assistant", type: "switch", key: "aiVoteAssistantEnabled", info: "Get AI-powered explanations for ballot items.", icon: Brain},
        ...(currentUser.role === 'admin' ? [
          { label: "Enable Real-Time Audit Dashboard", type: "switch", key: "realTimeAuditDashboardEnabled", info: "Access a live dashboard of voting activity and anomalies (Admin Only).", icon: BarChart3 }
        ] : []),
        { label: "Community Hub", type: "switch", key: "communityHubEnabled", icon: MessageSquare, info: "Enable interactive community discussions."},
        { label: "Voter Wellbeing Check", type: "switch", key: "wellbeingCheckEnabled", icon: HeartHandshake, info: "Enable pre-vote wellbeing check modal."},
        { label: "Blockchain Pledge Wall", type: "switch", key: "pledgeWallEnabled", icon: LinkIcon, info: "Sign and store pledges on a conceptual blockchain."},
        { label: "Time Capsule Message", type: "switch", key: "timeCapsuleEnabled", icon: Archive, info: "Leave an encrypted message for the future."},
        { label: "Track Your Eco Impact", type: "switch", key: "ecoImpactEnabled", icon: Leaf, info: "See CO2 and paper saved by e-voting."},
        { label: "Blockchain Time Capsule Audit", type: "switch", key: "blockchainAuditEnabled", icon: ShieldCheck, info: "Store vote hashes on a conceptual blockchain for audit."},
        { label: "Vote DNA Seal", type: "switch", key: "voteDNASealEnabled", icon: Fingerprint, info: "Conceptually seal vote with biometric hash & quantum-safe encryption."},
      ].map(opt => ({ ...opt, individual: true })) 
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      options: [
        { label: "FAQ", action: () => navigateTo(APP_VIEWS.FAQ), icon: HelpCircle },
        { label: "Contact Support", action: () => navigateTo(APP_VIEWS.CONTACT), icon: HelpCircle },
        { label: "Terms of Service", action: () => navigateTo(APP_VIEWS.TERMS), icon: FileText },
        { label: "Voter Education", action: () => navigateTo(APP_VIEWS.VOTER_EDUCATION), icon: BookOpen },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-votesmart-gray-extralight dark:bg-darkBackground flex flex-col items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="voting-card card-shadow dark:bg-gray-800 dark:border-gray-700">
          <SettingsHeader onBack={onBack} />
          <CardContent className="p-6 space-y-8 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {settingSectionsConfig.map((section, idx) => (
              <SettingsSection
                key={idx}
                section={section}
                idx={idx}
                darkMode={darkMode}
                settingsData={settingsData}
                fontStyle={fontStyle}
                currentFontSize={currentSliderFontSize} 
                onGenericSettingChange={handleGenericSettingChange}
                onFontStyleChange={onFontStyleChange}
                onLocalFontSizeChange={handleLocalSliderFontSizeChange} 
                onFontSizeApplied={handleSliderFontSizeApplied} 
                onToggleDarkMode={toggleDarkMode}
              />
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
