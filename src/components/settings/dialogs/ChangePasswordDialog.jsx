import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ChangePasswordDialog = ({ onUpdatePassword }) => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast({ title: "Missing Fields", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({ title: "Password Mismatch", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (formData.newPassword.length < 6) {
      toast({ title: "Password Too Short", description: "New password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    onUpdatePassword(formData.currentPassword, formData.newPassword);
    setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader><DialogTitle className="dark:text-white">Change Password</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} name="currentPassword" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8 dark:text-gray-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff/> : <Eye/>}</Button>
        </div>
        <Input type={showPassword ? "text" : "password"} name="newPassword" placeholder="New Password (min 6 chars)" value={formData.newPassword} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <Input type={showPassword ? "text" : "password"} name="confirmNewPassword" placeholder="Confirm New Password" value={formData.confirmNewPassword} onChange={handleChange} required className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button></DialogClose>
          <Button type="submit" className="user-gradient">Update Password</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ChangePasswordDialog;