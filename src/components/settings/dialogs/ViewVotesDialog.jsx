import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ViewVotesDialog = ({ votes, elections }) => {
  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader><DialogTitle className="dark:text-white">Your Voting Activity (Read-Only)</DialogTitle></DialogHeader>
      {votes && votes.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {votes.map(vote => {
            const election = elections.find(e => e.id === vote.electionId);
            return (
              <li key={vote.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <strong>{election ? election.title : "Unknown Election"}</strong> - Voted on: {new Date(vote.timestamp).toLocaleDateString()}
                <p className="text-xs text-gray-500 dark:text-gray-400">Conceptual Vote Receipt: {vote.voteSignature}</p>
              </li>
            );
          })}
        </ul>
      ) : <p className="dark:text-gray-400">You have not cast any votes yet.</p>}
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Close</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default ViewVotesDialog;