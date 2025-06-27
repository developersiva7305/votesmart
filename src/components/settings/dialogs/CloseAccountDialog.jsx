import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CloseAccountDialog = ({ onCloseAccountConfirm }) => {
  const [confirmInput, setConfirmInput] = useState('');

  const handleConfirm = () => {
    if (confirmInput === "CONFIRM") {
      onCloseAccountConfirm();
    } else {
      toast({
        title: "Confirmation Failed",
        description: "Please type 'CONFIRM' to close your account.",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader>
        <DialogTitle className="text-red-600 dark:text-red-400 flex items-center"><AlertTriangle className="mr-2"/>Are you sure?</DialogTitle>
        <DialogDescription className="dark:text-gray-400">
          Closing your account is permanent and cannot be undone. All your voting history and data will be conceptually deleted.
          To confirm, please type "CONFIRM" in the box below.
        </DialogDescription>
      </DialogHeader>
      <Input 
        type="text"
        placeholder='Type "CONFIRM"'
        value={confirmInput}
        onChange={(e) => setConfirmInput(e.target.value)}
        className="my-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button></DialogClose>
        <Button onClick={handleConfirm} variant="destructive" disabled={confirmInput !== "CONFIRM"}>Yes, Close My Account</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CloseAccountDialog;