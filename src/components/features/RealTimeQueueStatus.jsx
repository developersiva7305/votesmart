import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const RealTimeQueueStatus = ({ onBack }) => {
  const handleStationSelect = () => {
    toast({
      title: "🚧 Live Queue Data Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-pink-900 dark:to-rose-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Clock className="h-12 w-12 mx-auto text-red-600 dark:text-red-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Polling Station Queue Status</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Check estimated wait times for physical polling stations.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 my-6 animate-bounce-slow" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Select a polling station to view its current queue status and estimated wait time.
            </p>
            <Button 
              onClick={handleStationSelect} 
              className="w-full md:w-auto admin-gradient text-white py-3 px-6 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
            >
              <Users className="mr-2 h-5 w-5" /> Find My Polling Station
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 text-center">
            This feature applies to hybrid voting scenarios where physical polling stations are active. Data is conceptual.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RealTimeQueueStatus;