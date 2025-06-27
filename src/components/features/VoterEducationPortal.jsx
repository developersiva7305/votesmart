import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Users, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VoterEducationPortal = ({ onBack }) => {
  const handleFeatureClick = (featureName) => {
    toast({
      title: `🚧 ${featureName} Coming Soon!`,
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-3xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <BookOpen className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Voter Education Portal</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Make informed decisions before casting your vote.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("Candidate Profiles")}
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Candidate Profiles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn about the candidates running in upcoming elections.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("Party Manifestos")}
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Party Manifestos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Understand the platforms and promises of different political parties.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleFeatureClick("Sample Ballots")}
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-500 dark:text-purple-400 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Sample Ballots</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Familiarize yourself with the ballot format before election day.</p>
              </div>
            </div>
          </motion.div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
            Explore these resources to become a well-informed voter!
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoterEducationPortal;