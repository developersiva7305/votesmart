import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';

const SettingsHeader = ({ onBack }) => {
  return (
    <CardHeader className="relative pb-4 border-b dark:border-gray-700">
      <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-4 left-4 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="text-center pt-8">
        <SettingsIcon className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Settings</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">Manage your account and preferences.</CardDescription>
      </div>
    </CardHeader>
  );
};

export default SettingsHeader;