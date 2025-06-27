import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Link, Zap, Lock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BlockchainIntegrationDisplay = ({ onBack }) => {
  const handleLearnMore = () => {
    toast({
      title: "🚧 Blockchain Details Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ filter: "blur(8px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      exit={{ filter: "blur(8px)", opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 p-4 md:p-8 flex flex-col items-center text-white"
    >
      <Card className="w-full max-w-xl shadow-2xl bg-gray-800/80 backdrop-blur-md border-gray-700">
        <CardHeader className="text-center relative border-b pb-4 border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-300 hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link className="h-12 w-12 mx-auto text-blue-400 mb-2 animate-float" />
          <CardTitle className="text-3xl font-bold text-white">Blockchain Integration</CardTitle>
          <p className="text-sm text-gray-400">Enhanced Trust & Transparency.</p>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex justify-around items-center my-8">
            <Zap className="h-16 w-16 text-yellow-400" />
            <Lock className="h-20 w-20 text-green-400" />
            <Link className="h-16 w-16 text-blue-400" />
          </div>
          <p className="text-gray-300 mb-6">
            VoteSmart leverages blockchain technology (conceptually) to store votes immutably. This adds an unparalleled layer of security, trust, and transparency to the election process, ensuring that every vote is tamper-proof and verifiable.
          </p>
          <Button 
            onClick={handleLearnMore} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
          >
            Learn More About Our Blockchain Use (Conceptual)
          </Button>
           <p className="text-xs text-gray-500 mt-4">
            Detailed information on our blockchain implementation is under development.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlockchainIntegrationDisplay;