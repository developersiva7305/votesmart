import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Shield, Info, FileText, MessageSquare as MessageSquareQuestion, Phone } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants';

const Footer = ({ navigateTo }) => {
  const socialLinks = [
    { icon: Facebook, href: "https://example.com/facebook", label: "Facebook" },
    { icon: Twitter, href: "https://example.com/twitter", label: "Twitter" },
    { icon: Instagram, href: "https://example.com/instagram", label: "Instagram" },
    { icon: Youtube, href: "https://example.com/youtube", label: "YouTube" },
  ];

  const quickLinks = [
    { label: "Voting Procedures", view: APP_VIEWS.VOTING_PROCEDURES, icon: Info },
    { label: "Privacy Policy", view: APP_VIEWS.PRIVACY_POLICY, icon: Shield },
    { label: "Terms of Service", view: APP_VIEWS.TERMS, icon: FileText },
    { label: "FAQ", view: APP_VIEWS.FAQ, icon: MessageSquareQuestion },
    { label: "Contact Support", view: APP_VIEWS.CONTACT, icon: Phone },
  ];

  const handleNavigation = (view) => {
    if (navigateTo) {
      navigateTo(view);
    }
  };
  
  const handleExternalLink = (e, href) => {
    e.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
  };


  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-gray-400"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="text-lg font-semibold text-white dark:text-gray-100 mb-3">VoteSmart</h5>
            <p className="text-sm">Secure, Transparent, and Intelligent E-Voting. Empowering democracy, one vote at a time.</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white dark:text-gray-100 mb-3">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => handleNavigation(link.view)} className="text-sm hover:text-white dark:hover:text-gray-200 transition-colors flex items-center text-left w-full">
                    {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white dark:text-gray-100 mb-3">Connect With Us</h5>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  onClick={(e) => handleExternalLink(e, social.href)}
                  aria-label={social.label}
                  className="hover:text-white dark:hover:text-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
             <p className="text-sm mt-4">
              Stay updated with the latest news and announcements.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 dark:border-gray-600 pt-8 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} VoteSmart. All Rights Reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;