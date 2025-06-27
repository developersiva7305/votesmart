import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Hash, Lock, ShieldAlert, CheckCircle, Delete, ArrowLeft } from 'lucide-react';

const PinLock = ({ onSuccess, onFailure, userName, correctPin, onBack }) => {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const MAX_ATTEMPTS = 3;
  const PIN_LENGTH = 4;

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= PIN_LENGTH) {
      setPin(value);
      if (value.length === PIN_LENGTH) {
        handleSubmit(value);
      }
    }
  };

  const handleSubmit = (currentPin) => {
    if (showError || showSuccess) return;

    if (currentPin.length !== PIN_LENGTH) {
      toast({ title: "Invalid PIN", description: `PIN must be ${PIN_LENGTH} digits.`, variant: "destructive" });
      return;
    }

    if (currentPin === correctPin) {
      setShowSuccess(true);
      toast({ title: "PIN Correct! ✅", description: "Logging you in..." });
      setTimeout(onSuccess, 1500);
    } else {
      setShowError(true);
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        toast({ title: "Too Many Attempts", description: "Account locked. Please contact support.", variant: "destructive" });
        setTimeout(onFailure, 1500); 
      } else {
        toast({ title: "Incorrect PIN", description: `Please try again. ${MAX_ATTEMPTS - (attempts + 1)} attempts remaining.`, variant: "destructive" });
        setTimeout(() => {
          setPin('');
          setShowError(false);
        }, 1500);
      }
    }
  };
  
  const handleKeyPress = (key) => {
    if (showError || showSuccess || pin.length >= PIN_LENGTH) return;
    const newPin = pin + key;
    setPin(newPin);
     if (newPin.length === PIN_LENGTH) {
        handleSubmit(newPin);
      }
  };

  const handleDelete = () => {
    if (showError || showSuccess) return;
    setPin(prev => prev.slice(0, -1));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(pin);
  };


  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs sm:max-w-sm relative"
      >
        <Button onClick={onBack} variant="ghost" className="absolute -top-12 left-0 text-white hover:bg-white/20 p-2 dark:text-gray-300 dark:hover:bg-gray-700/50">
          <ArrowLeft className="h-5 w-5 mr-1" /> Back to Login
        </Button>
        <Card className="glass-effect border-white/20 p-6 sm:p-8 text-white dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader className="text-center">
             <motion.div
              animate={{ scale: showError ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: showError ? 2 : 0, duration: 0.3 }}
            >
              {showSuccess ? (
                 <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-green-300 dark:text-green-400" />
              ) : showError && attempts >= MAX_ATTEMPTS ? (
                 <Lock className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-red-400 dark:text-red-500" />
              ) : showError ? (
                 <ShieldAlert className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-red-300 dark:text-red-400" />
              ): (
                 <Hash className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-purple-300 dark:text-purple-400" />
              )}
            </motion.div>
            <CardTitle className="text-xl sm:text-2xl mt-4 sm:mt-6 dark:text-white">Enter Your {PIN_LENGTH}-Digit PIN</CardTitle>
            {userName && <p className="text-white/80 text-sm sm:text-base dark:text-gray-300">Welcome back, {userName}!</p>}
          </CardHeader>
          <CardContent className="text-center space-y-4 sm:space-y-6">
            <form onSubmit={handleFormSubmit}>
              <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border-2 flex items-center justify-center text-2xl sm:text-3xl font-bold
                      ${showError ? 'border-red-400 bg-red-500/20 dark:border-red-500 dark:bg-red-700/30' : showSuccess ? 'border-green-400 bg-green-500/20 dark:border-green-500 dark:bg-green-700/30' : 'border-white/30 bg-white/10 dark:border-gray-600 dark:bg-gray-700/50'}
                      ${pin.length > index ? (showError ? 'text-red-300 dark:text-red-400' : showSuccess ? 'text-green-300 dark:text-green-400' : 'text-purple-300 dark:text-purple-400') : 'text-white/50 dark:text-gray-500'}
                    `}
                    animate={{ scale: pin.length === index && !showError && !showSuccess ? 1.1 : 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {pin[index] ? '•' : ''}
                  </motion.div>
                ))}
              </div>
               <Input 
                type="password" 
                value={pin}
                onChange={handlePinChange}
                maxLength={PIN_LENGTH}
                className="opacity-0 absolute w-0 h-0 pointer-events-none"
                autoFocus
              />
            </form>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                    <Button 
                        key={num}
                        variant="outline"
                        className="text-xl sm:text-2xl py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/60 dark:disabled:opacity-60"
                        onClick={() => handleKeyPress(num)}
                        disabled={showError || showSuccess || pin.length >= PIN_LENGTH}
                    >
                        {num}
                    </Button>
                ))}
                 <Button 
                    variant="outline"
                    className="text-xl sm:text-2xl py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/60 dark:disabled:opacity-60"
                    onClick={() => {}} 
                    disabled={showError || showSuccess}
                >
                </Button>
                <Button 
                    variant="outline"
                    className="text-xl sm:text-2xl py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/60 dark:disabled:opacity-60"
                    onClick={() => handleKeyPress('0')}
                    disabled={showError || showSuccess || pin.length >= PIN_LENGTH}
                >
                    0
                </Button>
                <Button 
                    variant="outline"
                    className="py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 flex items-center justify-center dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600/60 dark:disabled:opacity-60"
                    onClick={handleDelete}
                    disabled={showError || showSuccess || pin.length === 0}
                >
                    <Delete className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
            </div>
            
            {showSuccess ? (
              <p className="text-sm sm:text-lg text-green-300 font-semibold dark:text-green-400">PIN Correct! Logging in...</p>
            ) : showError && attempts >= MAX_ATTEMPTS ? (
              <p className="text-sm sm:text-lg text-red-400 font-semibold dark:text-red-500">Account Locked. Contact support.</p>
            ) : showError ? (
              <p className="text-sm sm:text-lg text-red-300 font-semibold dark:text-red-400">Incorrect PIN. Try again.</p>
            ) : (
               <p className="text-xs sm:text-sm text-white/70 dark:text-gray-400">Enter your {PIN_LENGTH}-digit security PIN.</p>
            )}
            <p className="text-xs text-white/60 dark:text-gray-500">Attempts remaining: {Math.max(0, MAX_ATTEMPTS - attempts)}</p>
             <Button 
                onClick={onFailure} 
                variant="link" 
                className="w-full text-purple-300 hover:text-purple-200 disabled:opacity-50 text-sm dark:text-purple-400 dark:hover:text-purple-300"
                disabled={showError || showSuccess}
            >
                Cancel Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PinLock;