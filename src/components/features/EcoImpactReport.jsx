import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Droplets, TreeDeciduous } from 'lucide-react';

const EcoImpactReport = ({ currentUser, votes }) => {
  const [ecoStats, setEcoStats] = useState({ co2Saved: 0, paperSaved: 0, waterSaved: 0 });

  useEffect(() => {
    if (currentUser && votes) {
      const userVoteCount = votes.filter(vote => vote.voterId === currentUser.id).length;
      
      const co2PerVote = 0.1; // kg
      const paperPerVote = 2; // sheets
      const waterPerVote = 0.5; // liters (conceptual, for digital process vs paper)

      setEcoStats({
        co2Saved: (userVoteCount * co2PerVote).toFixed(2),
        paperSaved: userVoteCount * paperPerVote,
        waterSaved: (userVoteCount * waterPerVote).toFixed(1),
      });
    }
  }, [currentUser, votes]);

  if (!currentUser || !currentUser.settings?.ecoImpactEnabled) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6"
    >
      <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-green-700 dark:text-green-300 flex items-center">
            <Leaf className="mr-2 h-6 w-6" /> Your Eco Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <TreeDeciduous className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-1" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{ecoStats.co2Saved} kg</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CO₂ Saved (Est.)</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Leaf className="h-8 w-8 mx-auto text-lime-600 dark:text-lime-400 mb-1" />
            <p className="text-2xl font-bold text-lime-700 dark:text-lime-300">{ecoStats.paperSaved} sheets</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Paper Saved (Est.)</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Droplets className="h-8 w-8 mx-auto text-blue-500 dark:text-blue-400 mb-1" />
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{ecoStats.waterSaved} L</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Water Saved (Est.)</p>
          </div>
        </CardContent>
         <p className="text-xs text-center text-gray-500 dark:text-gray-400 pb-4 px-4">
            By voting digitally, you're helping the environment! These are conceptual estimations.
          </p>
      </Card>
    </motion.div>
  );
};

export default EcoImpactReport;