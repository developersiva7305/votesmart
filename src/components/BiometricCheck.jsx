import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BiometricCheck = ({ onSuccess, onFailure, userName, onBack }) => {
  const [status, setStatus] = useState('pending'); 

  const handleScan = () => {
    setStatus('scanning');
    toast({ title: "Scanning Biometrics...", description: "Please place your finger on the scanner or look at the camera." });
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; 
      if (isSuccess) {
        setStatus('success');
        setTimeout(onSuccess, 1500); 
      } else {
        setStatus('failure');
        toast({ title: "Biometric Scan Failed", description: "Please try again or contact support.", variant: "destructive" });
      }
    }, 3000);
  };

  useEffect(() => {
    if (status === 'pending') {
        handleScan(); 
    }
  }, [status]);


  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Button onClick={onBack} variant="ghost" className="absolute -top-12 left-0 text-white hover:bg-white/20 p-2 dark:text-gray-300 dark:hover:bg-gray-700/50">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Login
        </Button>
        <Card className="glass-effect border-white/20 p-8 text-white dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="text-center">
            <motion.div
              animate={{ scale: status === 'scanning' ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: status === 'scanning' ? Infinity : 0, duration: 1.5 }}
            >
              {status === 'success' ? (
                <CheckCircle className="h-20 w-20 mx-auto text-green-300 dark:text-green-400" />
              ) : status === 'failure' ? (
                <ShieldAlert className="h-20 w-20 mx-auto text-red-300 dark:text-red-400" />
              ) : (
                <Fingerprint className="h-20 w-20 mx-auto text-purple-300 dark:text-purple-400" />
              )}
            </motion.div>
            <CardTitle className="text-2xl mt-6 dark:text-white">Biometric Verification</CardTitle>
            {userName && <p className="text-white/80 dark:text-gray-300">Welcome, {userName}!</p>}
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {status === 'pending' && (
              <>
                <p className="text-lg dark:text-gray-200">Please verify your identity using biometrics.</p>
                <Button onClick={handleScan} className="w-full bg-white text-purple-600 hover:bg-gray-100 text-lg py-3 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
                  Start Biometric Scan
                </Button>
              </>
            )}
            {status === 'scanning' && (
              <p className="text-lg animate-pulse dark:text-gray-200">Scanning in progress... Please wait.</p>
            )}
            {status === 'success' && (
              <p className="text-lg text-green-300 font-semibold dark:text-green-400">Biometric Scan Successful! Redirecting...</p>
            )}
            {status === 'failure' && (
              <>
                <p className="text-lg text-red-300 font-semibold dark:text-red-400">Biometric Scan Failed.</p>
                <div className="flex space-x-2">
                    <Button onClick={handleScan} className="w-full bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
                    Try Again
                    </Button>
                    <Button onClick={onFailure} variant="outline" className="w-full bg-transparent text-white border-white/50 hover:bg-white/10 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700/50">
                    Cancel
                    </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BiometricCheck;