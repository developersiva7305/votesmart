
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Info, Globe, ArrowLeft, Search } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants.js';

const UserSidebar = ({ isMobileOpen, onClose, navigateTo, onToggleAIAssistant, searchTerm, onSearchTermChange, className = '' }) => {
  const navItems = [
    { label: "AI Assistant", icon: MessageCircle, action: onToggleAIAssistant },
    { label: "Contact Us", icon: Info, action: () => navigateTo(APP_VIEWS.CONTACT) },
    { label: "Overseas Voter Registration", icon: Globe, action: () => navigateTo(APP_VIEWS.OVERSEAS_REGISTRATION) },
  ];
  
  const mobileNavItems = [
    { label: "Back to Dashboard", icon: ArrowLeft, action: () => { onClose(); navigateTo(APP_VIEWS.DASHBOARD); } },
    ...navItems
  ];

  const content = (items, showSearch = false) => (
    <nav className="flex flex-col space-y-2 p-4">
       {showSearch && (
         <div className="mb-4 relative">
            <Input 
                type="search"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
       )}
      {items.map((item, index) => (
        <Button 
          key={index}
          variant="outline" 
          className="w-full justify-start text-left dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          onClick={item.action}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  if (isMobileOpen) {
    return (
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-50 md:hidden ${className}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {content(mobileNavItems, true)}
      </motion.div>
    );
  }

  return (
    <aside className={`w-64 bg-white dark:bg-gray-800 shadow-md flex-col space-y-4 ${className}`}>
      {content(navItems)}
    </aside>
  );
};

export default UserSidebar;
