
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { X, Vote, User, FileText, Key, Bot } from 'lucide-react'; // Added Bot

const VotingModal = ({ election, onClose, onVote, currentUser, aiAssistantEnabled, onAskAI }) => { 
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSecurityKeyPrompt, setShowSecurityKeyPrompt] = useState(false);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleVoteConfirm = () => {
    if (!selectedCandidate) {
      toast({
        title: "No Candidate Selected",
        description: "Please select a candidate before voting",
        variant: "destructive"
      });
      return;
    }
    if (currentUser?.settings?.requireSecurityKeyForVoting) {
      setShowSecurityKeyPrompt(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleSecurityKeyContinue = () => {
    // Simulate WebAuthn get() call
    console.log("Simulating navigator.credentials.get() for voting...");
    toast({
      title: "Security Key (Simulated)",
      description: "Please tap your security key to confirm your vote.",
    });
    // In a real app, you'd await navigator.credentials.get() here
    // For simulation, proceed after a short delay
    setTimeout(() => {
      setShowSecurityKeyPrompt(false);
      setShowConfirmation(true);
      toast({
        title: "Security Key Verified (Simulated)",
        description: "Proceed to final vote confirmation.",
      });
    }, 1500);
  };

  const handleFinalVote = () => {
    onVote(election.id, selectedCandidate.id, `conceptual_vote_signature_${Date.now()}`);
  };

  if (showSecurityKeyPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="voting-card dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-xl dark:text-white">Security Key Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Key className="h-16 w-16 mx-auto text-blue-500 dark:text-blue-400 animate-pulse" />
              <p className="text-gray-700 dark:text-gray-300">
                To cast your vote for "{election.title}", please insert and tap your security key.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => { setShowSecurityKeyPrompt(false); setSelectedCandidate(null); }}
                  variant="outline"
                  className="flex-1 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSecurityKeyContinue}
                  className="flex-1 btn-primary dark:btn-primary-dark"
                >
                  Continue (Simulate Key Tap)
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }


  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="voting-card dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-center text-xl dark:text-white">Confirm Your Vote</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="font-semibold text-lg dark:text-blue-200">{election.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">You are voting for:</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-300 mt-1">{selectedCandidate.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedCandidate.position}</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-700/30 dark:border-yellow-600/50 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ This action cannot be undone. You can only vote once per election.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleFinalVote}
                  className="flex-1 success-gradient text-white"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Cast Vote
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="voting-card dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl gradient-text dark:text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{election.title}</CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{election.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              {aiAssistantEnabled && (
                <Button
                  onClick={onAskAI}
                  variant="outline"
                  size="sm"
                  className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Bot className="h-4 w-4 mr-2" /> Ask AI
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Select Your Candidate</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose one candidate to cast your vote</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {election.candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`cursor-pointer transition-all rounded-lg ${
                      selectedCandidate?.id === candidate.id
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:shadow-lg dark:hover:shadow-blue-500/20'
                    }`}
                    onClick={() => handleCandidateSelect(candidate)}
                  >
                    <Card className="h-full dark:bg-gray-700/50 dark:border-gray-600">
                      <CardContent className="p-6">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          
                          <div>
                            <h4 className="text-xl font-bold dark:text-gray-100">{candidate.name}</h4>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{candidate.position}</p>
                          </div>
                          
                          {candidate.manifesto && (
                            <div className="text-left">
                              <div className="flex items-center mb-2">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manifesto</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-600/50 p-3 rounded">
                                {candidate.manifesto}
                              </p>
                            </div>
                          )}
                          
                          <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                            selectedCandidate?.id === candidate.id
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300 dark:border-gray-500'
                          }`}>
                            {selectedCandidate?.id === candidate.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleVoteConfirm}
                  disabled={!selectedCandidate}
                  className="px-8 py-3 text-lg user-gradient text-white disabled:opacity-50"
                >
                  <Vote className="mr-2 h-5 w-5" />
                  Proceed to Vote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VotingModal;
