import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useElections = (initialElections = [], initialVotes = []) => {
  const [elections, setElections] = useState(initialElections);
  const [votesData, setVotesData] = useState(initialVotes); // Keep track of votes for results calculation

  useEffect(() => {
    localStorage.setItem('votesmart_elections', JSON.stringify(elections));
  }, [elections]);

  // Effect to update votesData when initialVotes change (e.g. on app load)
   useEffect(() => {
    const savedVotes = localStorage.getItem('votesmart_votes');
    if (savedVotes) {
      setVotesData(JSON.parse(savedVotes));
    }
  }, []);


  const addElection = useCallback((electionData) => {
    const newElection = {
      ...electionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Upcoming' 
    };
    setElections(prev => [...prev, newElection]);
    toast({
      title: "Election Created! 🗳️",
      description: `"${electionData.title}" has been scheduled.`,
    });
  }, [setElections]);

  const updateElection = useCallback((updatedElectionData) => {
    setElections(prevElections =>
      prevElections.map(election =>
        election.id === updatedElectionData.id ? { ...election, ...updatedElectionData } : election
      )
    );
    toast({
      title: "Election Updated! ⚙️",
      description: `"${updatedElectionData.title}" has been successfully updated.`,
    });
  }, [setElections]);

  const deleteElection = useCallback((electionId) => {
    const electionToDelete = elections.find(e => e.id === electionId);
    setElections(prev => prev.filter(e => e.id !== electionId));
    // Also remove votes associated with this election, affecting results
    const updatedVotes = votesData.filter(v => v.electionId !== electionId);
    setVotesData(updatedVotes);
    localStorage.setItem('votesmart_votes', JSON.stringify(updatedVotes));

    toast({
      title: "Election Deleted! 🗑️",
      description: `"${electionToDelete?.title}" and its votes have been removed.`,
      variant: "destructive"
    });
  }, [elections, votesData, setElections, setVotesData]);
  
  const getElectionResults = useCallback((electionId) => {
    const electionVotes = votesData.filter(v => v.electionId === electionId);
    const results = {};
    let winner = null;
    let maxVotes = -1;

    const election = elections.find(e => e.id === electionId);
    election?.candidates.forEach(candidate => {
      results[candidate.id] = 0;
    });

    electionVotes.forEach(vote => {
      if (results.hasOwnProperty(vote.candidateId)) {
        results[vote.candidateId]++;
      }
    });

    election?.candidates.forEach(candidate => {
      if (results[candidate.id] > maxVotes) {
        maxVotes = results[candidate.id];
        winner = candidate;
      } else if (results[candidate.id] === maxVotes && maxVotes !== 0) { // Handle ties, but not if all have 0 votes
        winner = null; 
      }
    });
    
    return { counts: results, winner };
  }, [elections, votesData]);


  return { elections, addElection, updateElection, deleteElection, getElectionResults, setElections };
};