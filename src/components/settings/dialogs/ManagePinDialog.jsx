import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ManagePinDialog = ({ onUpdatePin }) => {
  const [formData, setFormData] = useState({ currentPin: '', newPin: '', confirmNewPin: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.newPin || !formData.confirmNewPin) {
      toast({ title: "Missing Fields", description: "Please fill new PIN and confirm PIN fields.", variant: "destructive" });
      return;
    }
    if (formData.newPin !== formData.confirmNewPin) {
      toast({ title: "PIN Mismatch", description: "New PINs do not match.", variant: "destructive" });
      return;
    }
    if (formData.newPin.length !== 4 || !/^\d{4}$/.test(formData.newPin)) {
      toast({ title: "Invalid PIN", description: "PIN must be 4 digits.", variant: "destructive" });
      return;
    }
    onUpdatePin(formData.currentPin, formData.newPin);
    setFormData({ currentPin: '', newPin: '', confirmNewPin: '' });
  };

  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader><DialogTitle className="dark:text-white">Manage PIN</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="password" name="currentPin" placeholder="Current PIN (if set, leave blank if new)" value={formData.currentPin} onChange={handleChange} maxLength="4" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <Input type="password" name="newPin" placeholder="New 4-Digit PIN" value={formData.newPin} onChange={handleChange} required maxLength="4" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <Input type="password" name="confirmNewPin" placeholder="Confirm New PIN" value={formData.confirmNewPin} onChange={handleChange} required maxLength="4" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button></DialogClose>
          <Button type="submit" className="user-gradient">Update PIN</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ManagePinDialog;