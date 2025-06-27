import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smile, Info, ShieldAlert } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const WellbeingCheckModal = ({ isOpen, onOpenChange, onContinueVoting, onSeekInfo }) => {
  if (!isOpen) return null;

  const handleSeekInfo = () => {
    onSeekInfo();
    toast({
      title: "Information Page Requested",
      description: "Displaying neutral information page (conceptual).",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 dark:text-gray-200 sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="text-center">
            <ShieldAlert className="h-12 w-12 mx-auto text-yellow-500 dark:text-yellow-400 mb-3" />
            <DialogTitle className="text-2xl font-semibold dark:text-white">Voter Wellbeing Check</DialogTitle>
            <DialogDescription className="dark:text-gray-400 mt-2">
              Your wellbeing is important. Please take a moment to reflect before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-6 space-y-4 px-4">
            <p className="text-center text-gray-700 dark:text-gray-300">Are you feeling calm and ready to vote?</p>
            <Button 
              onClick={onContinueVoting} 
              className="w-full user-gradient text-white py-3 text-lg"
            >
              <Smile className="mr-2 h-5 w-5" /> Yes, I'm ready to vote
            </Button>
            
            <p className="text-center text-gray-700 dark:text-gray-300 pt-2">Would you like a summary of the issues or more information before voting?</p>
            <Button 
              onClick={handleSeekInfo} 
              variant="outline" 
              className="w-full dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 py-3 text-lg"
            >
              <Info className="mr-2 h-5 w-5" /> Yes, show me more info
            </Button>
          </div>

          <DialogFooter className="sm:justify-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This check is to ensure you feel comfortable and informed.
            </p>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default WellbeingCheckModal;