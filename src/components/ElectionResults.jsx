import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Trophy, Users, ThumbsUp } from 'lucide-react';

const ElectionResults = ({ election, resultsData, totalVotesCount }) => {
  const { counts, winner: electionWinner } = resultsData;

  const candidatesWithVotes = election.candidates.map(candidate => ({
    ...candidate,
    votes: counts[candidate.id] || 0,
    percentage: totalVotesCount > 0 ? ((counts[candidate.id] || 0) / totalVotesCount * 100).toFixed(1) : 0
  })).sort((a, b) => b.votes - a.votes);


  const isElectionEnded = new Date(election.endDate) < new Date();

  return (
    <Card className="voting-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center text-xl mb-2 sm:mb-0">
            <BarChart3 className="mr-2 h-5 w-5" />
            {election.title} - Results
          </CardTitle>
          {isElectionEnded && electionWinner && (
            <motion.div 
              initial={{ opacity:0, scale:0.8 }} 
              animate={{ opacity:1, scale:1 }} 
              transition={{ delay: 0.5}}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
            >
              <Trophy className="mr-1 h-4 w-4" /> Winner: {electionWinner.name}
            </motion.div>
          )}
           {!isElectionEnded && (
            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
              Status: Ongoing
            </div>
          )}
        </div>
        <CardDescription className="flex items-center text-sm text-gray-600 mt-1">
          <Users className="mr-1 h-4 w-4" />
          Total Votes: {totalVotesCount}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {candidatesWithVotes.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              isElectionEnded && electionWinner?.id === candidate.id && totalVotesCount > 0 ? 'bg-yellow-50 border-yellow-300 shadow-lg' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {isElectionEnded && electionWinner?.id === candidate.id && totalVotesCount > 0 && (
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                <div>
                  <h4 className="font-semibold">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{candidate.votes}</p>
                <p className="text-sm text-gray-600">{candidate.percentage}%</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className={`h-2.5 rounded-full ${
                   isElectionEnded && electionWinner?.id === candidate.id && totalVotesCount > 0 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${candidate.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
        
        {totalVotesCount === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No votes cast yet for this election.</p>
          </div>
        )}
        
        {isElectionEnded && electionWinner && totalVotesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: candidatesWithVotes.length * 0.1 + 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-center shadow-xl"
          >
            <Trophy className="h-10 w-10 mx-auto mb-2" />
            <h3 className="text-xl font-bold">Election Winner Declared!</h3>
            <p className="text-2xl">{electionWinner.name}</p>
            <p className="text-md opacity-90">{electionWinner.votes} votes ({electionWinner.percentage}%)</p>
          </motion.div>
        )}
         {isElectionEnded && !electionWinner && totalVotesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: candidatesWithVotes.length * 0.1 + 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg text-center shadow-xl"
          >
            <ThumbsUp className="h-10 w-10 mx-auto mb-2" />
            <h3 className="text-xl font-bold">Election Ended - It's a Tie!</h3>
            <p className="text-md opacity-90">Multiple candidates have the same highest number of votes.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ElectionResults;