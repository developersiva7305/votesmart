
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ElectionResults from '@/components/ElectionResults'; // This component shows chart results
import { Users } from 'lucide-react';

const ElectionVotesDisplay = ({ election, votes, searchTerm, getElectionResults, highlightedVoterId, onVoterClick }) => {
  const displayedVotes = useMemo(() => {
    return votes.filter(vote => 
      vote.voterInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.voterInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.electionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.candidateName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [votes, searchTerm]);

  if (!election) {
     return (
      <Card className="voting-card card-shadow max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">Recent Votes (All Elections)</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Showing last {displayedVotes.slice(0,10).length} votes cast across all elections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
        {displayedVotes.slice(0,10).length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No voter activity yet or matching search.</p>
            </div>
        ) : (
          displayedVotes.slice(0,10).map(vote => (
            <div key={vote.id} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{vote.voterInfo.name} <span className="text-xs text-gray-500 dark:text-gray-400">({vote.voterInfo.email})</span></p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Voted for <span className="font-medium">{vote.candidateName}</span> in "{vote.electionTitle}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">On: {new Date(vote.timestamp).toLocaleString()}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={vote.voterInfo.publicKey}>Key: {vote.voterInfo.publicKey?.substring(0,20)}...</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={vote.voteSignature}>Signature: {vote.voteSignature?.substring(0,20)}...</p>
            </div>
          )))}
        </CardContent>
      </Card>
    );
  }

  const electionSpecificVotes = displayedVotes.filter(v => v.electionId === election.id);
  const electionResultsData = getElectionResults(election.id); // Get results for the chart

  return (
    <>
      <ElectionResults
        election={election}
        resultsData={electionResultsData} 
        totalVotesCount={votes.filter(v => v.electionId === election.id).length}
      />
      <Card className="voting-card card-shadow max-h-[calc(100vh-600px)] overflow-y-auto custom-scrollbar mt-4">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-gray-100">Votes for "{election.title}"</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">List of casted votes for this election.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
        {electionSpecificVotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No votes cast yet for this specific election.</p>
            </div>
        ) : (
          electionSpecificVotes.map(vote => (
            <div 
              key={vote.id} 
              className={`p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 transition-all duration-500 ${highlightedVoterId === vote.voterInfo.id ? 'bg-yellow-100 dark:bg-yellow-700/50 border-yellow-400 dark:border-yellow-500 shadow-lg animate-pulse-fast' : ''}`}
              onClick={() => onVoterClick(vote.voterInfo.id)}
            >
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{vote.voterInfo.name} <span className="text-xs text-gray-500 dark:text-gray-400">({vote.voterInfo.email})</span></p>
              <p className="text-xs text-gray-600 dark:text-gray-300">Voted for <span className="font-medium">{vote.candidateName}</span></p>
              <p className="text-xs text-gray-400 dark:text-gray-500">On: {new Date(vote.timestamp).toLocaleString()}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={vote.voterInfo.publicKey}>Key: {vote.voterInfo.publicKey?.substring(0,20)}...</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={vote.voteSignature}>Signature: {vote.voteSignature?.substring(0,20)}...</p>
            </div>
          )))}
        </CardContent>
      </Card>
    </>
  );
};

export default ElectionVotesDisplay;
