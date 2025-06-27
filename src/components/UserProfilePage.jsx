import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Mail, Shield, Edit3, Save, Camera, XSquare } from 'lucide-react';

const UserProfilePage = ({ currentUser, onUpdateProfile, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '', 
    voterId: currentUser.voterId || 'N/A',
    aadhar: currentUser.aadhar || 'N/A',
    voterType: currentUser.voterType || 'Regular',
    profilePicture: currentUser.profilePicture || null,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(currentUser.profilePicture || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({ title: "File Too Large", description: "Profile picture must be less than 2MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, ...dataToUpdate } = formData;
    onUpdateProfile(dataToUpdate); 
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      voterId: currentUser.voterId || 'N/A',
      aadhar: currentUser.aadhar || 'N/A',
      voterType: currentUser.voterType || 'Regular',
      profilePicture: currentUser.profilePicture || null,
    });
    setProfilePicturePreview(currentUser.profilePicture || null);
  };


  return (
    <div className="min-h-screen bg-votesmart-gray-extralight dark:bg-darkBackground flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative pb-20" // Added padding-bottom for sticky bar
      >
        <Card className="voting-card card-shadow dark:bg-gray-800/70 dark:border-gray-700">
          <CardHeader className="relative">
            <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col items-center pt-8">
              <div 
                className="relative w-32 h-32 rounded-full group cursor-pointer"
                onClick={() => isEditing && fileInputRef.current?.click()}
                title={isEditing ? "Change profile picture" : ""}
              >
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-600 shadow-lg">
                  <AvatarImage src={profilePicturePreview || `https://avatar.vercel.sh/${currentUser.email}.png?size=128`} alt={currentUser.name} />
                  <AvatarFallback className="text-4xl bg-gray-200 dark:bg-gray-700 dark:text-gray-300">{currentUser.name.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePictureChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden"
                name="profilePictureFile" 
                disabled={!isEditing}
              />
              <CardTitle className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">{isEditing ? formData.name : currentUser.name}</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">{currentUser.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-semibold text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed" />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input id="email" name="email" type="email" value={formData.email} disabled className="mt-1 bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600 cursor-not-allowed" />
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email can be changed in Settings.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voterId" className="font-semibold text-gray-700 dark:text-gray-300">Voter ID</Label>
                  <Input id="voterId" name="voterId" value={formData.voterId} onChange={handleChange} disabled={!isEditing} className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
                <div>
                  <Label htmlFor="aadhar" className="font-semibold text-gray-700 dark:text-gray-300">Aadhaar Number</Label>
                  <Input id="aadhar" name="aadhar" value={isEditing ? formData.aadhar : (formData.aadhar ? `**** **** ${formData.aadhar.slice(-4)}` : 'N/A')} onChange={handleChange} disabled={!isEditing} className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed" />
                </div>
              </div>
              <div>
                <Label htmlFor="voterType" className="font-semibold text-gray-700 dark:text-gray-300">Voter Type</Label>
                 <select 
                  id="voterType" 
                  name="voterType" 
                  value={formData.voterType} 
                  onChange={handleChange} 
                  disabled={!isEditing} 
                  className="mt-1 w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed focus:ring-votesmart-blue-medium focus:border-votesmart-blue-medium"
                >
                  <option value="regular">Regular</option>
                  <option value="service">Service</option>
                  <option value="overseas">Overseas</option>
                </select>
              </div>
              
              {!isEditing && (
                <Button type="button" onClick={() => setIsEditing(true)} className="w-full btn-primary dark:btn-primary-dark">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </form>
            <div className="mt-6 p-4 bg-votesmart-blue-light/30 border border-votesmart-blue-medium/30 rounded-lg dark:bg-votesmart-blue-deep/20 dark:border-votesmart-blue-medium/40">
              <div className="flex items-center text-votesmart-blue-deep dark:text-votesmart-blue-light">
                <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium">Security Information</p>
              </div>
              <p className="text-xs text-votesmart-blue-deep/80 dark:text-votesmart-blue-light/80 mt-1">
                Your PIN and Biometric data (if enabled) are securely managed. For changes, please visit Security Settings. Public/Private keys are conceptual and managed by the system.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="sticky-save-bar flex space-x-3"
          >
            <Button type="button" onClick={handleSubmit} className="flex-1 btn-primary dark:btn-primary-dark">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1 btn-secondary dark:btn-secondary-dark">
              <XSquare className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default UserProfilePage;