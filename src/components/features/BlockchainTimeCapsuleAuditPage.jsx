import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, Search, FileText, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CryptoJS from 'crypto-js';

const BlockchainTimeCapsuleAuditPage = ({ onBack, currentUser }) => {
  const [voteRecords, setVoteRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votesmart_votes')) || [];
    const userVotes = currentUser 
      ? storedVotes.filter(vote => vote.voterId === currentUser.id)
      : storedVotes; // Show all for admin/public view if no specific user

    const processedRecords = userVotes.map(vote => {
      const voteData = JSON.stringify({ electionId: vote.electionId, candidateId: vote.candidateId, timestamp: vote.timestamp, voterId: vote.voterId });
      return {
        ...vote,
        voteHash: CryptoJS.SHA256(voteData).toString(CryptoJS.enc.Hex),
        conceptualBlockId: `blk-${CryptoJS.SHA256(vote.id).toString(CryptoJS.enc.Hex).substring(0,8)}`,
      };
    });
    setVoteRecords(processedRecords);
  }, [currentUser]);

  const handleVerifyHash = (record) => {
    const currentVoteData = JSON.stringify({ electionId: record.electionId, candidateId: record.candidateId, timestamp: record.timestamp, voterId: record.voterId });
    const currentHash = CryptoJS.SHA256(currentVoteData).toString(CryptoJS.enc.Hex);
    if (currentHash === record.voteHash) {
      toast({ title: "Verification Successful!", description: `Vote hash matches. Data integrity confirmed for vote ID ${record.id.substring(0,8)}...`, className: "bg-green-500 text-white dark:bg-green-700" });
    } else {
      toast({ title: "Verification Failed!", description: `Vote hash mismatch for vote ID ${record.id.substring(0,8)}... Data may have been altered (conceptual).`, variant: "destructive" });
    }
  };
  
  const filteredRecords = voteRecords.filter(record => 
    record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.voteHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.conceptualBlockId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(5px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(5px)' }}
      className="min-h-screen bg-gradient-to-br from-gray-200 via-slate-100 to-stone-200 dark:from-gray-900 dark:via-slate-800 dark:to-stone-900 p-4 md:p-8 flex flex-col items-center"
    >
      <Card className="w-full max-w-4xl shadow-2xl dark:bg-gray-800">
        <CardHeader className="text-center relative border-b pb-4 dark:border-gray-700">
          <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ShieldCheck className="h-12 w-12 mx-auto text-gray-700 dark:text-gray-400 mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Blockchain Vote Audit Trail</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Verify the integrity of cast votes (conceptual blockchain).</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-500 dark:text-gray-400" />
            <input 
              type="text"
              placeholder="Search by Vote ID, Hash, or Block ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {filteredRecords.length > 0 ? filteredRecords.map(record => (
              <Card key={record.id} className="mb-3 dark:bg-gray-700/50 dark:border-gray-600">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <p className="text-sm font-semibold dark:text-gray-200">Vote ID: <span className="font-normal text-gray-600 dark:text-gray-400">{record.id.substring(0,12)}...</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400"><Clock className="inline h-3 w-3 mr-1"/> {new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-xs dark:text-gray-300 break-all"><strong>Vote Hash:</strong> {record.voteHash}</p>
                  <p className="text-xs dark:text-gray-300 mt-1"><strong>Conceptual Block ID:</strong> {record.conceptualBlockId}</p>
                  <Button onClick={() => handleVerifyHash(record)} size="sm" variant="outline" className="mt-3 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                    <ShieldCheck className="mr-1 h-4 w-4" /> Verify Integrity (Conceptual)
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No vote records found{searchTerm ? " for your search." : (currentUser ? " for your account." : ".")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </motion.div>
  );
};

export default BlockchainTimeCapsuleAuditPage;