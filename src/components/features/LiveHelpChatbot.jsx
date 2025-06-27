import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LiveHelpChatbot = ({ onBack }) => {
  const handleChatbotInteraction = () => {
    toast({
      title: "🚧 AI Chatbot Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-teal-900 dark:to-cyan-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-lg shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <MessageSquare className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Live Help Chatbot</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get instant answers to your voting questions.</p>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 my-8 animate-pulse" />
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our AI-powered chatbot is here to assist you with registration, voting procedures, technical troubleshooting, and more.
          </p>
          <Button 
            onClick={handleChatbotInteraction} 
            className="w-full user-gradient text-white py-3 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
          >
            Start Chatting
          </Button>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            The full chatbot functionality is under development.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveHelpChatbot;