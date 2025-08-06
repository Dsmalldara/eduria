/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserIcon, MailIcon, PhoneIcon, BookOpenIcon, StarIcon, AwardIcon, ClockIcon, ChevronRightIcon, EditIcon, GraduationCapIcon, TrophyIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
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

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          router.push('/auth/login');
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

  if (loading) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <p className="text-[#321210] mb-4">Unable to load profile data</p>
          <Button onClick={() => router.push('/auth/login')}>Back to Login</Button>
        </Card>
      </div>
    );
  }

  const { user, profile } = userData;


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
  const isStudent = user.role === 'student';
  const isTutor = user.role === 'tutor';
  
  // Generate user initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate member duration
  const getMemberDuration = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className="p-5 bg-[#f9f9f9] min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#7c5831] to-[#321210] flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
            {getInitials(user.name)}
          </div>
          {profile.certified && (
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-[#c1f52f] rounded-full flex items-center justify-center">
              <AwardIcon className="h-3 w-3 text-[#321210]" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#321210] text-center">
          {user.name}
        </h2>
        <p className="text-gray-600 capitalize">
          {user.role} {profile.certified && isTutor && "• Certified"}
        </p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          Member for less than 1 year
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3 flex items-center gap-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          <EditIcon className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-[#321210] mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </Card>
      )}

      {/* Profile Information */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-[#321210] mb-3 flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="p-2 bg-[#d98d9f]/20 rounded-full mr-3">
              <MailIcon className="h-5 w-5 text-[#321210]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-[#321210]">{user.email}</p>
            </div>
          </div>
          
          {profile.experience && (
            <div className="flex items-center">
              <div className="p-2 bg-[#7c5831]/20 rounded-full mr-3">
                <GraduationCapIcon className="h-5 w-5 text-[#321210]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-[#321210]">{profile.experience}</p>
              </div>
            </div>
          )}

          {profile.assessmentScore && (
            <div className="flex items-center">
              <div className="p-2 bg-[#c1f52f]/20 rounded-full mr-3">
                <TrophyIcon className="h-5 w-5 text-[#321210]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Assessment Score</p>
                <p className="font-medium text-[#321210]">{profile.assessmentScore}%</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Subjects/Specializations */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold text-[#321210] mb-3 flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5" />
          {isStudent ? 'Enrolled Subjects' : 'Teaching Specializations'}
        </h3>
        {profile.subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {profile.subjects.map((subject, index) => (
              <div key={index} className="flex items-center p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-full mr-3 ${
                  index % 3 === 0 ? 'bg-[#c1f52f]/20' : 
                  index % 3 === 1 ? 'bg-[#d98d9f]/20' : 'bg-[#7c5831]/20'
                }`}>
                  <BookOpenIcon className="h-5 w-5 text-[#321210]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#321210]">{subject}</p>
                  {isTutor && (
                    <p className="text-sm text-gray-500">Available for tutoring</p>
                  )}
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpenIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No subjects added yet</p>
            <Button variant="outline" size="sm" className="mt-2">
              Add Subjects
            </Button>
          </div>
        )}
      </Card>

      {/* Tutor Specific: Certifications */}
      {isTutor && (
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-[#321210] mb-3 flex items-center gap-2">
            <AwardIcon className="h-5 w-5" />
            Certifications
          </h3>
          {profile.certified ? (
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-[#c1f52f]/10 rounded-lg">
                <div className="p-2 bg-[#c1f52f]/30 rounded-full mr-3">
                  <AwardIcon className="h-5 w-5 text-[#321210]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#321210]">Certified Tutor</p>
                  <p className="text-sm text-gray-500">Verified by Eduria</p>
                </div>
                <div className="bg-[#c1f52f] px-3 py-1 rounded-full text-xs font-medium text-[#321210]">
                  Verified
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <AwardIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-2">Not yet certified</p>
              <Button variant="outline" size="sm">
                Start Certification
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Stats Section */}
      <Card className="p-4">
        <h3 className="font-semibold text-[#321210] mb-4 flex items-center gap-2">
          <StarIcon className="h-5 w-5" />
          {isStudent ? 'Learning Progress' : 'Performance Stats'}
        </h3>
        
        {isStudent ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#c1f52f]/20 to-[#c1f52f]/5 p-4 rounded-lg text-center border border-[#c1f52f]/20">
              <p className="text-2xl font-bold text-[#321210]">{profile.subjects.length}</p>
              <p className="text-sm text-gray-600">Subjects Enrolled</p>
            </div>
            <div className="bg-gradient-to-br from-[#d98d9f]/20 to-[#d98d9f]/5 p-4 rounded-lg text-center border border-[#d98d9f]/20">
              <p className="text-2xl font-bold text-[#321210]">{profile.assessmentScore || 0}%</p>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
            <div className="bg-gradient-to-br from-[#7c5831]/20 to-[#7c5831]/5 p-4 rounded-lg text-center border border-[#7c5831]/20">
              <p className="text-2xl font-bold text-[#321210]">15</p>
              <p className="text-sm text-gray-600">Hours This Week</p>
            </div>
            <div className="bg-gradient-to-br from-[#321210]/20 to-[#321210]/5 p-4 rounded-lg text-center border border-[#321210]/20">
              <p className="text-2xl font-bold text-[#321210]">92%</p>
              <p className="text-sm text-gray-600">Attendance</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-[#c1f52f]/10 to-transparent rounded-lg">
              <div className="flex items-center">
                <div className="flex mr-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <StarIcon 
                      key={star} 
                      className="h-5 w-5" 
                      fill="#c1f52f" 
                      color="#c1f52f" 
                    />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-[#321210] text-lg">4.9</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#321210] text-lg">28</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#d98d9f]/20 to-[#d98d9f]/5 p-4 rounded-lg text-center border border-[#d98d9f]/20">
                <p className="text-2xl font-bold text-[#321210]">156</p>
                <p className="text-sm text-gray-600">Students Taught</p>
              </div>
              <div className="bg-gradient-to-br from-[#7c5831]/20 to-[#7c5831]/5 p-4 rounded-lg text-center border border-[#7c5831]/20">
                <p className="text-2xl font-bold text-[#321210]">320</p>
                <p className="text-sm text-gray-600">Hours Taught</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}