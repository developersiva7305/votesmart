import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Flag, Send, Edit3 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CommunityFeedbackReporter = ({ onBack }) => {
  const handleSubmitReport = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Feedback System Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-indigo-900 dark:to-pink-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-lg shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Flag className="h-12 w-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Community Feedback & Reporting</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Report suspicious activities or provide feedback.</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmitReport} className="space-y-6">
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <select 
                id="report-type" 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                defaultValue="suspicious-activity"
              >
                <option value="suspicious-activity">Suspicious Activity</option>
                <option value="technical-issue">Technical Issue</option>
                <option value="general-feedback">General Feedback</option>
                <option value="suggestion">Feature Suggestion</option>
              </select>
            </div>
            <div>
              <label htmlFor="report-details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Details
              </label>
              <Textarea 
                id="report-details" 
                placeholder="Please provide as much detail as possible..." 
                rows={5}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full user-gradient text-white py-3 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
            >
              <Send className="mr-2 h-5 w-5" /> Submit Report (Conceptual)
            </Button>
          </form>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
            Your reports help us maintain a secure and fair election environment. The full reporting channel is under development.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommunityFeedbackReporter;