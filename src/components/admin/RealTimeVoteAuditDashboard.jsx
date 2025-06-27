
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, BarChart2, Users, Vote } from 'lucide-react';

const RealTimeVoteAuditDashboard = ({ votes, elections, onBack, currentUser }) => {
  // Simulated data for demonstration
  const totalVotes = votes.length;
  const verifiedVotes = Math.floor(totalVotes * 0.98); // 98% verified
  const rejectedVotes = totalVotes - verifiedVotes;
  const anomaliesDetected = Math.floor(totalVotes * 0.01); // 1% anomalies
  const activeElections = elections.filter(e => new Date(e.endDate) > new Date() && new Date(e.startDate) < new Date()).length;

  const auditLog = [
    { id: 1, timestamp: new Date().toISOString(), event: "Vote Cast", details: "Voter ID: usr_xxxx, Election: E001", status: "Verified" },
    { id: 2, timestamp: new Date(Date.now() - 50000).toISOString(), event: "Anomaly Detected", details: "Multiple vote attempts from IP 123.45.67.89", status: "Flagged" },
    { id: 3, timestamp: new Date(Date.now() - 120000).toISOString(), event: "Vote Cast", details: "Voter ID: usr_yyyy, Election: E001", status: "Verified" },
    { id: 4, timestamp: new Date(Date.now() - 300000).toISOString(), event: "Vote Rejected", details: "Invalid voter credentials for attempt on E002", status: "Rejected" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      variants={cardVariants}
      className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" className="dark:text-gray-200 dark:hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Admin Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Real-Time Vote Audit Dashboard</h1>
        </motion.div>

        <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Votes Cast", value: totalVotes, icon: Vote, color: "text-blue-500 dark:text-blue-400" },
            { title: "Verified Votes", value: verifiedVotes, icon: CheckCircle, color: "text-green-500 dark:text-green-400" },
            { title: "Rejected Votes", value: rejectedVotes, icon: AlertTriangle, color: "text-red-500 dark:text-red-400", variant: "destructive" },
            { title: "Anomalies Detected", value: anomaliesDetected, icon: AlertTriangle, color: "text-yellow-500 dark:text-yellow-400" },
          ].map((stat, index) => (
            <motion.div variants={itemVariants} key={index}>
              <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-gray-300">{stat.title}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.variant === "destructive" ? "text-red-600 dark:text-red-500" : "dark:text-white"}`}>{stat.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {index === 0 ? `${activeElections} active elections` : (index === 1 ? `${((verifiedVotes/totalVotes)*100||0).toFixed(1)}% of total` : `Updated in real-time`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <FileText className="mr-3 h-6 w-6 text-purple-500 dark:text-purple-400" />
                Conceptual Audit Log
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Showing recent (simulated) system events and vote activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
                <ul className="space-y-3">
                  {auditLog.map((log) => (
                    <motion.li
                      key={log.id}
                      variants={itemVariants}
                      className={`p-4 rounded-lg border ${
                        log.status === "Verified" ? "bg-green-50 border-green-200 dark:bg-green-800/30 dark:border-green-700" :
                        log.status === "Flagged" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-800/30 dark:border-yellow-700" :
                        "bg-red-50 border-red-200 dark:bg-red-800/30 dark:border-red-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold dark:text-gray-200">{log.event}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          log.status === "Verified" ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200" :
                          log.status === "Flagged" ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200" :
                          "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                        }`}>{log.status}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{log.details}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" className="w-full mt-6 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                Load More Logs (Conceptual)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
            Note: This dashboard provides a conceptual overview. Full functionality requires backend integration.
        </p>
      </div>
    </motion.div>
  );
};

export default RealTimeVoteAuditDashboard;
