'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import {Header} from '@/components/Header';


import { Toaster } from "@/components/ui/sonner"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideUI = [
    "/onboarding",
    "/liveClass",
    "/whiteboard",
    "/auth/login",
    "/auth/signup",
    "/signup",
    "/login",
  ].includes(pathname)

  return (
    <html lang="en">
      <body>
        <div className="bg-white min-h-screen max-w-md mx-auto relative overflow-hidden">

       
          <div className="pb-16">
              {children}
          </div>
            <Toaster />
      
          {!hideUI && <Navbar />}
        </div>
      </body>
    </html>
  );
}