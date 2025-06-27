import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const PrivacyPolicyPage = ({ onBack }) => {
  const policySections = [
    {
      title: "1. Introduction",
      content: "Welcome to VoteSmart's Privacy Policy. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our e-voting application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application."
    },
    {
      title: "2. Information We Collect",
      content: "We may collect information about you in a variety of ways. The information we may collect via the Application includes: \n\nPersonal Data: Personally identifiable information, such as your name, email address, Voter ID, Aadhar number, passport number (for overseas voters), country of residence, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application. \n\nSecurity Data: Information related to your security preferences, such as your chosen PIN (stored encrypted) and conceptual biometric data identifiers (if you opt-in). \n\nVoting Data: While your vote choice is anonymous, we collect metadata related to your voting activity, such as the election ID, a timestamp, and a conceptual digital signature to ensure vote integrity. Your actual vote is cryptographically separated from your identity in a production environment."
    },
    {
      title: "3. Use of Your Information",
      content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to: \n\n- Create and manage your account. \n- Enable your participation in elections. \n- Ensure the security and integrity of the voting process. \n- Notify you of relevant election information and updates (if you opt-in). \n- Compile anonymous statistical data and analysis for use internally or with third parties (e.g., election authorities for official reporting). \n- Fulfill and manage other requests, transactions, and other activities related to the Application."
    },
    {
      title: "4. Disclosure of Your Information",
      content: "We do not share your personal information with third parties except as described in this Privacy Policy or with your consent. We may share information we have collected about you in certain situations: \n\nBy Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. \n\nElection Authorities: Anonymized and aggregated voting data may be shared with official election authorities for verification and reporting purposes. Your personal vote choice will never be disclosed in a way that links it to your identity."
    },
    {
      title: "5. Security of Your Information",
      content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us (including conceptual use of encryption and key-pairs in this prototype), please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. All data in this prototype is stored in browser localStorage and is not suitable for a production environment."
    },
    {
      title: "6. Policy for Children",
      content: "We do not knowingly solicit information from or market to children under the age of 18 (or the legal voting age in the relevant jurisdiction). If you become aware of any data we have collected from children, please contact us using the contact information provided below."
    },
    {
      title: "7. Controls for Do-Not-Track Features",
      content: "Most web browsers and some mobile operating systems include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. Our application does not currently respond to DNT browser signals or mechanisms."
    },
    {
      title: "8. Your Privacy Rights",
      content: "You may at any time review or change the information in your account or terminate your account by: \n\n- Logging into your account settings and updating your account information. \n- Contacting us using the contact information provided. \n\nUpon your request to terminate your account, we will deactivate or delete your account and information from our active databases (conceptually, in this prototype, data is removed from localStorage). However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Service and/or comply with legal requirements."
    },
    {
      title: "9. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
    },
    {
      title: "10. Contact Us",
      content: "If you have questions or comments about this Privacy Policy, please contact us at: \nVoteSmart Support \nEmail: support@votesmart.gov \nAddress: 123 Democracy Drive, Election City, EC 45678"
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
              <ShieldCheck className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Privacy Policy</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">Your privacy is important to us.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {policySections.map((section, index) => (
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

export default PrivacyPolicyPage;