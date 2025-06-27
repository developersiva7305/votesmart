
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { LogOut, Menu, Shield, UserCircle, Settings } from 'lucide-react';
import { APP_VIEWS } from '@/services/appConstants.js';

const AdminHeader = ({ currentUser, onLogout, navigateTo, onMenuToggle }) => {
  return (
    <header className="bg-votesmart-blue-deep text-white p-4 shadow-lg sticky top-0 z-40">
      <div className="max-w-full mx-auto flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="text-white hover:bg-white/20 md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Shield className="h-7 w-7 sm:h-8 sm:w-8" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-votesmart-blue-light">Welcome, {currentUser.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20 p-0">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                  <AvatarImage src={currentUser.profilePicture || `https://avatar.vercel.sh/${currentUser.email}.png`} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 dark:bg-gray-800 dark:border-gray-700" align="end" forceMount>
              <DropdownMenuLabel className="font-normal dark:text-gray-300">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-gray-700"/>
              <DropdownMenuItem onClick={() => navigateTo(APP_VIEWS.PROFILE)} className="dark:hover:bg-gray-700 dark:text-gray-300">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateTo(APP_VIEWS.SETTINGS)} className="dark:hover:bg-gray-700 dark:text-gray-300">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-gray-700"/>
              <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/50 dark:focus:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
