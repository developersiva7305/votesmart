
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, BarChart3 } from 'lucide-react';

const ElectionListItem = ({ election, votes, onEdit, onDeleteTrigger, onViewResults, isPast }) => {
  const electionStatus = isPast 
    ? { text: 'Ended', bg: 'bg-gray-200 dark:bg-gray-600', textClr: 'text-gray-700 dark:text-gray-300' }
    : new Date(election.startDate) > new Date() 
    ? { text: 'Upcoming', bg: 'bg-yellow-100 dark:bg-yellow-700', textClr: 'text-yellow-700 dark:text-yellow-100' }
    : { text: 'Active', bg: 'bg-green-100 dark:bg-green-700', textClr: 'text-green-700 dark:text-green-100' };

  return (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
      <Card className={`voting-card card-shadow hover:shadow-xl transition-shadow ${isPast ? 'opacity-70' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-100">{election.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{election.description}</CardDescription>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${electionStatus.bg} ${electionStatus.textClr}`}>
                Status: {electionStatus.text}
              </span>
            </div>
            <div className="flex space-x-1">
              <Button onClick={() => onEdit(election)} variant="ghost" size="icon" className="text-votesmart-blue-medium hover:bg-votesmart-blue-light dark:text-blue-400 dark:hover:bg-blue-900/50">
                <Edit className="h-5 w-5" />
              </Button>
              <DialogTrigger asChild>
                <Button onClick={() => onDeleteTrigger(election)} variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Candidates: {election.candidates.length}</p>
              <p>Votes: {votes.filter(v => v.electionId === election.id).length}</p>
              <p>Starts: {new Date(election.startDate).toLocaleString()}</p>
              <p>Ends: {new Date(election.endDate).toLocaleString()}</p>
            </div>
            <Button onClick={() => onViewResults(election)} variant="outline" size="sm" className="btn-secondary dark:btn-secondary-dark">
              <BarChart3 className="mr-2 h-4 w-4" /> View Results & Votes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ElectionListItem;
