import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Archive, Lock, Unlock, CalendarDays } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CryptoJS from 'crypto-js';

const TimeCapsuleMessagePage = ({ onBack, currentUser }) => {
  const [messageContent, setMessageContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [decryptedMessages, setDecryptedMessages] = useState({});
  const [decryptionKey, setDecryptionKey] = useState({});

  const userHash = currentUser ? CryptoJS.SHA256(currentUser.id.toString()).toString(CryptoJS.enc.Hex) : 'anonymous_user';

  useEffect(() => {
    const storedCapsules = JSON.parse(localStorage.getItem(`timeCapsules_${userHash}`)) || [];
    setTimeCapsules(storedCapsules);
  }, [userHash]);

  useEffect(() => {
    localStorage.setItem(`timeCapsules_${userHash}`, JSON.stringify(timeCapsules));
  }, [timeCapsules, userHash]);

  const handleEncryptAndStore = (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !unlockDate || !secretKey.trim()) {
      toast({ title: "Missing Information", description: "Please fill message, unlock date, and a secret key.", variant: "destructive" });
      return;
    }
    if (new Date(unlockDate) <= new Date()) {
      toast({ title: "Invalid Date", description: "Unlock date must be in the future.", variant: "destructive" });
      return;
    }

    try {
      const encryptedMessage = CryptoJS.AES.encrypt(messageContent, secretKey).toString();
      const newCapsule = {
        id: Date.now().toString(),
        userHash: userHash,
        encryptedMessage: encryptedMessage,
        unlockDate: unlockDate,
        createdAt: new Date().toISOString(),
        isUnlocked: false,
      };
      setTimeCapsules(prevCapsules => [newCapsule, ...prevCapsules]);
      setMessageContent('');
      setUnlockDate('');
      setSecretKey('');
      toast({ title: "Time Capsule Sealed!", description: "Your message is encrypted and stored. Remember your secret key!" });
    } catch (error) {
      console.error("Encryption error:", error);
      toast({ title: "Encryption Failed", description: "Could not encrypt your message. Try a different key.", variant: "destructive" });
    }
  };

  const handleDecryptMessage = (capsuleId) => {
    const capsule = timeCapsules.find(c => c.id === capsuleId);
    const key = decryptionKey[capsuleId];
    if (!capsule || !key) {
      toast({ title: "Missing Key", description: "Please enter the secret key to decrypt.", variant: "destructive" });
      return;
    }
    if (!capsule.isUnlocked && new Date(capsule.unlockDate) > new Date()) {
        toast({ title: "Not Yet Time", description: `This message can only be unlocked after ${new Date(capsule.unlockDate).toLocaleDateString()}.`, variant: "destructive" });
        return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(capsule.encryptedMessage, key);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (!originalText) throw new Error("Decryption failed, likely wrong key.");
      setDecryptedMessages(prev => ({ ...prev, [capsuleId]: originalText }));
      setTimeCapsules(prev => prev.map(c => c.id === capsuleId ? {...c, isUnlocked: true} : c));
      toast({ title: "Message Unlocked!", description: "You can now read your time capsule message." });
    } catch (error) {
      console.error("Decryption error:", error);
      setDecryptedMessages(prev => ({ ...prev, [capsuleId]: "Error: Decryption failed. Invalid key or corrupted message." }));
      toast({ title: "Decryption Failed", description: "Invalid secret key or message corrupted.", variant: "destructive" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-yellow-800 dark:to-orange-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-2xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Archive className="h-12 w-12 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Time Capsule Message</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Leave an encrypted message for your future self.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleEncryptAndStore} className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold dark:text-gray-200">Create New Time Capsule</h3>
            <Textarea 
              placeholder="Write your message to the future..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[100px]"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="date" 
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:[color-scheme:dark]"
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Minimum tomorrow
              />
              <Input 
                type="password"
                placeholder="Secret Key (remember this!)"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <Button type="submit" className="w-full admin-gradient">
              <Lock className="mr-2 h-4 w-4" /> Encrypt & Store Message
            </Button>
          </form>

          <div className="pt-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Your Time Capsules</h3>
            {timeCapsules.length > 0 ? (
              <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {timeCapsules.map(capsule => (
                  <Card key={capsule.id} className="dark:bg-gray-700/50 dark:border-gray-600">
                    <CardContent className="p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created: {new Date(capsule.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm font-medium dark:text-gray-300">
                        <CalendarDays className="inline h-4 w-4 mr-1"/> Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}
                      </p>
                      {decryptedMessages[capsule.id] ? (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded">
                           <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">{decryptedMessages[capsule.id]}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Encrypted Message: {capsule.encryptedMessage.substring(0,30)}...</p>
                          {new Date(capsule.unlockDate) <= new Date() || capsule.isUnlocked ? (
                            <div className="mt-2 flex gap-2">
                              <Input 
                                type="password"
                                placeholder="Enter Secret Key"
                                value={decryptionKey[capsule.id] || ''}
                                onChange={(e) => setDecryptionKey(prev => ({...prev, [capsule.id]: e.target.value}))}
                                className="text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
                              />
                              <Button onClick={() => handleDecryptMessage(capsule.id)} size="sm" variant="outline" className="dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                                <Unlock className="mr-1 h-4 w-4" /> Decrypt
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Locked until unlock date.</p>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No time capsules created yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #a16207; } /* dark yellow */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ca8a04; }
      `}</style>
    </motion.div>
  );
};

export default TimeCapsuleMessagePage;