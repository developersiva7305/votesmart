import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, CheckSquare, Users, BarChart3, ArrowRight, Globe, Info, Facebook, Twitter, Instagram, Youtube, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const APP_VIEWS = {
  CONTACT: 'contact',
  OVERSEAS_REGISTRATION: 'overseas_registration',
};

const IntroductionPage = ({ onGetStarted, navigateTo }) => {
  const handleFooterLinkClick = (e) => {
    e.preventDefault();
    toast({ title: "🚧 Feature not implemented!", description: "This link is for demonstration purposes." });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 relative overflow-hidden intro-gradient-bg text-white">
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
      >
        <img
          alt="Diverse group of Indian citizens participating in an election, showing enthusiasm and civic duty"
          className="w-full h-full object-cover"
          src="/vote1.jpeg" />
      </motion.div>

      <header className="z-10 w-full max-w-6xl mx-auto py-4 flex justify-end space-x-4">
        <Button variant="ghost" onClick={() => navigateTo(APP_VIEWS.CONTACT)} className="text-white hover:bg-white/10">
          <Info className="mr-2 h-4 w-4" /> Contact Us
        </Button>
        <Button variant="ghost" onClick={() => navigateTo(APP_VIEWS.OVERSEAS_REGISTRATION)} className="text-white hover:bg-white/10">
          <Globe className="mr-2 h-4 w-4" /> Overseas Voter
        </Button>
      </header>

      <motion.main
        className="z-10 flex flex-col items-center text-center max-w-4xl my-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 200, delay: 0.5 }}
        >
          <img
            alt="VoteSmart App Logo - A stylized ballot box with a secure digital lock icon and Indian flag colors"
            className="h-32 w-30 md:h-40 md:w-40 border border-gray-55 rounded-lg box-border"
            src="/vote1.jpeg" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
         <span className="intro-highlight-text"> Welcome to </span> VoteSmart
        </motion.h1>

        <motion.div
          className="text-lg md:text-xl mb-10 max-w-3xl text-blue-100 space-y-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.0 }}
        >
          <p>Revolutionizing democracy through secure, transparent, and accessible e-voting. VoteSmart empowers every citizen to make their voice heard with confidence and ease, leveraging cutting-edge technology to ensure the integrity of every ballot.</p>
          <p>Our platform offers a user-friendly interface for both voters and administrators, featuring robust security protocols, real-time AI assistance, and comprehensive election management tools. From creating elections to casting votes and viewing results, VoteSmart is designed for a seamless and trustworthy electoral process.</p>
          <p>Experience the future of voting: efficient, reliable, and inclusive. Join us in shaping a more engaged and digitally empowered democracy.</p>
        </motion.div>


        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <Button
            onClick={onGetStarted}
            className="px-10 py-6 text-xl font-semibold bg-white text-blue-600 hover:bg-blue-100 shadow-2xl transform hover:scale-105 transition-transform duration-300"
          >
            Get Started <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2, delayChildren: 1.5 } }
          }}
        >
          {[
            { icon: <Shield size={32} />, title: "Secure & Encrypted", description: "State-of-the-art security to protect your vote." },
            { icon: <CheckSquare size={32} />, title: "Easy to Use", description: "Intuitive interface for a seamless voting experience." },
            { icon: <Users size={32} />, title: "AI-Powered Assistance", description: "Get your election questions answered instantly." },
            { icon: <BarChart3 size={32} />, title: "Transparent Results", description: "Clear and verifiable election outcomes for all." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-200 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      <motion.footer
        className="z-10 w-full max-w-6xl mx-auto py-8 text-center text-blue-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      >
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" onClick={handleFooterLinkClick} className="hover:text-white"><Facebook size={20} /></a>
          <a href="#" onClick={handleFooterLinkClick} className="hover:text-white"><Twitter size={20} /></a>
          <a href="#" onClick={handleFooterLinkClick} className="hover:text-white"><Instagram size={20} /></a>
          <a href="#" onClick={handleFooterLinkClick} className="hover:text-white"><Youtube size={20} /></a>
        </div>
        <div className="mb-2">
          <a href="#" onClick={handleFooterLinkClick} className="hover:underline mx-2">Privacy Policy</a>|
          <a href="#" onClick={handleFooterLinkClick} className="hover:underline mx-2">Terms of Service</a>|
          <a href="#" onClick={handleFooterLinkClick} className="hover:underline mx-2">Voting Procedures</a>
        </div>
        <p>&copy; {new Date().getFullYear()} VoteSmart. All Rights Reserved.</p>
        <p>Empowering Democracy, One Vote at a Time.</p>
      </motion.footer>
    </div>
  );
};

export default IntroductionPage;