import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, DownloadCloud, FileLock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VoteAuditTrail = ({ onBack }) => {
  const handleDownloadReceipt = () => {
    toast({
      title: "🚧 Secure Receipt Download Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-red-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-lg shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ShieldCheck className="h-12 w-12 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Vote Audit Trail</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Verify your vote's inclusion securely.</p>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <FileLock className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 my-8 animate-pulse" />
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            After voting, you can download a secure, encrypted receipt. This receipt contains a cryptographic hash allowing you to verify that your vote was correctly recorded in the final tally, without revealing your actual choice.
          </p>
          <Button 
            onClick={handleDownloadReceipt} 
            className="w-full user-gradient text-white py-3 text-lg font-semibold transform hover:scale-105 transition-transform duration-300"
          >
            <DownloadCloud className="mr-2 h-5 w-5" /> Download My Vote Receipt (Conceptual)
          </Button>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            The full audit trail and receipt generation system is under development.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VoteAuditTrail;