import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ChangeEmailDialog = ({ currentEmail, onUpdateEmail }) => {
  const [newEmail, setNewEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid new email address.", variant: "destructive" });
      return;
    }
    onUpdateEmail(newEmail);
    setNewEmail('');
    toast({ title: "Email Update Initiated", description: "Conceptual: Verification email sent to new address." });
  };

  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader>
        <DialogTitle className="dark:text-white">Change Email Address</DialogTitle>
        <DialogDescription className="dark:text-gray-400">
          Your current email is {currentEmail}. Enter new email for verification.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          type="email" 
          placeholder="New Email Address" 
          value={newEmail} 
          onChange={(e) => setNewEmail(e.target.value)} 
          required 
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600" 
        />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button></DialogClose>
          <Button type="submit" className="user-gradient">Verify & Update</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ChangeEmailDialog;