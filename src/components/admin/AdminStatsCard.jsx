
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Vote, Users, CheckCircle, Calendar } from 'lucide-react';

const AdminStatsCard = ({ title, value, type, delay = 0 }) => {
  const getIcon = () => {
    switch (type) {
      case 'totalElections':
        return Calendar;
      case 'activeElections':
        return Vote;
      case 'totalVotes':
        return CheckCircle;
      case 'uniqueVoters':
        return Users;
      default:
        return Vote;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'totalElections':
        return 'text-votesmart-blue-medium';
      case 'activeElections':
        return 'text-votesmart-green-DEFAULT';
      case 'totalVotes':
        return 'text-votesmart-purple-DEFAULT';
      case 'uniqueVoters':
        return 'text-orange-500';
      default:
        return 'text-votesmart-blue-medium';
    }
  };

  const IconComponent = getIcon();
  const colorClass = getColor();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="voting-card card-shadow hover:shadow-xl transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
            </div>
            <IconComponent className={`h-10 w-10 sm:h-12 sm:w-12 ${colorClass}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminStatsCard;
