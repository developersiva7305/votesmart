
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Vote, BarChart3, CheckCircle, History, ChevronsRight, Clock } from 'lucide-react';

const ElectionCard = ({ election, type, hasVoted, onInitiateVote, onViewResults }) => {
  const isPast = type === 'past';
  const isUpcoming = type === 'upcoming';
  const isPresent = type === 'present';
  const isHistory = type === 'history';

  let actionButton;
  if (isPast || (isPresent && hasVoted) || isHistory) {
      actionButton = (
          <Button onClick={() => onViewResults(election)} className="w-full bg-votesmart-purple-DEFAULT hover:bg-votesmart-purple-hover text-white">
            <BarChart3 className="mr-2 h-4 w-4" /> View Results
          </Button>
      );
  } else if (isPresent && !hasVoted) {
      actionButton = (
          <Button onClick={() => onInitiateVote(election)} className="w-full btn-primary dark:btn-primary-dark">
            <Vote className="mr-2 h-4 w-4" /> Cast Vote
          </Button>
      );
  } else if (isUpcoming) {
      actionButton = (
          <Button disabled className="w-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed">
            <Clock className="mr-2 h-4 w-4" /> Upcoming
          </Button>
      );
  }
  
  return (
    <motion.div key={election.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`voting-card card-shadow hover:shadow-xl transition-all h-full flex flex-col ${hasVoted && isPresent ? 'opacity-80 border-green-300 dark:border-green-700' : ''} ${isPast ? 'opacity-70' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">{election.title}</CardTitle>
            {isPresent && hasVoted && <CheckCircle className="h-6 w-6 text-votesmart-green-DEFAULT" />}
            {(isPast || isHistory) && <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
            {isUpcoming && <ChevronsRight className="h-5 w-5 text-orange-500" />}
          </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 truncate">{election.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>Candidates: {election.candidates.length}</p>
              <p>Starts: {new Date(election.startDate).toLocaleString()}</p>
              <p>Ends: {new Date(election.endDate).toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {election.candidates.slice(0, 2).map((candidate) => (
                <span key={candidate.id} className="px-2 py-0.5 bg-votesmart-blue-light text-votesmart-blue-deep rounded-full text-xs dark:bg-votesmart-blue-deep/30 dark:text-votesmart-blue-light">
                  {candidate.name}
                </span>
              ))}
              {election.candidates.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                  +{election.candidates.length - 2} more
                </span>
              )}
            </div>
          </div>
          {actionButton}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ElectionCard;
