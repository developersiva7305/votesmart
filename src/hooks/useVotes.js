import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useVotes = (initialVotes = [], currentUser, elections) => {
  const [votes, setVotes] = useState(initialVotes);

  useEffect(() => {
    localStorage.setItem('votesmart_votes', JSON.stringify(votes));
  }, [votes]);

  const castVote = useCallback((electionId, candidateId) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to cast your vote.",
        variant: "destructive"
      });
      return false;
    }

    const election = elections.find(e => e.id === electionId);
    if (!election) {
        toast({ title: "Error", description: "Election not found.", variant: "destructive"});
        return false;
    }
    
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) {
        toast({ title: "Election Not Started", description: "This election has not started yet.", variant: "destructive"});
        return false;
    }
    if (now > endDate) {
        toast({ title: "Election Ended", description: "This election has already ended.", variant: "destructive"});
        return false;
    }

    const existingVote = votes.find(v => v.electionId === electionId && v.voterId === currentUser.id);
    if (existingVote) {
      toast({
        title: "Already Voted! ⚠️",
        description: "You have already cast your vote for this election.",
        variant: "destructive"
      });
      return false;
    }

    const newVote = {
      id: Date.now().toString(),
      electionId,
      candidateId,
      voterId: currentUser.id,
      voterName: currentUser.name,
      voterEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      voteSignature: `signed_vote_${Date.now()}`
    };

    setVotes(prev => [...prev, newVote]);
    toast({
      title: "Vote Cast Successfully! ✅",
      description: "Your vote has been recorded securely.",
    });
    return true;
  }, [currentUser, votes, elections, setVotes]);

  return { votes, castVote, setVotes };
};