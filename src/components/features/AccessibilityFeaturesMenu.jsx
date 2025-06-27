import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, Volume2, Contrast } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AccessibilityFeaturesMenu = ({ onBack }) => {
  const handleFeatureToggle = (featureName) => {
    toast({
      title: `🚧 ${featureName} Toggle Coming Soon!`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900 dark:to-orange-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-md shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Eye className="h-12 w-12 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Accessibility Features</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience for easier use.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button 
            onClick={() => handleFeatureToggle("Screen Reader Compatibility")} 
            variant="outline" 
            className="w-full justify-start py-6 text-left dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Eye className="mr-3 h-5 w-5 text-blue-500 dark:text-blue-400" /> 
            Screen Reader Mode
          </Button>
          <Button 
            onClick={() => handleFeatureToggle("Voice Commands")} 
            variant="outline" 
            className="w-full justify-start py-6 text-left dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Volume2 className="mr-3 h-5 w-5 text-green-500 dark:text-green-400" />
            Voice Commands
          </Button>
          <Button 
            onClick={() => handleFeatureToggle("High Contrast Mode")} 
            variant="outline" 
            className="w-full justify-start py-6 text-left dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Contrast className="mr-3 h-5 w-5 text-purple-500 dark:text-purple-400" />
            High Contrast Mode
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center">
            We are committed to making voting accessible for everyone.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AccessibilityFeaturesMenu;