import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

const AIAssistant = ({ userRole, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your VoteSmart AI Assistant. I'm here to help you with ${
        userRole === 'admin' ? 'election management, voter analytics, and platform features' : 'voting questions, candidate information, and election details'
      }. How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const predefinedQuestions = userRole === 'admin' ? [
    "How do I create a new election?",
    "How can I view real-time voting results?",
    "What security measures are in place?",
    "How do I manage candidates?",
    "Can I export election results?"
  ] : [
    "How do I cast my vote?",
    "Can I change my vote after submitting?",
    "How do I know if my vote was recorded?",
    "What information is available about candidates?",
    "When do elections close?"
  ];

  const generateAIResponse = (question) => {
    const responses = {
      admin: {
        "How do I create a new election?": "To create a new election, click the 'Create New Election' button on your dashboard. Fill in the election details including title, description, start/end dates, and add candidates with their information. The election will be automatically activated for voters.",
        "How can I view real-time voting results?": "You can view real-time results by clicking 'View Results' on any active election card. The results show vote counts, percentages, and current leading candidates. Results update automatically as votes are cast.",
        "What security measures are in place?": "VoteSmart uses end-to-end encryption, one-vote-per-user validation, secure authentication, and tamper-proof vote recording. All votes are anonymized and stored securely with blockchain-level integrity.",
        "How do I manage candidates?": "When creating an election, you can add multiple candidates with their names, positions, and manifestos. You can add or remove candidates before the election starts. Each candidate gets a unique profile visible to voters.",
        "Can I export election results?": "Yes! Once an election is complete, you can export results in CSV or PDF format. The export includes detailed vote counts, percentages, timestamps, and candidate information for record-keeping."
      },
      user: {
        "How do I cast my vote?": "To vote, click 'Cast Vote' on any active election. Review the candidates and their information, select your preferred candidate, and confirm your choice. Your vote will be recorded securely and cannot be changed.",
        "Can I change my vote after submitting?": "No, votes cannot be changed once submitted. This ensures election integrity and prevents vote manipulation. Please review your choice carefully before confirming your vote.",
        "How do I know if my vote was recorded?": "After voting, you'll receive a confirmation message and see a 'Vote Cast' status on the election card. Your voting history is also available in your dashboard showing all elections you've participated in.",
        "What information is available about candidates?": "For each candidate, you can view their name, position they're running for, and their manifesto or campaign message. This information helps you make an informed voting decision.",
        "When do elections close?": "Each election has a specific end date and time set by the administrator. You can see the end date on each election card. Make sure to vote before the deadline as late votes cannot be accepted.",
        "How do I log in to vote?": "You must log in using your registered voter ID and a secure OTP (one-time password) sent to your registered mobile number or email.",
        "Is my vote anonymous?": "Yes, your vote is encrypted and stored securely. No one, not even the election administrator, can link your vote back to you.",
        "What should I do if I forget my password?": "Click “Change Password” on the settings page, then follow the steps to reset it using your registered mobile number or email.",
        "When does voting start and end?":"Voting begins at the scheduled start time announced by the election committee and ends automatically at the closing time. Check the “Election Timeline” section for exact dates.",
        "Who is eligible to vote?":"All registered voters listed in the verified voter list are eligible to vote. Check your status in the “Voter Status” section.",
        "What if I lose internet connection while voting?":"If your connection is lost before submitting, you can reconnect and continue where you left off. If it happens after submission, your vote is already recorded.",
        " The app is not loading. What should I do?":" Try refreshing the page or reopening the app. If the issue persists, contact support through the “Help & Support” section.",
        "Where can I see the candidates’ profiles?":"Go to the “Candidates” tab to view profiles, manifestos, and videos (if available) for each candidate.",
        "How do I know the live results?":"Visit the “View Results” section to see real-time vote counts and percentages for each candidate once the counting begins.",
        "How is my data protected?":"All your personal information is encrypted and stored securely according to government data protection laws.",
        " Will my personal data be shared with third parties?":" No. We never share your personal data with anyone outside the election authority.",
        " How can I contact the election administrator?":"Use the “Contact Support” feature or email the official support address listed under “Help & Support.”",
        " Is there any help if I face trouble voting?":"Yes. You can chat with this AI assistant anytime, or contact the live support team for urgent issues."
      }
    };

    const roleResponses = responses[userRole] || responses.user;
    return roleResponses[question] || "I understand your question, but I don't have a specific answer for that right now. Please contact the system administrator for more detailed assistance, or try asking about election procedures, voting process, or platform features.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage
    };

    const botResponse = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: generateAIResponse(inputMessage)
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');

    toast({
      title: "🤖 AI Response Generated",
      description: "I've provided an answer to your question!",
    });
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl h-[80vh] flex flex-col"
      >
        <Card className="voting-card h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">VoteSmart AI Assistant</CardTitle>
                <p className="text-sm text-gray-600">
                  {userRole === 'admin' ? 'Admin Support' : 'Voter Support'}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="border-t p-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Quick Questions
                </h4>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-2">
                  {predefinedQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
              </div>
              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about VoteSmart..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AIAssistant;