"use client"
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CreditCardIcon, 
  ArrowUpRightIcon, 
  ArrowDownLeftIcon, 
  DollarSignIcon, 
  BookOpenIcon,

  TrendingUpIcon,
  GiftIcon,
  ShieldCheckIcon,
  StarIcon
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Profile {
  id: string;
  userId: string;
  subjects: string[];
  assessmentScore?: number;
}

interface UserData {
  user: User;
  profile: Profile;
}

export default function Wallet() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          return;
        }

        const response = await fetch('/api/user-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <div className="text-[#321210]">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <div className="text-[#321210]">Unable to load wallet</div>
      </div>
    );
  }

  const { user, profile } = userData;
  const isStudent = user.role === 'student';
  
  // Calculate mock balances based on user data
  const studentBalance = profile.subjects.length * 50; // $50 per subject
  const tutorEarnings = profile.subjects.length * 500; // $500 per subject taught

  if (isStudent) {
    return (
      <div className="p-5 bg-[#f9f9f9]">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#321210]">Learning Wallet</h2>
          <p className="text-gray-600">Track your learning journey and rewards</p>
        </div>

        {/* Student Balance Card - Different Design */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-[#c1f52f] via-[#c1f52f]/80 to-[#7c5831]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-[#321210]/80 text-sm">Learning Credits</h3>
                <p className="text-3xl font-bold text-[#321210] mb-1">{studentBalance} Credits</p>
                <p className="text-sm text-[#321210]/70">≈ ${studentBalance}.00 value</p>
              </div>
              <div className="bg-[#321210]/10 p-3 rounded-full">
                <BookOpenIcon className="h-6 w-6 text-[#321210]" />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-[#321210]/80 mb-4">
              <TrendingUpIcon className="h-4 w-4 mr-2" />
              <span>+{profile.assessmentScore || 85}% learning progress this month</span>
            </div>
            
            <Button variant="default"  className="w-full bg-[#321210] hover:bg-[#321210]/90">
              Earn More Credits
            </Button>
          </div>
        </Card>

        {/* Learning Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#d98d9f]/20 to-[#d98d9f]/5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-[#d98d9f]/30 p-2 rounded-full">
                <StarIcon className="h-5 w-5 text-[#321210]" />
              </div>
              <span className="text-xs font-medium text-[#7c5831] bg-[#7c5831]/10 px-2 py-1 rounded-full">
                This Week
              </span>
            </div>
            <p className="text-2xl font-bold text-[#321210] mb-1">{profile.subjects.length * 8}</p>
            <p className="text-sm text-gray-600">Study Hours</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#7c5831]/20 to-[#7c5831]/5">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-[#7c5831]/30 p-2 rounded-full">
                <GiftIcon className="h-5 w-5 text-[#321210]" />
              </div>
              <span className="text-xs font-medium text-[#d98d9f] bg-[#d98d9f]/10 px-2 py-1 rounded-full">
                Rewards
              </span>
            </div>
            <p className="text-2xl font-bold text-[#321210] mb-1">{Math.floor(studentBalance / 10)}</p>
            <p className="text-sm text-gray-600">Credits Earned</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="bg-[#c1f52f]/30 p-3 rounded-full mb-2">
              <DollarSignIcon className="h-6 w-6 text-[#321210]" />
            </div>
            <p className="text-sm font-medium text-[#321210]">Buy Credits</p>
          </Card>
          <Card className="p-4 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="bg-[#d98d9f]/30 p-3 rounded-full mb-2">
              <ShieldCheckIcon className="h-6 w-6 text-[#321210]" />
            </div>
            <p className="text-sm font-medium text-[#321210]">Subscription</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-4">
          <h3 className="font-semibold text-[#321210] mb-3">Recent Activity</h3>
        </div>

        {profile.subjects.map((subject, index) => (
          <Card key={index} className="p-4 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <ArrowDownLeftIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium text-[#321210]">
                    {subject} - Session Completed
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="font-bold text-green-500">+{10 + index * 2} Credits</p>
            </div>
          </Card>
        ))}

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <ArrowUpRightIcon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-[#321210]">Monthly Subscription</h4>
                <p className="text-sm text-gray-500">Auto-renewal</p>
              </div>
            </div>
            <p className="font-bold text-red-500">-50 Credits</p>
          </div>
        </Card>
      </div>
    );
  }

  // Tutor Wallet (existing design with dynamic data)
  return (
    <div className="p-5 bg-[#f9f9f9]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#321210]">Wallet</h2>
        <p className="text-gray-600">Track your earnings and payouts</p>
      </div>

      {/* Balance Card */}
      <Card className="p-5 mb-6 bg-gradient-to-r from-[#7c5831] to-[#321210] text-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-white/80">Current Earnings</h3>
          <CreditCardIcon className="h-6 w-6 text-white/80" />
        </div>
        <p className="text-3xl font-bold mb-1">${tutorEarnings.toLocaleString()}.00</p>
        <p className="text-sm text-white/80">Available for payout</p>
        <div className="mt-4">
          <Button variant="default" className="w-full">
            Withdraw Funds
          </Button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="bg-[#c1f52f]/30 p-3 rounded-full mb-2">
            <DollarSignIcon className="h-6 w-6 text-[#321210]" />
          </div>
          <p className="text-sm font-medium text-[#321210]">Set Rates</p>
        </Card>
        <Card className="p-4 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="bg-[#d98d9f]/30 p-3 rounded-full mb-2">
            <CreditCardIcon className="h-6 w-6 text-[#321210]" />
          </div>
          <p className="text-sm font-medium text-[#321210]">Payout Methods</p>
        </Card>
      </div>

      {/* Transaction History */}
      <div className="mb-4">
        <h3 className="font-semibold text-[#321210] mb-3">Transaction History</h3>
      </div>

      {profile.subjects.map((subject, index) => (
        <Card key={index} className="p-4 mb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <ArrowDownLeftIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-[#321210]">
                  {subject} - Student Session
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="font-bold text-green-500">+${35 + index * 5}.00</p>
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-3">
              <ArrowUpRightIcon className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-medium text-[#321210]">Withdrawal to Bank</h4>
              <p className="text-sm text-gray-500">Last month</p>
            </div>
          </div>
          <p className="font-bold text-red-500">-$500.00</p>
        </div>
      </Card>
    </div>
  );
}