import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Grid, Lock, ShieldAlert, CheckCircle, Delete } from 'lucide-react';

const PatternLock = ({ onSuccess, onFailure, userName }) => {
  const [pattern, setPattern] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const gridRef = useRef(null);

  const MAX_ATTEMPTS = 3;
  // For demo, the correct pattern is 1-2-3-4 (top-left to top-right)
  const CORRECT_PATTERN = ['1', '2', '3', '4']; 

  const points = Array.from({ length: 9 }, (_, i) => ({ id: (i + 1).toString(), x: (i % 3), y: Math.floor(i / 3) }));

  const getPointFromEvent = (event) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    let x, y;
    if (event.touches) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    const pointSize = rect.width / 3;
    const col = Math.floor(x / pointSize);
    const row = Math.floor(y / pointSize);
    
    if (col >=0 && col < 3 && row >=0 && row < 3) {
      return points[row * 3 + col];
    }
    return null;
  };

  const handleInteractionStart = (event) => {
    event.preventDefault();
    if (showError || showSuccess) return;
    setIsDrawing(true);
    const point = getPointFromEvent(event);
    if (point && !pattern.includes(point.id)) {
      setPattern([point.id]);
    }
  };
  
  const handleInteractionMove = (event) => {
    event.preventDefault();
    if (!isDrawing || showError || showSuccess) return;
    const point = getPointFromEvent(event);
    if (point && !pattern.includes(point.id)) {
      setPattern(prev => [...prev, point.id]);
    }
  };

  const handleInteractionEnd = () => {
    if (!isDrawing || showError || showSuccess) return;
    setIsDrawing(false);

    if (pattern.length < 4) {
      toast({ title: "Pattern Too Short", description: "Pattern must have at least 4 points.", variant: "destructive" });
      resetPattern();
      return;
    }

    // Check pattern
    const isCorrect = JSON.stringify(pattern) === JSON.stringify(CORRECT_PATTERN);

    if (isCorrect) {
      setShowSuccess(true);
      toast({ title: "Pattern Correct! ✅", description: "Logging you in..." });
      setTimeout(onSuccess, 1500);
    } else {
      setShowError(true);
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        toast({ title: "Too Many Attempts", description: "Account locked. Please contact support.", variant: "destructive" });
        setTimeout(onFailure, 1500); 
      } else {
        toast({ title: "Incorrect Pattern", description: `Please try again. ${MAX_ATTEMPTS - (attempts + 1)} attempts remaining.`, variant: "destructive" });
        setTimeout(() => {
          resetPattern();
          setShowError(false);
        }, 1500);
      }
    }
  };

  const resetPattern = () => {
    setPattern([]);
  };
  
  useEffect(() => {
    const endHandler = () => { if(isDrawing) handleInteractionEnd(); };
    
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchend', endHandler);

    return () => {
      window.removeEventListener('mouseup', endHandler);
      window.removeEventListener('touchend', endHandler);
    };
  }, [isDrawing, pattern, handleInteractionEnd]);


  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-white/20 p-8 text-white">
          <CardHeader className="text-center">
             <motion.div
              animate={{ scale: showError ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: showError ? 2 : 0, duration: 0.3 }}
            >
              {showSuccess ? (
                 <CheckCircle className="h-20 w-20 mx-auto text-green-300" />
              ) : showError && attempts >= MAX_ATTEMPTS ? (
                 <Lock className="h-20 w-20 mx-auto text-red-400" />
              ) : showError ? (
                 <ShieldAlert className="h-20 w-20 mx-auto text-red-300" />
              ): (
                 <Grid className="h-20 w-20 mx-auto text-purple-300" />
              )}
            </motion.div>
            <CardTitle className="text-2xl mt-6">Enter Your Pattern</CardTitle>
            {userName && <p className="text-white/80">Welcome back, {userName}!</p>}
          </CardHeader>
          <CardContent className="text-center space-y-6">
             <div 
              ref={gridRef}
              className="relative w-64 h-64 mx-auto grid grid-cols-3 gap-4 touch-none select-none"
              onMouseDown={handleInteractionStart}
              onMouseMove={handleInteractionMove}
              onTouchStart={handleInteractionStart}
              onTouchMove={handleInteractionMove}
            >
              {points.map(p => (
                <motion.div 
                  key={p.id} 
                  className={`w-full h-full rounded-full flex items-center justify-center border-2
                    ${pattern.includes(p.id) ? 'bg-purple-400/50 border-purple-300' : 'border-white/30'}
                    ${showError && pattern.includes(p.id) ? '!bg-red-400/50 !border-red-300' : ''}
                    ${showSuccess && pattern.includes(p.id) ? '!bg-green-400/50 !border-green-300' : ''}
                  `}
                  whileTap={{ scale: 1.2 }}
                >
                   <div className={`w-3 h-3 rounded-full ${pattern.includes(p.id) ? 'bg-white' : 'bg-white/30'}`}></div>
                </motion.div>
              ))}
              {pattern.length > 1 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 2 2">
                  {pattern.slice(0, -1).map((_, i) => {
                    const p1Index = points.findIndex(pt => pt.id === pattern[i]);
                    const p2Index = points.findIndex(pt => pt.id === pattern[i+1]);
                    if(p1Index === -1 || p2Index === -1) return null;

                    const p1 = points[p1Index];
                    const p2 = points[p2Index];
                    
                    const x1 = (p1.x + 0.5) / 1.5 - 0.333;
                    const y1 = (p1.y + 0.5) / 1.5 - 0.333;
                    const x2 = (p2.x + 0.5) / 1.5 - 0.333;
                    const y2 = (p2.y + 0.5) / 1.5 - 0.333;
                    
                    return (
                      <line 
                        key={i} 
                        x1={x1} y1={y1} 
                        x2={x2} y2={y2} 
                        strokeWidth="0.05" 
                        className={`${showError ? 'stroke-red-300' : showSuccess ? 'stroke-green-300' : 'stroke-purple-300'}`}
                      />
                    );
                  })}
                </svg>
              )}
            </div>
            
            {showSuccess ? (
              <p className="text-lg text-green-300 font-semibold">Pattern Correct! Logging in...</p>
            ) : showError && attempts >= MAX_ATTEMPTS ? (
              <p className="text-lg text-red-400 font-semibold">Account Locked. Contact support.</p>
            ) : showError ? (
              <p className="text-lg text-red-300 font-semibold">Incorrect Pattern. Try again.</p>
            ) : (
               <p className="text-sm text-white/70">Draw your 4-digit security pattern.</p>
            )}

            <div className="flex space-x-4">
                <Button 
                    onClick={resetPattern} 
                    variant="outline" 
                    className="w-full bg-transparent text-white border-white/50 hover:bg-white/10 disabled:opacity-50"
                    disabled={showError || showSuccess || pattern.length === 0}
                >
                    <Delete className="mr-2 h-4 w-4" />
                    Clear
                </Button>
                <Button 
                    onClick={onFailure} 
                    variant="outline" 
                    className="w-full bg-red-500/20 text-red-200 border-red-300/30 hover:bg-red-500/30 disabled:opacity-50"
                    disabled={showError || showSuccess}
                >
                    Cancel Login
                </Button>
            </div>
            <p className="text-xs text-white/60">Attempts remaining: {Math.max(0, MAX_ATTEMPTS - attempts)}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PatternLock;