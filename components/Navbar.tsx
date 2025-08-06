'use client';
import React, { cloneElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  BookOpenIcon,
  WalletIcon,
  UserIcon
} from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Home', icon: <HomeIcon /> },
  { href: '/scheduler', label: 'Schedule', icon: <CalendarIcon /> },
  { href: '/assignments', label: 'Assignments', icon: <BookOpenIcon /> },
  { href: '/wallet', label: 'Wallet', icon: <WalletIcon /> },
  { href: '/profile', label: 'Profile', icon: <UserIcon /> }
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-between items-center">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link href={href} key={label}>
              <span className={`flex flex-col items-center justify-center px-2 py-1 ${isActive ? 'text-[#7c5831]' : 'text-gray-500'}`}>
                <div className={`p-1 ${isActive ? 'bg-[#c1f52f] rounded-full' : ''}`}>
                  {cloneElement(icon as React.ReactElement, {
                    size: 20,
                    className: isActive ? 'text-[#321210]' : 'text-gray-500'
                  })}
                </div>
                <span className="text-xs mt-1">{label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
