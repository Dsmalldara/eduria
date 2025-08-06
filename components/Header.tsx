'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { BellIcon, MenuIcon } from 'lucide-react';

interface HeaderProps {
  userType: string;
}

export const Header: React.FC<HeaderProps> = ({ userType }) => {
  const pathname = usePathname();
  const currentPage = pathname.replace('/', '');

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard/home':
        return 'Dashboard';
      case 'dashboard/liveClass':
        return 'Live Class';
      case 'scheduler':
        return 'Class Schedule';
      case 'dashboard/assignments':
        return 'Assignments';
      case 'dashboard/wallet':
        return 'Wallet';
      case 'dashboard/profile':
        return 'Profile';
      case 'notifications':
        return 'Notifications';
      case 'dashboard/resources':
        return 'Resources';
      case 'dashboard/settings':
        return 'Settings';
      default:
        return 'Eduria';
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center">
        <MenuIcon className="h-6 w-6 text-[#321210]" />
        <h1 className="ml-4 font-bold text-xl text-[#321210]">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <BellIcon className="h-6 w-6 text-[#321210]" />
          <span className="absolute -top-1 -right-1 bg-[#c1f52f] text-[#321210] rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
            3
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-[#7c5831] flex items-center justify-center text-white font-bold">
          {userType === 'student' ? 'S' : 'T'}
        </div>
      </div>
    </header>
  );
};
