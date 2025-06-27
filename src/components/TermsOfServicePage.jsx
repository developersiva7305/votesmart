import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfServicePage = ({ onBack }) => {
  const termsSections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the VoteSmart e-voting application ('Application'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to all of these Terms, do not use this Application. We reserve the right to modify these Terms at any time. Your continued use of the Application after any such changes constitutes your acceptance of the new Terms."
    },
    {
      title: "2. Eligibility",
      content: "You must be a registered voter and meet all legal requirements for voting in your jurisdiction to use this Application for official voting purposes. You must provide accurate and complete information during registration and keep your account information updated."
    },
    {
      title: "3. User Account and Security",
      content: "You are responsible for maintaining the confidentiality of your account credentials, including your password, PIN, and any conceptual private keys associated with your account. You agree to notify us immediately of any unauthorized use of your account. VoteSmart is not liable for any loss or damage arising from your failure to comply with this security obligation. This prototype uses localStorage for data storage, which is not secure for production use."
    },
    {
      title: "4. Use of the Application",
      content: "You agree to use the Application only for lawful purposes and in accordance with these Terms. You agree not to: \n\n- Attempt to interfere with the proper functioning of the Application. \n- Use the Application in any way that could damage, disable, overburden, or impair the Application or interfere with any other party's use of the Application. \n- Attempt to gain unauthorized access to any part of the Application, other accounts, computer systems, or networks connected to the Application. \n- Engage in any activity that is fraudulent, abusive, or illegal."
    },
    {
      title: "5. Voting Process",
      content: "All votes cast through the Application are intended to be final. Once a vote is submitted, it cannot be changed or withdrawn. You are responsible for ensuring you have selected your intended choice before submitting your vote. The Application employs conceptual security measures to protect the integrity and anonymity of your vote."
    },
    {
      title: "6. Intellectual Property",
      content: "The Application and its original content, features, and functionality are and will remain the exclusive property of VoteSmart and its licensors. The Application is protected by copyright, trademark, and other laws of both the [Your Country/Jurisdiction] and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of VoteSmart."
    },
    {
      title: "7. Disclaimer of Warranties",
      content: "The Application is provided on an 'AS IS' and 'AS AVAILABLE' basis. VoteSmart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, VoteSmart does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Application or otherwise relating to such materials or on any sites linked to this Application. This prototype is for demonstration purposes only."
    },
    {
      title: "8. Limitation of Liability",
      content: "In no event shall VoteSmart or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Application, even if VoteSmart or a VoteSmart authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      title: "9. Termination",
      content: "We may terminate or suspend your access to the Application immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Application will immediately cease."
    },
    {
      title: "10. Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of [Your Country/Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
    },
    {
      title: "11. Contact Information",
      content: "If you have any questions about these Terms, please contact us at: \nVoteSmart Legal Team \nEmail: legal@votesmart.gov \nAddress: 123 Democracy Drive, Election City, EC 45678"
    }
  ];

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
              <FileText className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Terms of Service</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Please read these terms carefully.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {termsSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-base leading-relaxed">{section.content}</p>
              </motion.div>
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

export default TermsOfServicePage;