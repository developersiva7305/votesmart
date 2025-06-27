import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ListChecks, CheckSquare } from 'lucide-react';

const VotingProceduresPage = ({ onBack }) => {
  const procedures = [
    {
      step: 1,
      title: "Register or Log In",
      description: "Ensure you are registered on VoteSmart. If you are, log in using your credentials (email/password, followed by PIN or Biometric verification if enabled)."
    },
    {
      step: 2,
      title: "Navigate to Elections",
      description: "Once logged in, go to your User Dashboard. You will see a list of 'Active Elections' you are eligible to vote in."
    },
    {
      step: 3,
      title: "Select an Election",
      description: "Choose the election you wish to participate in from the list. You can view details about the election, including the candidates and their information."
    },
    {
      step: 4,
      title: "Cast Your Vote",
      description: "Carefully review the candidates. Select your preferred candidate by clicking the 'Vote' button next to their name. A confirmation modal will appear."
    },
    {
      step: 5,
      title: "Confirm Your Vote",
      description: "In the confirmation modal, verify your choice. If you are sure, click 'Confirm Vote'. Your vote will be securely and anonymously (conceptually) recorded."
    },
    {
      step: 6,
      title: "View Voting History",
      description: "After voting, you can view your participation history in the 'My Voting History' section on your dashboard. This confirms your vote was cast but does not reveal your choice to maintain secrecy."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex flex-col items-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-xl border-none dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative pb-4 border-b dark:border-gray-700">
            <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center pt-8">
              <ListChecks className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Voting Procedures</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Follow these steps to cast your vote securely.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {procedures.map((procedure, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start space-x-4 p-4 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {procedure.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{procedure.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{procedure.description}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: #374151; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #6b7280; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default VotingProceduresPage;