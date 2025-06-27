import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const LoginHistoryDialog = ({ loginHistory }) => {
  const historyToDisplay = loginHistory && loginHistory.length > 0 ? loginHistory : [
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), event: "Conceptual Login - Desktop Chrome, New York" },
    { timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), event: "Conceptual Login - Mobile Safari, London" },
  ];

  return (
    <DialogContent className="dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader><DialogTitle className="dark:text-white">Login History</DialogTitle></DialogHeader>
      <p className="dark:text-gray-400">You have logged in {historyToDisplay.length} times.</p>
      <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {historyToDisplay.map((item, i) => (
          <li key={i} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
            {new Date(item.timestamp).toLocaleString()} - {item.event}
          </li>
        ))}
      </ul>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Close</Button></DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default LoginHistoryDialog;