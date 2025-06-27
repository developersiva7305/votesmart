import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Wifi, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const GeoFencingValidator = ({ onBack }) => {
  const handleValidateLocation = () => {
    toast({
      title: "🚧 Geo-Fencing Validation Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-cyan-900 dark:to-blue-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-lg shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <MapPin className="h-12 w-12 mx-auto text-sky-600 dark:text-sky-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Geo-Fencing Validation</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ensuring votes are cast from authorized locations.</p>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center items-center space-x-4 my-8">
            <Wifi className="h-16 w-16 text-gray-300 dark:text-gray-600 animate-pulse-slow" />
            <Lock className="h-20 w-20 text-sky-500 dark:text-sky-400" />
            <MapPin className="h-16 w-16 text-gray-300 dark:text-gray-600 animate-pulse-slow" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            To maintain election integrity, your location may be verified using secure geo-fencing technology. This ensures that votes are cast only from within permitted geographical regions.
          </p>
          <Button 
            onClick={handleValidateLocation} 
            className="w-full admin-gradient text-white py-3 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
          >
            Validate My Location (Conceptual)
          </Button>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            The geo-fencing validation system is under development.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GeoFencingValidator;