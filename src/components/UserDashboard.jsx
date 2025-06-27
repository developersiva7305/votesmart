
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserHeader from '@/components/user/UserHeader';
import UserSidebar from '@/components/user/UserSidebar';
import UserStatsCards from '@/components/user/UserStatsCards';
import ElectionCard from '@/components/user/ElectionCard';
import VotingModal from '@/components/VotingModal';
import AIAssistant from '@/components/AIAssistant';
import ElectionResults from '@/components/ElectionResults';
import WellbeingCheckModal from '@/components/features/WellbeingCheckModal';
import EcoImpactReport from '@/components/features/EcoImpactReport';
import VoteDNASealProcess from '@/components/features/VoteDNASealProcess';
import { Dialog, DialogContent as ShadDialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Calendar, ChevronsRight, History, ListChecks, Search, Vote, QrCode, Bot } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants.js';

const UserDashboard = ({ 
  currentUser, 
  elections, 
  votes, 
  onLogout, 
  onCastVote,
  getElectionResults,
  navigateTo
}) => {
  const [selectedElectionToVote, setSelectedElectionToVote] = useState(null);
  const [selectedElectionToViewResults, setSelectedElectionToViewResults] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState("present");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWellbeingModal, setShowWellbeingModal] = useState(false);
  const [showVoteDNASealModal, setShowVoteDNASealModal] = useState(false);
  const [voteDataForSeal, setVoteDataForSeal] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentVoteReceipt, setCurrentVoteReceipt] = useState('');


  const userVotes = useMemo(() => {
    if (!currentUser) return [];
    return votes.filter(v => v.voterId === currentUser.id);
  }, [votes, currentUser]);

  const votedElectionIds = useMemo(() => new Set(userVotes.map(v => v.electionId)), [userVotes]);

  const { pastElections, presentElections, upcomingElections, allUserParticipatedElections } = useMemo(() => {
    const now = new Date();
    const past = [];
    const present = [];
    const upcoming = [];
    const participated = [];

    elections.forEach(election => {
      const startDate = new Date(election.startDate);
      const endDate = new Date(election.endDate);

      if (endDate < now) {
        past.push(election);
      } else if (startDate <= now && endDate >= now) {
        present.push(election);
      } else if (startDate > now) {
        upcoming.push(election);
      }
      if (votedElectionIds.has(election.id)){
        participated.push(election);
      }
    });
    
    const sortByEndDateDesc = (a, b) => new Date(b.endDate) - new Date(a.endDate);
    const sortByStartDateAsc = (a, b) => new Date(a.startDate) - new Date(b.startDate);

    past.sort(sortByEndDateDesc);
    present.sort(sortByEndDateDesc);
    upcoming.sort(sortByStartDateAsc);
    participated.sort(sortByEndDateDesc);

    return { 
      pastElections: past, 
      presentElections: present, 
      upcomingElections: upcoming,
      allUserParticipatedElections: participated 
    };
  }, [elections, votedElectionIds]);
  
  const filteredElections = (electionList) => {
    if (!searchTerm) return electionList;
    return electionList.filter(election =>
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.candidates.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredUserVotes = useMemo(() => {
    if (!searchTerm) return allUserParticipatedElections;
    return allUserParticipatedElections.filter(election => 
      election.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUserParticipatedElections, searchTerm]);


  const handleInitiateVote = (election) => {
    if (currentUser?.settings?.wellbeingCheckEnabled) {
      setSelectedElectionToVote(election);
      setShowWellbeingModal(true);
    } else {
      setSelectedElectionToVote(election); 
    }
  };

  const handleWellbeingContinue = () => {
    setShowWellbeingModal(false);
  };
  
  const handleWellbeingSeekInfo = () => {
    setShowWellbeingModal(false);
    setSelectedElectionToVote(null); 
    navigateTo(APP_VIEWS.VOTER_EDUCATION); 
  };

  const handleVoteSubmit = (electionId, candidateId, voteSignature) => {
    const success = onCastVote(electionId, candidateId, voteSignature);
    if (success) {
      setSelectedElectionToVote(null);
      setShowVoteDNASealModal(false);
      const receipt = typeof voteSignature === 'string' && voteSignature ? voteSignature : `vote_receipt_${Date.now()}`;
      setCurrentVoteReceipt(receipt);
      setShowQRModal(true);
      toast({ title: "Vote Cast Successfully!", description: "Your vote has been securely recorded."});
    } else {
      toast({ title: "Vote Casting Failed", description: "There was an issue recording your vote. Please try again.", variant: "destructive" });
    }
  };

  const handleVoteFromModal = (electionId, candidateId, voteSignature) => {
    if (currentUser?.settings?.voteDNASealEnabled) {
      setVoteDataForSeal({ electionId, candidateId, voterId: currentUser.id, timestamp: new Date().toISOString(), voteSignature });
      setShowVoteDNASealModal(true);
      setSelectedElectionToVote(null); 
    } else {
      handleVoteSubmit(electionId, candidateId, voteSignature);
    }
  };

  const handleDNASealComplete = (sealedVoteData) => {
    if (voteDataForSeal) {
      const signature = sealedVoteData?.voteSignature || voteDataForSeal?.voteSignature;
      handleVoteSubmit(voteDataForSeal.electionId, voteDataForSeal.candidateId, signature);
    }
  };


  const handleViewResults = (election) => {
    setSelectedElectionToViewResults(election);
  };
  
  const renderElectionList = (electionList, type, emptyMessage) => {
    const displayList = filteredElections(electionList);
    if (!currentUser) return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading user data...</p>;
    if (displayList.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <Vote className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{searchTerm ? `No elections match your search "${searchTerm}".` : emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {displayList.map(election => 
            <ElectionCard 
                key={election.id} 
                election={election} 
                type={type}
                hasVoted={votedElectionIds.has(election.id)} 
                onInitiateVote={handleInitiateVote}
                onViewResults={handleViewResults}
                aiAssistantEnabled={currentUser?.settings?.aiVoteAssistantEnabled}
                onAskAI={() => setShowAIAssistant(true)}
            />
        )}
      </div>
    );
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-votesmart-gray-extralight dark:bg-darkBackground flex flex-col">
      <UserHeader 
        currentUser={currentUser}
        onLogout={onLogout}
        navigateTo={navigateTo}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onToggleAIAssistant={() => setShowAIAssistant(true)}
      />
      
      <AnimatePresence>
        {isMenuOpen && (
          <UserSidebar
            isMobileOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            navigateTo={navigateTo}
            onToggleAIAssistant={() => {setShowAIAssistant(true); setIsMenuOpen(false);}}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        <UserSidebar
            isMobileOpen={false}
            onClose={() => {}}
            navigateTo={navigateTo}
            onToggleAIAssistant={() => setShowAIAssistant(true)}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            className="hidden md:flex"
          />

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <UserStatsCards 
                presentElectionsCount={presentElections.length}
                userVotesCount={userVotes.length}
                upcomingElectionsCount={upcomingElections.length}
            />
            
            <div className="md:hidden mb-6 relative">
                 <Input 
                    type="search"
                    placeholder="Search elections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>

            {currentUser?.settings?.ecoImpactEnabled && <EcoImpactReport currentUser={currentUser} votes={votes} />}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-card/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg p-1 mb-6">
                <TabsTrigger value="present" className="data-[state=active]:bg-votesmart-blue-medium data-[state=active]:text-white dark:data-[state=active]:bg-votesmart-blue-medium"><Calendar className="mr-1 sm:mr-2 h-4 w-4"/>Present</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:data-[state=active]:bg-orange-600"><ChevronsRight className="mr-1 sm:mr-2 h-4 w-4"/>Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white dark:data-[state=active]:bg-gray-600"><History className="mr-1 sm:mr-2 h-4 w-4"/>Past</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-votesmart-purple-DEFAULT data-[state=active]:text-white dark:data-[state=active]:bg-votesmart-purple-hover"><ListChecks className="mr-1 sm:mr-2 h-4 w-4"/>My History</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <TabsContent value="present">{renderElectionList(presentElections, 'present', "No active elections right now.")}</TabsContent>
                <TabsContent value="upcoming">{renderElectionList(upcomingElections, 'upcoming', "No upcoming elections scheduled.")}</TabsContent>
                <TabsContent value="past">{renderElectionList(pastElections, 'past', "No past elections found.")}</TabsContent>
                <TabsContent value="history">{renderElectionList(filteredUserVotes, 'history', "You haven't participated in any elections yet, or no elections match your search.")}</TabsContent>
                </motion.div>
            </AnimatePresence>
            </Tabs>

            <Dialog open={!!selectedElectionToViewResults} onOpenChange={() => setSelectedElectionToViewResults(null)}>
                <ShadDialogContent className="max-w-2xl p-0 dark:bg-gray-800">
                    {selectedElectionToViewResults && (
                        <ElectionResults
                            election={selectedElectionToViewResults}
                            resultsData={getElectionResults(selectedElectionToViewResults.id)}
                            totalVotesCount={votes.filter(v => v.electionId === selectedElectionToViewResults.id).length}
                        />
                    )}
                </ShadDialogContent>
            </Dialog>

            <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
              <ShadDialogContent className="dark:bg-gray-800 dark:text-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-center dark:text-white">Vote Confirmed!</DialogTitle>
                  <DialogDescription className="text-center dark:text-gray-400">
                    Your vote has been securely cast. Here's your conceptual QR code receipt.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6">
                  <QrCode className="h-32 w-32 text-gray-700 dark:text-gray-300 mb-4" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                    Receipt ID (Conceptual): {(currentVoteReceipt || '').substring(0,32)}...
                  </p>
                  <Button onClick={() => setShowQRModal(false)} className="mt-6 btn-primary dark:btn-primary-dark">Close</Button>
                </div>
              </ShadDialogContent>
            </Dialog>
        </main>
      </div>

      {selectedElectionToVote && !showWellbeingModal && !showVoteDNASealModal && (<VotingModal election={selectedElectionToVote} onClose={() => setSelectedElectionToVote(null)} onVote={handleVoteFromModal} currentUser={currentUser} aiAssistantEnabled={currentUser?.settings?.aiVoteAssistantEnabled} onAskAI={() => setShowAIAssistant(true)} /> )}
      {currentUser?.settings?.wellbeingCheckEnabled && <WellbeingCheckModal isOpen={showWellbeingModal} onOpenChange={setShowWellbeingModal} onContinueVoting={handleWellbeingContinue} onSeekInfo={handleWellbeingSeekInfo} />}
      {currentUser?.settings?.voteDNASealEnabled && <VoteDNASealProcess isOpen={showVoteDNASealModal} onOpenChange={setShowVoteDNASealModal} voteData={voteDataForSeal} onSealComplete={handleDNASealComplete} />}
      {showAIAssistant && (<AIAssistant userRole="user" onClose={() => setShowAIAssistant(false)} />)}
    </motion.div>
  );
};

export default UserDashboard;
