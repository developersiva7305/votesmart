
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, LayoutDashboard, ListChecks, Users, Settings, Bot, BarChart3, CalendarClock, Info } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants';

const AdminSidebar = ({ isMobileOpen, onClose, navigateTo, onToggleAIAssistant, onToggleAuditDashboard, onTogglePastElections, showPastElections, auditDashboardEnabled, className = "" }) => {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, view: APP_VIEWS.DASHBOARD },
    { label: "Elections", icon: ListChecks, action: onTogglePastElections, dynamicLabel: showPastElections ? "Current Elections" : "Past Elections" },
    ...(auditDashboardEnabled ? [{ label: "Audit Dashboard", icon: BarChart3, action: onToggleAuditDashboard }] : []),
    { label: "Voter Education", icon: Info, view: APP_VIEWS.VOTER_EDUCATION },
    { label: "AI Assistant", icon: Bot, action: onToggleAIAssistant },
    { label: "User Management (Conceptual)", icon: Users, view: null, disabled: true },
    { label: "Settings", icon: Settings, view: APP_VIEWS.SETTINGS },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 }
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
        {isMobileOpen && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-gray-500 dark:text-gray-400">
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start text-md p-3 ${item.disabled ? "text-gray-400 dark:text-gray-600 cursor-not-allowed" : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"}`}
            onClick={() => {
              if (item.disabled) {
                // Optionally show toast for disabled items
                // toast({ title: "Feature Coming Soon!", description: `${item.label} is under development.` });
                return;
              }
              if (item.view) navigateTo(item.view);
              if (item.action) item.action();
              if (isMobileOpen) onClose();
            }}
            disabled={item.disabled}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.dynamicLabel || item.label}
            {item.label === "Elections" && <CalendarClock className="ml-auto h-4 w-4 opacity-70"/>}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">VoteSmart Admin v1.0</p>
      </div>
    </div>
  );

  if (isMobileOpen) {
    return (
      <motion.aside
        initial="closed"
        animate="open"
        exit="closed"
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl md:hidden ${className}`}
      >
        {sidebarContent}
      </motion.aside>
    );
  }

  return (
     <aside className={`w-64 bg-white dark:bg-gray-800 shadow-lg ${className}`}>
      {sidebarContent}
    </aside>
  );
};

export default AdminSidebar;