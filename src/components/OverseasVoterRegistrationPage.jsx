import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Mail, Lock, Info, FileText, Globe, Shield, Hash, KeyRound } from 'lucide-react';

const OverseasVoterRegistrationPage = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    passportNumber: '',
    countryOfResidence: '',
    pin: '',
    confirmPin: '',
    useBiometrics: false, 
    voterType: 'overseas', 
  });
  const [registrationStep, setRegistrationStep] = useState(1); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registrationStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.passportNumber || !formData.countryOfResidence) {
        toast({ title: "Missing Information", description: "Please fill all required personal and passport details.", variant: "destructive" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      setRegistrationStep(2);
    } else if (registrationStep === 2) {
      if (!formData.pin || formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
        toast({ title: "Invalid PIN", description: "PIN must be exactly 4 digits.", variant: "destructive" });
        return;
      }
      if (formData.pin !== formData.confirmPin) {
        toast({ title: "PIN Mismatch", description: "PINs do not match.", variant: "destructive" });
        return;
      }
      
      toast({ title: "Generating Secure Keys...", description: "Simulating public/private key pair generation for enhanced security. This is a conceptual step." });
      setTimeout(() => {
        onRegister(formData); 
      }, 1500);
    }
  };

  return (
     <div className="min-h-screen gradient-bg flex items-center justify-center p-20 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto relative"
      >
        <Button onClick={onBack} variant="ghost" className="absolute -top-12 left-0 text-white hover:bg-white/20 p-2 dark:text-gray-300 dark:hover:bg-gray-700/50">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        <Card className="glass-effect border-white/20 p-8 text-white dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="text-center mb-6">
            <Globe className="h-16 w-16 mx-auto text-purple-300 mb-3 dark:text-purple-400" />
            <CardTitle className="text-3xl font-bold dark:text-white">Overseas Voter Registration</CardTitle>
            <p className="text-white/80 dark:text-gray-300">Register to vote from abroad.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {registrationStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nameOverseas" className="dark:text-gray-300">Full Name (as per passport)</Label>
                    <div className="relative"><User className="input-icon dark:text-gray-400" /><Input name="name" id="nameOverseas" type="text" placeholder="Your full name" value={formData.name} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailOverseas" className="dark:text-gray-300">Email Address</Label>
                    <div className="relative"><Mail className="input-icon dark:text-gray-400" /><Input name="email" id="emailOverseas" type="email" placeholder="Your email" value={formData.email} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber" className="dark:text-gray-300">Passport Number</Label>
                    <div className="relative"><FileText className="input-icon dark:text-gray-400" /><Input name="passportNumber" id="passportNumber" type="text" placeholder="Your passport number" value={formData.passportNumber} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfResidence" className="dark:text-gray-300">Country of Residence</Label>
                    <div className="relative"><Info className="input-icon dark:text-gray-400" /><Input name="countryOfResidence" id="countryOfResidence" type="text" placeholder="Country you currently reside in" value={formData.countryOfResidence} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordOverseas" className="dark:text-gray-300">Create Password</Label>
                    <div className="relative"><Lock className="input-icon dark:text-gray-400" /><Input name="password" id="passwordOverseas" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPasswordOverseas" className="dark:text-gray-300">Confirm Password</Label>
                    <div className="relative"><Lock className="input-icon dark:text-gray-400" /><Input name="confirmPassword" id="confirmPasswordOverseas" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="input-field" required /></div>
                  </div>
                  <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100 mt-2 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
                    Next: Security Setup
                  </Button>
                </>
              )}
              {registrationStep === 2 && (
                <div className="text-white p-4 space-y-4 dark:text-gray-200">
                  <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto text-purple-300 animate-pulse-slow dark:text-purple-400" />
                    <h3 className="text-xl font-semibold mt-2">Security Setup</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 justify-center my-4">
                    <input type="checkbox" id="useBiometricsOverseas" name="useBiometrics" checked={formData.useBiometrics} onChange={handleChange} className="h-4 w-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500" />
                    <Label htmlFor="useBiometricsOverseas" className="text-white dark:text-gray-300">Enable Biometric Authentication (Simulated)</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinOverseas" className="dark:text-gray-300">Enter 4-Digit PIN</Label>
                    <div className="relative"><Hash className="input-icon dark:text-gray-400" /><Input name="pin" id="pinOverseas" type="password" maxLength="4" placeholder="Create PIN" value={formData.pin} onChange={handleChange} className="input-field tracking-[0.5em] text-center" required /></div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPinOverseas" className="dark:text-gray-300">Confirm 4-Digit PIN</Label>
                    <div className="relative"><Hash className="input-icon dark:text-gray-400" /><Input name="confirmPin" id="confirmPinOverseas" type="password" maxLength="4" placeholder="Confirm PIN" value={formData.confirmPin} onChange={handleChange} className="input-field tracking-[0.5em] text-center" required /></div>
                  </div>
                  <div className="mt-4 p-3 bg-purple-500/20 border border-purple-400/30 rounded-md dark:bg-purple-800/30 dark:border-purple-600/40">
                    <div className="flex items-center text-purple-200 dark:text-purple-300">
                      <KeyRound className="h-5 w-5 mr-2" />
                      <p className="text-sm font-medium">Secure Key Generation (Conceptual)</p>
                    </div>
                    <p className="text-xs text-purple-300 dark:text-purple-400 mt-1">
                      A unique public/private key pair will be conceptually generated for you.
                    </p>
                  </div>
                  <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100 mt-4 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
                    Complete Overseas Registration
                  </Button>
                  <Button variant="outline" onClick={() => setRegistrationStep(1)} className="w-full mt-2 bg-transparent text-white border-white/50 hover:bg-white/10 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700/50">Back to Details</Button>
                </div>
              )}
            </form>
          </CardContent>
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
    </div>
  );
};

export default OverseasVoterRegistrationPage;