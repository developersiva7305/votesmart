
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SecurityKeyAuth = ({ onSuccess, onFailure, onBack, userName }) => {
  
  const simulateAuthentication = async () => {
    console.log("Simulating WebAuthn: Fetching authentication options from server...");
    toast({
      title: "Security Key Authentication",
      description: "Please insert and tap your security key.",
    });
    await new Promise(resolve => setTimeout(resolve, 500)); 

    console.log("Simulating WebAuthn: Calling navigator.credentials.get()...");
    // const assertion = await navigator.credentials.get({ publicKey: requestOptions });
    // Simulate success/failure randomly or based on a condition for demo
    const isSuccess = Math.random() > 0.2; // 80% chance of success for demo
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate user interaction

    if (isSuccess) {
      console.log("Simulating WebAuthn: Sending assertion to server for verification...");
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Simulating WebAuthn: Server verification successful.");
      onSuccess();
    } else {
      console.log("Simulating WebAuthn: Authentication failed or cancelled by user.");
      toast({
        title: "Security Key Failed (Simulated)",
        description: "Authentication with security key failed or was cancelled. Please try again or use another method.",
        variant: "destructive",
      });
      onFailure();
    }
  };

  useEffect(() => {
    // Automatically trigger the simulation when the component mounts
    // In a real app, you might wait for a button click or other user action
    // simulateAuthentication(); // Or trigger via a button
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass-effect border-white/20 p-8 dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader className="text-center">
          <KeyRound className="h-16 w-16 mx-auto text-purple-300 dark:text-purple-400 animate-pulse-slow" />
          <CardTitle className="text-2xl font-bold text-white dark:text-gray-100 mt-4">Security Key Authentication</CardTitle>
          <CardDescription className="text-purple-100 dark:text-purple-300">
            Welcome back, {userName || "User"}! Please use your registered security key to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-sm text-white/80 dark:text-gray-300">
            Insert your security key and tap it when prompted by your browser or operating system.
          </p>
          <Button onClick={simulateAuthentication} className="w-full bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500">
            Authenticate with Security Key (Simulated)
          </Button>
          <Button variant="link" onClick={onBack} className="w-full text-purple-200 hover:text-white dark:text-purple-300 dark:hover:text-purple-100">
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Another Way / Back to Login
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityKeyAuth;
