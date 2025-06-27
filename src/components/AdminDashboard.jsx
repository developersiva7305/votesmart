import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminStatsCard from '@/components/admin/AdminStatsCard';
import ElectionListItem from '@/components/admin/ElectionListItem';
import ElectionVotesDisplay from '@/components/admin/ElectionVotesDisplay';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CreateElectionModal from '@/components/CreateElectionModal';
import AIAssistant from '@/components/AIAssistant';
import RealTimeVoteAuditDashboard from '@/components/admin/RealTimeVoteAuditDashboard';
import { toast } from '@/components/ui/use-toast';
import { Plus, Vote, Search, Trash2, AlertTriangle, BarChart3 } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants';

const AdminDashboard = ({ 
  currentUser, 
  elections, 
  votes, 
  appUsers,
  onLogout, 
  onAddElection,
  onUpdateElection,
  onDeleteElection,
  getElectionResults,
  navigateTo
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [selectedElectionForResults, setSelectedElectionForResults] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAuditDashboard, setShowAuditDashboard] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPastElections, setShowPastElections] = useState(false);

  useEffect(() => {
    if (currentUser?.settings?.dynamicThreatDetectionEnabled) {
      toast({
        title: "🛡️ Dynamic Threat Detection (Conceptual)",
        description: "Monitoring for unusual activity. All systems nominal.",
        duration: 5000,
      });
      const threatTimer = setTimeout(() => {
        toast({
          title: "🚨 Conceptual Threat Alert!",
          description: "Unusual login pattern detected from IP range 192.168.X.X. Account activity flagged.",
          variant: "destructive",
          duration: 10000,
        });
      }, 15000);
      return () => clearTimeout(threatTimer);
    }
  }, [currentUser?.settings?.dynamicThreatDetectionEnabled]);

  const filteredElections = useMemo(() => {
    const now = new Date();
    return elections.filter(election => {
      const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            election.description.toLowerCase().includes(searchTerm.toLowerCase());
      const isPast = new Date(election.endDate) < now;
      return matchesSearch && (showPastElections ? isPast : !isPast);
    }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [elections, searchTerm, showPastElections]);

  const activeElectionsCount = elections.filter(e => {
    const now = new Date();
    const startDate = new Date(e.startDate);
    const endDate = new Date(e.endDate);
    return startDate <= now && endDate >= now;
  }).length;

  const totalVotesCount = votes.length;
  const totalVotersCount = new Set(votes.map(v => v.voterId)).size;

  const handleCreateOrEditElection = (electionData) => {
    if (editingElection) {
      onUpdateElection({ ...editingElection, ...electionData });
      setEditingElection(null);
      toast({ title: "Election Updated", description: `"${electionData.title}" has been successfully updated.` });
    } else {
      onAddElection(electionData);
      toast({ title: "Election Created", description: `"${electionData.title}" has been successfully created.` });
    }
    setShowCreateModal(false);
  };

  const handleEditElection = (election) => {
    setEditingElection(election);
    setShowCreateModal(true);
  };

  const handleViewResults = (election) => {
    setSelectedElectionForResults(election);
  };
  
  const confirmDeleteElectionAction = () => {
    if (electionToDelete && confirmDeleteInput === "CONFIRM") {
      onDeleteElection(electionToDelete.id);
      toast({ title: "Election Deleted", description: `"${electionToDelete.title}" and all its votes have been removed.`, variant: "destructive" });
      setElectionToDelete(null);
      setConfirmDeleteInput('');
      if (selectedElectionForResults?.id === electionToDelete.id) {
        setSelectedElectionForResults(null); 
      }
    } else if (confirmDeleteInput !== "CONFIRM") {
      toast({ title: "Confirmation Failed", description: "Please type CONFIRM to delete.", variant: "destructive" });
    }
  };

  const getVoterDetails = (voterId) => {
    const userKey = Object.keys(appUsers).find(userKey => appUsers[userKey].id === voterId);
    return userKey ? appUsers[userKey] : { name: 'Unknown Voter', email: 'N/A', publicKey: 'N/A', voteSignature: 'N/A' };
  };
  
  const electionVotesWithDetails = useMemo(() => {
    return votes.map(vote => ({
      ...vote,
      voterInfo: getVoterDetails(vote.voterId),
      electionTitle: elections.find(e => e.id === vote.electionId)?.title || 'N/A',
      candidateName: elections.find(e => e.id === vote.electionId)?.candidates.find(c => c.id === vote.candidateId)?.name || 'N/A'
    }));
  }, [votes, elections, appUsers]);


  const [highlightedVoterId, setHighlightedVoterId] = useState(null);
  useEffect(() => {
    if (selectedElectionForResults && highlightedVoterId) {
      const timer = setTimeout(() => setHighlightedVoterId(null), 2000); 
      return () => clearTimeout(timer);
    }
  }, [highlightedVoterId, selectedElectionForResults]);

  if (showAuditDashboard) {
    return <RealTimeVoteAuditDashboard 
              votes={electionVotesWithDetails} 
              elections={elections} 
              onBack={() => setShowAuditDashboard(false)} 
              currentUser={currentUser}
            />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-votesmart-gray-extralight dark:bg-darkBackground flex flex-col"
    >
      
      <AdminHeader 
        currentUser={currentUser} 
        onLogout={onLogout} 
        navigateTo={navigateTo}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      <AnimatePresence>
        {isMenuOpen && (
          <AdminSidebar 
            isMobileOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            navigateTo={navigateTo} 
            onToggleAIAssistant={() => {setShowAIAssistant(true); setIsMenuOpen(false);}}
            onToggleAuditDashboard={() => {setShowAuditDashboard(true); setIsMenuOpen(false);}}
            onTogglePastElections={() => {setShowPastElections(!showPastElections); setIsMenuOpen(false);}}
            showPastElections={showPastElections}
            auditDashboardEnabled={currentUser?.settings?.realTimeAuditDashboardEnabled}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar 
            isMobileOpen={false} 
            onClose={() => {}}
            navigateTo={navigateTo} 
            onToggleAIAssistant={() => setShowAIAssistant(true)}
            onToggleAuditDashboard={() => setShowAuditDashboard(true)}
            onTogglePastElections={() => setShowPastElections(!showPastElections)}
            showPastElections={showPastElections}
            className="hidden md:flex"
            auditDashboardEnabled={currentUser?.settings?.realTimeAuditDashboardEnabled}
          />
        
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <AdminStatsCard title="Total Elections" value={elections.length} type="totalElections" delay={0.1} />
            <AdminStatsCard title="Active Elections" value={activeElectionsCount} type="activeElections" delay={0.2} />
            <AdminStatsCard title="Total Votes Cast" value={totalVotesCount} type="totalVotes" delay={0.3} />
            <AdminStatsCard title="Unique Voters" value={totalVotersCount} type="uniqueVoters" delay={0.4} />
          </div>

          <div className="mb-6 relative">
            <Input 
              type="search"
              placeholder="Search elections by title, description or voter details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary dark:btn-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Election
            </Button>
            {currentUser?.settings?.realTimeAuditDashboardEnabled && (
              <Button
                onClick={() => setShowAuditDashboard(true)}
                variant="outline"
                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Audit Dashboard
              </Button>
            )}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {showPastElections ? "Past Elections" : "Current & Upcoming Elections"}
              </h2>
              <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                {filteredElections.length === 0 ? (
                  <div className="voting-card card-shadow p-6 text-center">
                    <Vote className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No {showPastElections ? "past" : "current or upcoming"} elections match your search or none created yet.</p>
                    {elections.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Create your first election to get started.</p>}
                  </div>
                ) : (
                  <Dialog>
                  {filteredElections.map((election) => (
                    <ElectionListItem 
                      key={election.id}
                      election={election}
                      votes={votes}
                      onEdit={handleEditElection}
                      onDeleteTrigger={setElectionToDelete}
                      onViewResults={handleViewResults}
                      isPast={new Date(election.endDate) < new Date()}
                    />
                  ))}
                  {electionToDelete && (
                      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground dark:bg-gray-800 dark:text-gray-200">
                        <DialogHeader>
                          <DialogTitle className="flex items-center text-xl text-destructive dark:text-red-400"><AlertTriangle className="h-6 w-6 mr-2" />Confirm Deletion</DialogTitle>
                          <DialogDescription className="text-muted-foreground dark:text-gray-400 pt-2">Are you sure you want to delete "{electionToDelete?.title}"? This action also removes all votes and cannot be undone. Type "CONFIRM" to proceed.</DialogDescription>
                        </DialogHeader>
                        <Input 
                          type="text"
                          placeholder='Type "CONFIRM"'
                          value={confirmDeleteInput}
                          onChange={(e) => setConfirmDeleteInput(e.target.value)}
                          className="my-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => {setElectionToDelete(null); setConfirmDeleteInput('');}} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
                          <Button onClick={confirmDeleteElectionAction} variant="destructive" disabled={confirmDeleteInput !== "CONFIRM"}><Trash2 className="mr-2 h-4 w-4" />Delete Election</Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedElectionForResults ? `Results: ${selectedElectionForResults.title}` : 'Recent Voter Activity'}
              </h2>
              <ElectionVotesDisplay 
                election={selectedElectionForResults}
                votes={electionVotesWithDetails}
                searchTerm={searchTerm}
                getElectionResults={getElectionResults}
                highlightedVoterId={highlightedVoterId}
                onVoterClick={setHighlightedVoterId}
              />
            </div>
          </div>
        </main>
      </div>
      
      {showCreateModal && (
        <CreateElectionModal
          onClose={() => { setShowCreateModal(false); setEditingElection(null); }}
          onSubmit={handleCreateOrEditElection}
          electionToEdit={editingElection}
        />
      )}

      {showAIAssistant && (
        <AIAssistant
          userRole="admin"
          onClose={() => setShowAIAssistant(false)}
        />
      )}
    </motion.div>
  );
};

export default AdminDashboard;
