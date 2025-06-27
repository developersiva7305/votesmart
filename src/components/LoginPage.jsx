
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, Shield, Mail, Lock, User, Fingerprint, Hash, Info, FileText, ArrowLeft, KeyRound, ImagePlus } from 'lucide-react';
import { APP_VIEWS, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PIN } from '@/services/appConstants.js';

const LoginPage = ({ onLoginAttempt, onRegister, onBack, navigateTo, showBiometricOption }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    voterId: '',
    aadhar: '',
    pin: '',
    confirmPin: '',
    useBiometrics: false,
    voterType: 'regular', 
    profilePicture: null, 
  });
  const [registrationStep, setRegistrationStep] = useState(1); 
  const fileInputRef = useRef(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);


  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    onLoginAttempt(loginData);
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "Profile picture must be less than 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegisterData(prev => ({ ...prev, profilePicture: reader.result }));
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (registerData.email === ADMIN_EMAIL && registerData.voterType !== 'admin_placeholder') { 
      toast({ title: "Registration Error", description: "This email is reserved. Please use a different email.", variant: "destructive" });
      return;
    }
    
    if (registerData.voterType === 'overseas') {
      navigateTo(APP_VIEWS.OVERSEAS_REGISTRATION); 
      return;
    }


    if (registrationStep === 1) { 
      if (!registerData.name || !registerData.email || !registerData.password || !registerData.voterId || !registerData.aadhar) {
        toast({ title: "Missing Information", description: "Please fill all required personal details.", variant: "destructive" });
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      setRegistrationStep(2);
    } else if (registrationStep === 2) { 
      if (registerData.useBiometrics) {
        
      }
      if (!registerData.pin || registerData.pin.length !== 4 || !/^\d{4}$/.test(registerData.pin)) {
        toast({ title: "Invalid PIN", description: "PIN must be exactly 4 digits.", variant: "destructive" });
        return;
      }
      if (registerData.pin !== registerData.confirmPin) {
        toast({ title: "PIN Mismatch", description: "PINs do not match.", variant: "destructive" });
        return;
      }
      
      toast({ title: "Generating Secure Keys...", description: "Simulating public/private key pair generation for enhanced security. This is a conceptual step." });
      
      setTimeout(() => {
        onRegister(registerData); // This will be handled by App.jsx's AuthProvider
        setRegistrationStep(1); 
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '', voterId: '', aadhar: '', pin: '', confirmPin: '', useBiometrics: false, voterType: 'regular', profilePicture: null });
        setProfilePicturePreview(null);
        toast({title: "Registration Complete!", description: "Secure keys generated (conceptually). You can now log in."});
        // Potentially switch to login tab or show success message prominently
      }, 1500);
    }
  };

  const quickLogin = (role) => {
    let email, password;
    if (role === 'admin') {
        email = ADMIN_EMAIL; 
        password = ADMIN_PASSWORD; // Use constant from appConstants
    } else { 
        email = 'voter@example.com';
        password = 'voter123';
        const demoUserKey = `user_voter@example.com`;
        if (!localStorage.getItem(demoUserKey)) {
            localStorage.setItem(demoUserKey, JSON.stringify({
            id: 'demouser001',
            name: 'Demo Voter',
            email: 'voter@example.com',
            password: 'voter123', // Plain text password for demo user
            role: 'user',
            voterId: 'DEMO123',
            aadhar: '000000000000',
            biometricHash: null,
            encryptedPin: '1234', // Store PIN for demo user
            voterType: 'regular',
            publicKey: 'pubkey_demouser_example',
            privateKeyPlaceholder: 'Stored on device (conceptual)',
            profilePicture: null,
            settings: { biometricAuthEnabled: false, darkMode: false, fontStyle: 'var(--font-family-sans)', fontSize: '16px' } 
            }));
        }
    }
    onLoginAttempt({ email, password });
  };
  
  const renderRegistrationForm = () => {
    if (registrationStep === 1) { 
      return (
        <>
          <div className="flex flex-col items-center mb-4">
            <div 
              className="relative w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors dark:bg-gray-700/30 dark:border-gray-600 dark:hover:bg-gray-600/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <ImagePlus className="w-10 h-10 text-white/70 dark:text-gray-400" />
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleProfilePictureChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                name="profilePictureFile"
              />
            </div>
            <Label htmlFor="profilePictureFile" className="text-white text-sm mt-2 cursor-pointer hover:underline dark:text-gray-300">Upload Profile Picture (Optional)</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameReg" className="text-white dark:text-gray-300">Full Name</Label>
            <div className="relative"><User className="input-icon dark:text-gray-400" /><Input name="name" id="nameReg" type="text" placeholder="Your full name" value={registerData.name} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailReg" className="text-white dark:text-gray-300">Email</Label>
            <div className="relative"><Mail className="input-icon dark:text-gray-400" /><Input name="email" id="emailReg" type="email" placeholder="Your email" value={registerData.email} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="voterIdReg" className="text-white dark:text-gray-300">Voter ID</Label>
            <div className="relative"><Info className="input-icon dark:text-gray-400" /><Input name="voterId" id="voterIdReg" type="text" placeholder="Your Voter ID" value={registerData.voterId} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="aadharReg" className="text-white dark:text-gray-300">Aadhar Number</Label>
            <div className="relative"><FileText className="input-icon dark:text-gray-400" /><Input name="aadhar" id="aadharReg" type="text" placeholder="Your Aadhar number" value={registerData.aadhar} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordReg"className="text-white dark:text-gray-300">Password</Label>
            <div className="relative"><Lock className="input-icon dark:text-gray-400" /><Input name="password" id="passwordReg" type="password" placeholder="Create password" value={registerData.password} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPasswordReg"className="text-white dark:text-gray-300">Confirm Password</Label>
            <div className="relative"><Lock className="input-icon dark:text-gray-400" /><Input name="confirmPassword" id="confirmPasswordReg" type="password" placeholder="Confirm password" value={registerData.confirmPassword} onChange={handleRegisterChange} className="input-field" /></div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="voterType" className="text-white dark:text-gray-300">Voter Type</Label>
            <select name="voterType" id="voterType" value={registerData.voterType} onChange={handleRegisterChange} className="w-full input-field bg-white/10 border-white/20 text-white placeholder:text-gray-300 p-2 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400">
              <option value="regular" className="text-black dark:text-white dark:bg-gray-600">Regular Voter</option>
              <option value="service" className="text-black dark:text-white dark:bg-gray-600">Service Voter</option>
              <option value="overseas" className="text-black dark:text-white dark:bg-gray-600">Overseas Voter (Redirects)</option>
            </select>
          </div>
          <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
            Next: Security Setup
          </Button>
        </>
      );
    } else if (registrationStep === 2) { 
      return (
        <div className="text-white p-4 space-y-4 dark:text-gray-200">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto text-purple-300 animate-pulse-slow dark:text-purple-400" />
            <h3 className="text-xl font-semibold mt-2">Security Setup</h3>
          </div>
          
          {showBiometricOption && (
            <div className="flex items-center space-x-2 justify-center my-4">
              <input type="checkbox" id="useBiometricsReg" name="useBiometrics" checked={registerData.useBiometrics} onChange={handleRegisterChange} className="h-4 w-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500" />
              <Label htmlFor="useBiometricsReg" className="text-white dark:text-gray-300">Enable Biometric Authentication (Simulated)</Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pinReg" className="text-white dark:text-gray-300">Enter 4-Digit PIN</Label>
            <div className="relative"><Hash className="input-icon dark:text-gray-400" /><Input name="pin" id="pinReg" type="password" maxLength="4" placeholder="Create PIN" value={registerData.pin} onChange={handleRegisterChange} className="input-field tracking-[0.5em] text-center" /></div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPinReg" className="text-white dark:text-gray-300">Confirm 4-Digit PIN</Label>
            <div className="relative"><Hash className="input-icon dark:text-gray-400" /><Input name="confirmPin" id="confirmPinReg" type="password" maxLength="4" placeholder="Confirm PIN" value={registerData.confirmPin} onChange={handleRegisterChange} className="input-field tracking-[0.5em] text-center" /></div>
          </div>
          
          <div className="mt-4 p-3 bg-purple-500/20 border border-purple-400/30 rounded-md dark:bg-purple-800/30 dark:border-purple-600/40">
            <div className="flex items-center text-purple-200 dark:text-purple-300">
              <KeyRound className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Secure Key Generation (Conceptual)</p>
            </div>
            <p className="text-xs text-purple-300 dark:text-purple-400 mt-1">
              A unique public/private key pair will be conceptually generated for you to enhance voting security.
              Your PIN protects access to these keys.
            </p>
          </div>

          <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100 mt-4 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
            Complete Registration
          </Button>
          <Button variant="outline" onClick={() => setRegistrationStep(1)} className="w-full mt-2 bg-transparent text-white border-white/50 hover:bg-white/10 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700/50">Back to Details</Button>
        </div>
      );
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto relative"
    >
      <Button onClick={onBack} variant="ghost" className="absolute -top-10 left-0 text-white hover:bg-white/20 p-2 dark:text-gray-300 dark:hover:bg-gray-700/50">
        <ArrowLeft className="h-5 w-5 mr-1" /> Back
      </Button>
      <Card className="glass-effect border-white/20 p-8 dark:bg-gray-800/50 dark:border-gray-700">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-gray-700">
            <TabsTrigger value="login" className="dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white dark:text-gray-300">Login</TabsTrigger>
            <TabsTrigger value="register" onClick={() => { setRegistrationStep(1); setRegisterData({ name: '', email: '', password: '', confirmPassword: '', voterId: '', aadhar: '', pin: '', confirmPin: '', useBiometrics: false, voterType: 'regular', profilePicture: null }); setProfilePicturePreview(null);}} className="dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white dark:text-gray-300">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white dark:text-gray-300">Email</Label>
                <div className="relative"><Mail className="input-icon dark:text-gray-400" /><Input id="login-email" type="email" placeholder="Enter your email" value={loginData.email} onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))} className="input-field" /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white dark:text-gray-300">Password</Label>
                <div className="relative"><Lock className="input-icon dark:text-gray-400" /><Input id="login-password" type="password" placeholder="Enter your password" value={loginData.password} onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))} className="input-field" /></div>
              </div>
              <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
                <UserCheck className="mr-2 h-4 w-4" /> Login
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {renderRegistrationForm()}
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-6 border-t border-white/20 dark:border-gray-700">
          <p className="text-white/80 text-sm text-center mb-4 dark:text-gray-400">Quick Demo Access:</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => quickLogin('admin')} variant="outline" className="bg-red-500/20 border-red-300/30 text-white hover:bg-red-500/30 dark:bg-red-700/30 dark:border-red-600/40 dark:text-gray-200 dark:hover:bg-red-700/40">
              <Shield className="mr-2 h-4 w-4" /> Admin Demo
            </Button>
            <Button onClick={() => quickLogin('user')} variant="outline" className="bg-blue-500/20 border-blue-300/30 text-white hover:bg-blue-500/30 dark:bg-blue-700/30 dark:border-blue-600/40 dark:text-gray-200 dark:hover:bg-blue-700/40">
              <UserCheck className="mr-2 h-4 w-4" /> Voter Demo
            </Button>
          </div>
        </div>
      </Card>
      <style jsx>{`
        .input-icon { position: absolute; left: 0.75rem; top: 0.75rem; height: 1rem; width: 1rem; color: #9ca3af; }
        .dark .input-icon { color: #6b7280; }
        .input-field { padding-left: 2.5rem; background-color: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: white; }
        .dark .input-field { background-color: rgba(55, 65, 81, 0.5); border-color: rgba(75, 85, 99, 0.7); color: #e5e7eb; }
        .input-field::placeholder { color: #d1d5db; }
        .dark .input-field::placeholder { color: #9ca3af; }
      `}</style>
    </motion.div>
  );
};

export default LoginPage;
