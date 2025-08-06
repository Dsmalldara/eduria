"use client"
import React, { useEffect, useState } from 'react';
import { Card } from  "@/components/ui/card"
import { Button } from  "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ClockIcon, UsersIcon } from 'lucide-react';

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
  
export default function  Scheduler (){
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  

    const [userData, setUserData] = useState<UserDataType | null>(null);
      const [loading, setLoading] = useState(true);
    
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
        const { user } = userData as UserDataType
    const userType = user.role 
  
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
  // Generate dates for the week view
  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };
  const weekDays = getDaysOfWeek();
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
  };
  return <div className="p-5 bg-[#f9f9f9]">
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#321210]">
            {currentDate.toLocaleString('default', {
            month: 'long'
          })}{' '}
            {currentDate.getFullYear()}
          </h2>
          <p className="text-gray-600">
            {userType === 'student' ? 'View and schedule your classes' : 'Manage your teaching schedule'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="p-2 rounded-full border border-gray-200">
            <ChevronLeftIcon className="h-5 w-5 text-[#321210]" />
          </Button>
          <Button className="p-2 rounded-full border border-gray-200">
            <ChevronRightIcon className="h-5 w-5 text-[#321210]" />
          </Button>
        </div>
      </div>
      {/* Week View */}
      <div className="mb-6">
        <div className="flex justify-between">
          {weekDays.map((day, index) => <button key={index} className={`flex flex-col items-center p-2 rounded-full w-10 h-10 ${isSelected(day) ? 'bg-[#c1f52f]' : isToday(day) ? 'bg-[#d98d9f]/30' : ''}`} onClick={() => setSelectedDate(day)}>
              <span className="text-xs text-gray-500">
                {day.toLocaleString('default', {
              weekday: 'short'
            }).substring(0, 1)}
              </span>
              <span className={`font-medium ${isSelected(day) ? 'text-[#321210]' : ''}`}>
                {day.getDate()}
              </span>
            </button>)}
        </div>
      </div>
      {/* Add Class Button (for tutors only) */}
      {userType === 'tutor' && <div className="mb-6">
          <Button variant="default"  className="flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Create New Class
          </Button>
        </div>}
      {/* Classes for the day */}
      <div>
        <h3 className="font-semibold text-[#321210] mb-3">
          {selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
        </h3>
        {/* Morning Class */}
        <Card className="mb-4 p-4 border-l-4 border-[#7c5831]">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center mb-1">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-sm text-gray-600">9:00 AM - 10:30 AM</p>
              </div>
              <h4 className="font-bold text-lg text-[#321210]">Biology 101</h4>
              <div className="flex items-center mt-1">
                <div className="h-6 w-6 rounded-full bg-[#d98d9f] flex items-center justify-center text-white text-xs mr-2">
                  {userType === 'student' ? 'DR' : '4'}
                </div>
                <p className="text-sm text-gray-600">
                  {userType === 'student' ? 'Dr. Roberts' : 'Students'}
                </p>
              </div>
            </div>
            <div>
              {userType === 'tutor' ? <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>4/6 Students</span>
                </div> : <div className="bg-[#c1f52f]/20 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                  Homework Due
                </div>}
              <Button variant={userType === 'student' ? 'default' : 'secondary'} size="sm" className="mt-2">
                {userType === 'student' ? 'Join Class' : 'Start Class'}
              </Button>
            </div>
          </div>
        </Card>
        {/* Afternoon Class */}
        <Card className="mb-4 p-4 border-l-4 border-[#d98d9f]">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center mb-1">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-sm text-gray-600">1:00 PM - 2:30 PM</p>
              </div>
              <h4 className="font-bold text-lg text-[#321210]">
                World History
              </h4>
              <div className="flex items-center mt-1">
                <div className="h-6 w-6 rounded-full bg-[#7c5831] flex items-center justify-center text-white text-xs mr-2">
                  {userType === 'student' ? 'PJ' : '3'}
                </div>
                <p className="text-sm text-gray-600">
                  {userType === 'student' ? 'Prof. Johnson' : 'Students'}
                </p>
              </div>
            </div>
            <div>
              {userType === 'tutor' ? <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>3/8 Students</span>
                </div> : <div className="bg-[#d98d9f]/20 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                  Quiz Today
                </div>}
              <Button variant={userType === 'student' ? 'default' : 'secondary'} size="sm" className="mt-2">
                {userType === 'student' ? 'Join Class' : 'Start Class'}
              </Button>
            </div>
          </div>
        </Card>
        {/* Evening Class */}
        <Card className="p-4 border-l-4 border-[#c1f52f]">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center mb-1">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                <p className="text-sm text-gray-600">4:00 PM - 5:30 PM</p>
              </div>
              <h4 className="font-bold text-lg text-[#321210]">
                Advanced Mathematics
              </h4>
              <div className="flex items-center mt-1">
                <div className="h-6 w-6 rounded-full bg-[#321210] flex items-center justify-center text-white text-xs mr-2">
                  {userType === 'student' ? 'MT' : '5'}
                </div>
                <p className="text-sm text-gray-600">
                  {userType === 'student' ? 'Ms. Taylor' : 'Students'}
                </p>
              </div>
            </div>
            <div>
              {userType === 'tutor' ? <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>5/5 Students</span>
                </div> : <div className="bg-[#321210]/10 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                  New Material
                </div>}
              <Button variant={userType === 'student' ? 'default' : 'secondary'} size="sm" className="mt-2">
                {userType === 'student' ? 'Join Class' : 'Start Class'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>;
};