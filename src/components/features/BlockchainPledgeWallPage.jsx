import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit3, Link as LinkIcon, ShieldCheck, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CryptoJS from 'crypto-js';

const BlockchainPledgeWallPage = ({ onBack, currentUser }) => {
  const [pledgeContent, setPledgeContent] = useState('');
  const [signedPledges, setSignedPledges] = useState([]);
  const [showPublicList, setShowPublicList] = useState(true);

  const userHash = currentUser ? CryptoJS.SHA256(currentUser.id.toString()).toString(CryptoJS.enc.Hex) : 'anonymous_pledger';
  const displayName = currentUser ? (currentUser.name || `User-${userHash.substring(0,6)}`) : 'Anonymous Pledger';

  useEffect(() => {
    const storedPledges = JSON.parse(localStorage.getItem('blockchain_pledges')) || [];
    setSignedPledges(storedPledges);
  }, []);

  useEffect(() => {
    localStorage.setItem('blockchain_pledges', JSON.stringify(signedPledges));
  }, [signedPledges]);

  const handleSignPledge = (e) => {
    e.preventDefault();
    if (!pledgeContent.trim()) {
      toast({ title: "Empty Pledge", description: "Cannot sign an empty pledge.", variant: "destructive" });
      return;
    }

    const timestamp = new Date().toISOString();
    const pledgeData = `${pledgeContent}-${timestamp}-${userHash}`;
    const pledgeHash = CryptoJS.SHA256(pledgeData).toString(CryptoJS.enc.Hex);

    const newPledge = {
      id: pledgeHash,
      userHash: userHash,
      displayName: displayName,
      content: pledgeContent,
      timestamp: timestamp,
      pledgeHash: pledgeHash, 
    };

    setSignedPledges(prevPledges => [newPledge, ...prevPledges]);
    setPledgeContent('');
    
    console.log("Conceptual Blockchain Store:", { pledgeHash, timestamp, userHash });
    toast({ 
      title: "Pledge Signed & Secured! (Conceptual)", 
      description: `Your pledge has been hashed and (conceptually) stored on the blockchain. Hash: ${pledgeHash.substring(0,16)}...`,
      duration: 7000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-sky-100 dark:from-gray-900 dark:via-teal-800 dark:to-sky-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-2xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <LinkIcon className="h-12 w-12 mx-auto text-teal-600 dark:text-teal-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Blockchain Pledge Wall</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Make your commitment, secured on a conceptual blockchain.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSignPledge} className="space-y-3">
            <Textarea 
              placeholder="Write your pledge for a better future, a fair election, or a personal commitment..."
              value={pledgeContent}
              onChange={(e) => setPledgeContent(e.target.value)}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600 min-h-[120px]"
            />
            <Button type="submit" className="w-full admin-gradient">
              <Edit3 className="mr-2 h-4 w-4" /> Sign Your Pledge
            </Button>
          </form>

          <div className="flex justify-between items-center pt-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Signed Pledges</h3>
            <Button variant="outline" size="sm" onClick={() => setShowPublicList(!showPublicList)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {showPublicList ? "Hide List" : "Show List"}
            </Button>
          </div>

          {showPublicList && (
            <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {signedPledges.length > 0 ? signedPledges.map(pledge => (
                <Card key={pledge.id} className="dark:bg-gray-700/50 dark:border-gray-600">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{pledge.content}</p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p><strong>By:</strong> {pledge.displayName}</p>
                      <p><strong>Timestamp:</strong> {new Date(pledge.timestamp).toLocaleString()}</p>
                      <p className="flex items-center"><ShieldCheck className="h-3 w-3 mr-1 text-green-500" /> <strong>Hash:</strong> {pledge.pledgeHash.substring(0,10)}...{pledge.pledgeHash.substring(pledge.pledgeHash.length - 10)}</p>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No pledges signed yet. Be the first!</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </motion.div>
  );
};

export default BlockchainPledgeWallPage;