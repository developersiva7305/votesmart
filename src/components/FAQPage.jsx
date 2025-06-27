import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div 
      className="border-b border-gray-200 dark:border-gray-700"
      layout
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 px-1 text-left text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none"
      >
        <span className="font-medium text-lg">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const FAQPage = ({ onBack }) => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "1. What is VoteSmart?",
      answer: "VoteSmart is a modern, secure, and user-friendly electronic voting application designed to make the election process more accessible, transparent, and efficient. It allows registered voters to cast their votes digitally from anywhere with an internet connection."
    },
    {
      question: "2. How do I register to vote on VoteSmart?",
      answer: "You can register through the app by providing necessary details like your name, email, Voter ID, and Aadhar number. For overseas voters, passport details are required. The system also incorporates conceptual security measures like PIN and biometric authentication setup during registration."
    },
    {
      question: "3. Is my vote secure and anonymous?",
      answer: "Yes, VoteSmart is designed with security and anonymity as top priorities. We use conceptual end-to-end encryption and digital signatures. While this prototype uses localStorage, a production version would employ advanced cryptographic techniques like mix-nets or homomorphic encryption to ensure vote secrecy and unlinkability."
    },
    {
      question: "4. How does the key-based security system work?",
      answer: "Conceptually, upon registration, a unique public-private key pair is generated. Your private key (stored on your device conceptually) signs your vote, and the election authority's public key encrypts it. This ensures authenticity and confidentiality. This prototype simulates this by creating placeholder key data."
    },
    {
      question: "5. Can I vote if I am an overseas citizen?",
      answer: "Yes, VoteSmart provides a specific registration path for overseas voters, allowing them to participate in elections relevant to them by providing their passport and country of residence details."
    },
    {
      question: "6. How are election results determined and announced?",
      answer: "Once an election period ends, votes are tallied automatically. The results, including the winner, are displayed on both the Admin Dashboard (for officials) and the User Dashboard (for voters). The system ensures transparency in vote counting."
    },
    {
      question: "7. Can I change my vote after casting it?",
      answer: "No, once a vote is cast and confirmed, it cannot be changed. This is to ensure the integrity and finality of the voting process, similar to traditional paper-based voting."
    },
    {
      question: "8. What if I forget my password or PIN?",
      answer: "The app includes options to reset your password and manage your PIN through secure verification processes. These are found in the Settings section after logging in."
    },
    {
      question: "9. How can I be sure my vote was counted?",
      answer: "Conceptually, the system would provide a unique, non-traceable receipt (a hash) for each vote. Voters could use this receipt to verify that their vote is included in the final tally on a public, auditable ledger (like a blockchain) without revealing their identity or choice. This prototype shows voting history for transparency."
    },
    {
      question: "10. Who can I contact for support?",
      answer: "You can reach out to our support team via the 'Contact Us' page within the app. It provides a contact form and email details. We aim to respond within 24-48 hours."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex flex-col items-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-xl border-none dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="relative pb-4 border-b dark:border-gray-700">
            <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center pt-8">
              <HelpCircle className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Find answers to common questions about VoteSmart.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </CardContent>
        </Card>
      </motion.div>
       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #aaa; }
        .dark .custom-scrollbar::-webkit-scrollbar-track { background: #374151; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #6b7280; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default FAQPage;