
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AUTH_STEPS, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PIN } from '@/services/appConstants.js';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('votesmart_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('votesmart_current_user');
    return savedUser ? JSON.parse(savedUser).role : null;
  });
  const [tempUserFor2FA, setTempUserFor2FA] = useState(null);
  const [authStep, setAuthStep] = useState(() => {
    return localStorage.getItem('votesmart_auth_step') || AUTH_STEPS.LOGIN;
  });
   const [appUsers, setAppUsers] = useState(() => {
    const users = {};
    if (typeof window !== 'undefined' && window.localStorage) {
        if (!localStorage.getItem(`user_${ADMIN_EMAIL}`)) {
          const adminData = {
            id: 'admin_siva', 
            name: 'Siva (Admin)', 
            email: ADMIN_EMAIL, 
            password: ADMIN_PASSWORD, 
            role: 'admin', 
            encryptedPin: ADMIN_PIN, 
            profilePicture: null, 
            settings: { 
              biometricAuthEnabled: false, 
              darkMode: localStorage.getItem('votesmart_dark_mode') ? JSON.parse(localStorage.getItem('votesmart_dark_mode')) : false,
              fontStyle: 'var(--font-family-sans)',
              fontSize: '16px',
              securityKeyEnabled: false,
              securityKeys: [],
              requireSecurityKeyForVoting: false,
              aiVoteAssistantEnabled: true,
              realTimeAuditDashboardEnabled: true,
              allowAnonymizedDataForResearch: true,
              dynamicThreatDetectionEnabled: true,
            }, 
            loginHistory: [],
            registrationDate: new Date().toISOString(),
          };
          localStorage.setItem(`user_${ADMIN_EMAIL}`, JSON.stringify(adminData));
        }

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('user_')) {
                users[key] = JSON.parse(localStorage.getItem(key));
            }
        }
    }
    return users;
  });


  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('votesmart_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('votesmart_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('votesmart_auth_step', authStep);
  }, [authStep]);

  const handleRegister = useCallback((userData) => {
    if (userData.email === ADMIN_EMAIL) {
      toast({
        title: "Registration Failed",
        description: "This email is reserved for admin use.",
        variant: "destructive",
      });
      return null;
    }
    const newUser = {
      ...userData, 
      id: `user_${Date.now()}`,
      role: 'user',
      biometricHash: userData.useBiometrics ? `bio_${Date.now()}` : null,
      encryptedPin: userData.pin, 
      publicKey: `pubkey_${Date.now()}_${userData.email.substring(0, 5)}`,
      privateKeyPlaceholder: `conceptual_private_key_for_${userData.email.substring(0,5)}`, 
      profilePicture: userData.profilePicture || null,
      settings: { 
        enableEmailNotifications: true,
        enablePushNotifications: false,
        biometricAuthEnabled: userData.useBiometrics,
        activityLogVisible: true,
        electionAlertsEnabled: true,
        darkMode: false, 
        fontStyle: 'var(--font-family-sans)',
        fontSize: '16px',
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
        aiVoteAssistantEnabled: true, // Default for new users
        realTimeAuditDashboardEnabled: false, // Default for new users (admin only feature anyway)
        allowAnonymizedDataForResearch: true, // Default for new users
        dynamicThreatDetectionEnabled: false, // Default for new users (admin only feature anyway)
      },
      loginHistory: [{ timestamp: new Date().toISOString(), event: "Account Registered" }],
      registrationDate: new Date().toISOString(),
    };
    localStorage.setItem(`user_${newUser.email}`, JSON.stringify(newUser));
     setAppUsers(prev => ({...prev, [`user_${newUser.email}`]: newUser}));
    toast({
      title: "Registration Successful! 🗳️",
      description: "Please proceed to login with your new credentials.",
    });
    return newUser;
  }, [setAppUsers]);

  const recordLoginEvent = (userEmail) => {
    const userKey = `user_${userEmail}`;
    const storedUser = JSON.parse(localStorage.getItem(userKey));
    if (storedUser) {
      const updatedHistory = [...(storedUser.loginHistory || []), { timestamp: new Date().toISOString(), event: "Logged In" }];
      localStorage.setItem(userKey, JSON.stringify({ ...storedUser, loginHistory: updatedHistory.slice(-10) })); 
      setAppUsers(prev => ({...prev, [userKey]: {...storedUser, loginHistory: updatedHistory.slice(-10)}}));
    }
  };

  const handleLoginAttempt = useCallback(async (loginData) => {
    const userKey = `user_${loginData.email}`;
    const storedUserJSON = localStorage.getItem(userKey);
    let userToProcess = null;
    let isPasswordCorrect = false;

    if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        userToProcess = storedUserJSON ? JSON.parse(storedUserJSON) : null; 
        if (userToProcess) isPasswordCorrect = true;
    } else if (storedUserJSON) {
        const regularUser = JSON.parse(storedUserJSON);
        if (regularUser.password === loginData.password) {
            userToProcess = regularUser;
            isPasswordCorrect = true;
        }
    }

    if (userToProcess && isPasswordCorrect) {
        recordLoginEvent(userToProcess.email);
        let nextStep = AUTH_STEPS.PIN; 
        let toastDescription = "Please enter your PIN.";

        if (userToProcess.settings?.securityKeyEnabled && userToProcess.settings?.securityKeys?.length > 0) {
            nextStep = AUTH_STEPS.SECURITY_KEY_AUTH;
            toastDescription = "Please use your Security Key.";
        } else if (userToProcess.settings?.biometricAuthEnabled && userToProcess.biometricHash) {
            nextStep = AUTH_STEPS.BIOMETRIC;
            toastDescription = "Please verify your identity with biometrics.";
        }
        
        return { 
            success: true, 
            user: userToProcess, 
            nextStep: nextStep,
            toast: { title: "Login Step 1 Complete", description: toastDescription}
        };
    }

    return { 
        success: false, 
        toast: { title: "Login Failed", description: storedUserJSON ? "Invalid email or password." : "User not found."}
    };
  }, [setAppUsers]);


  const handleSecurityKeyAuthSuccess = useCallback(() => {
    if (tempUserFor2FA?.settings?.biometricAuthEnabled && tempUserFor2FA?.biometricHash) {
      setAuthStep(AUTH_STEPS.BIOMETRIC);
      toast({ title: "Security Key Approved! 🔑", description: "Please complete Biometric scan." });
    } else {
      setAuthStep(AUTH_STEPS.PIN);
      toast({ title: "Security Key Approved! 🔑", description: "Please complete PIN entry." });
    }
  }, [tempUserFor2FA, setAuthStep]);


  const handleBiometricSuccess = useCallback(() => {
    setAuthStep(AUTH_STEPS.PIN);
    toast({ title: "Biometric Scan Approved! 👍", description: "Please complete PIN entry." });
  }, [setAuthStep]);

  const handlePinSuccess = useCallback(async () => {
    if (tempUserFor2FA) {
        return { success: true, user: tempUserFor2FA };
    }
    return { success: false };
  }, [tempUserFor2FA]);

  const handleAuthFailure = useCallback((isPinFailure = false, isSecurityKeyFailure = false) => {
    setTempUserFor2FA(null);
    if (isSecurityKeyFailure) {
        setAuthStep(AUTH_STEPS.LOGIN); 
        toast({ title: "Security Key Authentication Failed", description: "Please try logging in again.", variant: "destructive" });
    } else if (!isPinFailure) { 
      setAuthStep(AUTH_STEPS.LOGIN);
      toast({ title: "Authentication Failed", description:"Please try logging in again.", variant: "destructive" });
    } else {
       toast({ title: "Authentication Failed", description: "Incorrect PIN. Please try again.", variant: "destructive" });
    }
  }, [setAuthStep, setTempUserFor2FA]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setUserRole(null);
    setTempUserFor2FA(null);
    setAuthStep(AUTH_STEPS.LOGIN);
    localStorage.removeItem('votesmart_current_user');
    toast({
      title: "Logged out successfully",
      description: "Thank you for using VoteSmart!",
    });
  }, [setCurrentUser, setUserRole, setTempUserFor2FA, setAuthStep]);

  const updateUserProfile = useCallback((updatedData) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(updatedUser));
      setAppUsers(prev => ({...prev, [`user_${currentUser.email}`]: updatedUser}));
      toast({ title: "Profile Updated", description: "Your profile details have been saved." });
      return updatedUser;
    }
    return null;
  }, [currentUser, setCurrentUser, setAppUsers]);

  const updateUserEmailWithVerification = useCallback((newEmail) => {
    if (!currentUser) return;
    toast({ title: "Verification Required (Simulated)", description: `A verification link has been conceptually sent to ${newEmail}.` });
    
    setTimeout(() => {
      const oldEmailKey = `user_${currentUser.email}`;
      const newEmailKey = `user_${newEmail}`;
      
      const userData = JSON.parse(localStorage.getItem(oldEmailKey));
      if (!userData) return;

      const updatedUser = { ...userData, email: newEmail };
      localStorage.setItem(newEmailKey, JSON.stringify(updatedUser));
      localStorage.removeItem(oldEmailKey); 

      setCurrentUser(updatedUser);
      setAppUsers(prev => {
        const newUsers = {...prev};
        delete newUsers[oldEmailKey];
        newUsers[newEmailKey] = updatedUser;
        return newUsers;
      });
      toast({ title: "Email Updated Successfully!", description: `Your email has been changed to ${newEmail}.` });
    }, 3000);
  }, [currentUser, setCurrentUser, setAppUsers]);

  const updateUserPassword = useCallback((currentPassword, newPassword) => {
    if (!currentUser) return;
    const userKey = `user_${currentUser.email}`;
    let userData = JSON.parse(localStorage.getItem(userKey));
    
    const effectiveCurrentPassword = currentUser.email === ADMIN_EMAIL && !userData.passwordChanged ? ADMIN_PASSWORD : userData.password;

    if (userData && effectiveCurrentPassword === currentPassword) {
      const updatedUser = { ...userData, password: newPassword, passwordChanged: true };
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setAppUsers(prev => ({...prev, [userKey]: updatedUser}));
      toast({ title: "Password Updated", description: "Your password has been changed successfully." });
    } else {
      toast({ title: "Password Update Failed", description: "Incorrect current password.", variant: "destructive" });
    }
  }, [currentUser, setCurrentUser, setAppUsers]);

  const updateUserPin = useCallback((currentPin, newPin) => {
    if (!currentUser) return;
    const userKey = `user_${currentUser.email}`;
    const userData = JSON.parse(localStorage.getItem(userKey));

    if (userData && (userData.encryptedPin === currentPin || (!userData.encryptedPin && currentPin === '')) ) { 
      const updatedUser = { ...userData, encryptedPin: newPin };
      localStorage.setItem(userKey, JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setAppUsers(prev => ({...prev, [userKey]: updatedUser}));
      toast({ title: "PIN Updated", description: "Your PIN has been changed successfully." });
    } else {
      toast({ title: "PIN Update Failed", description: "Incorrect current PIN.", variant: "destructive" });
    }
  }, [currentUser, setCurrentUser, setAppUsers]);
  
  const deactivateCurrentUserAccount = useCallback(() => {
    if (!currentUser) return;
    const userKey = `user_${currentUser.email}`;
    const userData = JSON.parse(localStorage.getItem(userKey));
    if (userData) {
      const deactivatedUser = { ...userData, status: "deactivated", deactivationDate: new Date().toISOString() };
      localStorage.setItem(userKey, JSON.stringify(deactivatedUser));
      setAppUsers(prev => ({...prev, [userKey]: deactivatedUser}));
      toast({ title: "Account Deactivated", description: "Your account has been closed." });
    }
  }, [currentUser, setAppUsers]);

  const updateUserSetting = useCallback((settingKey, settingValue) => {
    if (currentUser) {
      const updatedSettings = { ...(currentUser.settings || {}), [settingKey]: settingValue };
      const updatedUser = { ...currentUser, settings: updatedSettings };
      setCurrentUser(updatedUser);
      localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(updatedUser));
      setAppUsers(prev => ({...prev, [`user_${currentUser.email}`]: updatedUser}));
    } else {
      // Handle settings changes for non-logged-in users if needed, e.g., dark mode before login
      if (settingKey === 'darkMode') {
        localStorage.setItem('votesmart_dark_mode', JSON.stringify(settingValue));
      }
    }
  }, [currentUser, setCurrentUser, setAppUsers]);


  return {
    currentUser,
    userRole,
    tempUserFor2FA,
    appUsers,
    authStep,
    handleRegister,
    handleLoginAttempt,
    handleSecurityKeyAuthSuccess,
    handleBiometricSuccess,
    handlePinSuccess,
    handleAuthFailure,
    handleLogout,
    setAuthStep,
    setTempUserFor2FA,
    setCurrentUser, 
    setUserRole,
    updateUserProfile,
    updateUserEmailWithVerification,
    updateUserPassword,
    updateUserPin,
    deactivateCurrentUserAccount,
    updateUserSetting,
  };
};
