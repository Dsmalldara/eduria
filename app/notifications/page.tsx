"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card"
import { BellIcon, ClockIcon, BookOpenIcon, CreditCardIcon, CheckCircleIcon, SettingsIcon } from 'lucide-react';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Profile {
  id: string;
  userId: string;
  bio?: string;
  subjects: string[];
  certified?: boolean;
  experience?: string;
  assessmentScore?: number;
}

interface UserDataType {
  user: User;
  profile: Profile;
}

export default function Notifications() {
    const [userData, setUserData] = useState<UserDataType | null>(null);
      const [loading, setLoading] = useState(true);
      const [activeTab, setActiveTab] = useState('all');
     useEffect(() => {
        const fetchUserData = async () => {
          try {
             const email = localStorage.getItem("userEmail");
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
         // Show error state if no userData
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Failed to load user data</div>
      </div>
    );
  }

  // Now it's safe to destructure
  const { user } = userData;
const userType = userData.user.role

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
        <div className="text-[#321210]">Unable to load  assignment</div>
      </div>
    );
  }
  return <div className="p-5 bg-[#f9f9f9]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#321210]">Notifications</h2>
        <p className="text-gray-600">
          Stay updated with your classes and assignments
        </p>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className={`pb-2 px-4 font-medium ${activeTab === 'all' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('all')}>
          All
        </button>
        <button className={`pb-2 px-4 font-medium ${activeTab === 'unread' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('unread')}>
          Unread
        </button>
      </div>
      {/* Notifications List */}
      <div className="space-y-4">
        <Card className="p-4 border-l-4 border-[#c1f52f]">
          <div className="flex">
            <div className="p-2 bg-[#c1f52f]/20 rounded-full h-fit">
              <ClockIcon className="h-5 w-5 text-[#321210]" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-[#321210]">Class Reminder</h4>
              <p className="text-sm text-gray-600">
                {userType === 'student' ? 'Your Advanced Mathematics class starts in 30 minutes' : 'Your session with 5 students starts in 30 minutes'}
              </p>
              <p className="text-xs text-gray-500 mt-2">10 minutes ago</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-[#d98d9f]">
          <div className="flex">
            <div className="p-2 bg-[#d98d9f]/20 rounded-full h-fit">
              <BookOpenIcon className="h-5 w-5 text-[#321210]" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-[#321210]">
                Assignment Reminder
              </h4>
              <p className="text-sm text-gray-600">
                {userType === 'student' ? 'Cell Structure Diagram is due today' : '3 students have submitted Cell Structure Diagram'}
              </p>
              <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex">
            <div className="p-2 bg-[#7c5831]/20 rounded-full h-fit">
              <CreditCardIcon className="h-5 w-5 text-[#321210]" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-[#321210]">
                Payment Confirmation
              </h4>
              <p className="text-sm text-gray-600">
                {userType === 'student' ? 'Your payment of $35 for Advanced Mathematics was successful' : 'You received a payment of $35 from Alex Thompson'}
              </p>
              <p className="text-xs text-gray-500 mt-2">Yesterday</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex">
            <div className="p-2 bg-green-100 rounded-full h-fit">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-[#321210]">Assignment Graded</h4>
              <p className="text-sm text-gray-600">
                {userType === 'student' ? 'Your Photosynthesis Quiz has been graded: A (95%)' : "You've graded all submissions for Photosynthesis Quiz"}
              </p>
              <p className="text-xs text-gray-500 mt-2">2 days ago</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex">
            <div className="p-2 bg-gray-100 rounded-full h-fit">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <h4 className="font-medium text-[#321210]">System Update</h4>
              <p className="text-sm text-gray-600">
                Eduria has been updated with new features. Check them out!
              </p>
              <p className="text-xs text-gray-500 mt-2">3 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};