"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, CalendarIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';

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

interface UserData {
  user: User;
  profile: Profile;
}

export default function Home() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          router.push('/login');
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
  }, [router]);

  const handleJoinNow = () => {
    router.push('/whiteboard');
  };

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
        <div className="text-[#321210]">Unable to load user data</div>
      </div>
    );
  }
  

  const { user, profile } = userData;
  const isStudent = user.role === 'student';
  const firstName = user.name.split(' ')[0];
  
  // Calculate number of scheduled classes (total subjects - 1)
  const totalSubjects = profile.subjects.length;
  const scheduledClasses = Math.max(0, totalSubjects - 1);
  
  // Get next course (first subject from the list)
  const nextCourse = profile.subjects[0] || 'No courses available';
  
  // Generate tutor initials or student initial
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-5 bg-[#f9f9f9]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#321210]">
          Good morning, {firstName}!
        </h2>
        <p className="text-gray-600">
          {isStudent 
            ? `You have ${scheduledClasses} ${scheduledClasses === 1 ? 'class' : 'classes'} scheduled today`
            : `You have ${scheduledClasses + 2} sessions scheduled today`
          }
        </p>
      </div>

      {/* Next Class Section */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[#321210]">Next Class</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <Card className="p-4 bg-gradient-to-r from-[#d98d9f] to-[#d98d9f]/70">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-[#321210]/70">
                Today, 4:00 - 5:30 PM
              </p>
              <h4 className="font-bold text-lg text-[#321210]">
                {nextCourse}
              </h4>
              <div className="flex items-center mt-2">
                <div className="h-8 w-8 rounded-full bg-[#7c5831] flex items-center justify-center text-white text-xs">
                  {isStudent ? 'MT' : getInitials(user.name)}
                </div>
                <p className="ml-2 text-sm text-[#321210]">
                  {isStudent ? 'Ms. Taylor' : user.name}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-[#c1f52f] rounded-full px-3 py-1 text-xs font-medium text-[#321210]">
                {isStudent ? 'Homework Due' : `${scheduledClasses + 1} Students`}
              </div>
              <Button size="sm" className="mt-auto" onClick={handleJoinNow}>
                Join Now
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h3 className="font-semibold text-[#321210] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-[#c1f52f]/30 p-3 rounded-full mb-2">
              <CalendarIcon className="h-6 w-6 text-[#321210]" />
            </div>
            <p className="text-sm font-medium text-[#321210]">Schedule Class</p>
          </Card>
          <Card className="p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-[#d98d9f]/30 p-3 rounded-full mb-2">
              <BookOpenIcon className="h-6 w-6 text-[#321210]" />
            </div>
            <p className="text-sm font-medium text-[#321210]">Assignments</p>
          </Card>
        </div>
      </section>

      {/* Progress/Stats Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[#321210]">
            {isStudent ? 'Your Progress' : 'Weekly Stats'}
          </h3>
          <Button variant="outline" size="sm">
            See All
          </Button>
        </div>
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-[#7c5831]/20 p-2 rounded-full">
              <TrendingUpIcon className="h-5 w-5 text-[#7c5831]" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                {isStudent ? 'Weekly Study Hours' : 'Classes Completed'}
              </p>
              <p className="font-bold text-xl text-[#321210]">
                {isStudent ? '12.5 hrs' : '24'}
              </p>
            </div>
            <div className="ml-auto text-[#7c5831] font-medium">
              +15% <span className="text-xs text-gray-500">vs last week</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-[#d98d9f]/20 p-2 rounded-full">
              <ClockIcon className="h-5 w-5 text-[#d98d9f]" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                {isStudent ? 'Subjects Enrolled' : 'Hours Taught'}
              </p>
              <p className="font-bold text-xl text-[#321210]">
                {isStudent ? `${totalSubjects}` : '32.5 hrs'}
              </p>
            </div>
            <div className="ml-auto text-[#7c5831] font-medium">
              {isStudent 
                ? `${profile.assessmentScore || 0}%` 
                : '+8%'
              }{' '}
              <span className="text-xs text-gray-500">
                {isStudent ? 'avg score' : 'increase'}
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}