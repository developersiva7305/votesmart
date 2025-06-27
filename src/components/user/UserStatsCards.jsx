
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const UserStatsCards = ({ presentElectionsCount, userVotesCount, upcomingElectionsCount }) => {
  const stats = [
    { title: "Active Elections", value: presentElectionsCount, icon: Calendar, color: "text-votesmart-blue-medium" },
    { title: "Your Votes Cast", value: userVotesCount, icon: CheckCircle, color: "text-votesmart-green-DEFAULT" },
    { title: "Upcoming Elections", value: upcomingElectionsCount, icon: Clock, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {stats.map((item, idx) => ( 
        <motion.div key={item.title + idx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 * idx }}>
          <Card className="voting-card card-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{item.value}</p>
                </div>
                <item.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default UserStatsCards;
