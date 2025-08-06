"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileTextIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, UploadIcon, PlusIcon } from 'lucide-react';

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


export default  function Assignments(){
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
  const [activeTab, setActiveTab] = useState(userType === 'student' ? 'pending' : 'created');

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
  return <div className="p-5 bg-[#f9f9f9]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#321210]">Assignments</h2>
        <p className="text-gray-600">
          {userType === 'student' ? 'Track and submit your assignments' : 'Create and review student work'}
        </p>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {userType === 'student' ? <>
            <button className={`pb-2 px-4 font-medium ${activeTab === 'pending' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('pending')}>
              Pending
            </button>
            <button className={`pb-2 px-4 font-medium ${activeTab === 'completed' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('completed')}>
              Completed
            </button>
          </> : <>
            <button className={`pb-2 px-4 font-medium ${activeTab === 'created' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('created')}>
              Created
            </button>
            <button className={`pb-2 px-4 font-medium ${activeTab === 'toReview' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('toReview')}>
              To Review
            </button>
          </>}
      </div>
      {/* Create Assignment Button (for tutors only) */}
      {userType === 'tutor' && activeTab === 'created' && <div className="mb-6">
          <Button variant="default"  className="flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Create New Assignment
          </Button>
        </div>}
      {/* Assignment Cards */}
      {userType === 'student' && activeTab === 'pending' || userType === 'tutor' && activeTab === 'created' ? <>
          {/* Pending/Created Assignments */}
          <Card className="mb-4 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="p-2 bg-[#c1f52f]/20 rounded-lg h-fit">
                  <FileTextIcon className="h-6 w-6 text-[#321210]" />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-[#321210]">
                    Quadratic Equations Practice
                  </h4>
                  <p className="text-sm text-gray-600">Advanced Mathematics</p>
                  <div className="flex items-center mt-2">
                    <ClockIcon className="h-4 w-4 text-[#d98d9f] mr-1" />
                    <span className="text-sm text-[#d98d9f] font-medium">
                      Due in 2 days
                    </span>
                  </div>
                </div>
              </div>
              {userType === 'student' ? <Button variant="default" size="sm" className="flex items-center self-start">
                  <UploadIcon className="h-4 w-4 mr-1" />
                  Submit
                </Button> : <div className="text-right">
                  <div className="bg-[#c1f52f]/20 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                    5 Submissions
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Due May 15</p>
                </div>}
            </div>
          </Card>
          <Card className="mb-4 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="p-2 bg-[#d98d9f]/20 rounded-lg h-fit">
                  <FileTextIcon className="h-6 w-6 text-[#321210]" />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-[#321210]">
                    Cell Structure Diagram
                  </h4>
                  <p className="text-sm text-gray-600">Biology 101</p>
                  <div className="flex items-center mt-2">
                    <AlertCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-500 font-medium">
                      Due today
                    </span>
                  </div>
                </div>
              </div>
              {userType === 'student' ? <Button variant="default" size="sm" className="flex items-center self-start">
                  <UploadIcon className="h-4 w-4 mr-1" />
                  Submit
                </Button> : <div className="text-right">
                  <div className="bg-[#d98d9f]/20 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                    3 Submissions
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Due Today</p>
                </div>}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="p-2 bg-[#7c5831]/20 rounded-lg h-fit">
                  <FileTextIcon className="h-6 w-6 text-[#321210]" />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-[#321210]">
                    World War II Essay
                  </h4>
                  <p className="text-sm text-gray-600">World History</p>
                  <div className="flex items-center mt-2">
                    <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Due in 5 days</span>
                  </div>
                </div>
              </div>
              {userType === 'student' ? <Button variant="outline" size="sm" className="flex items-center self-start">
                  View Details
                </Button> : <div className="text-right">
                  <div className="bg-[#7c5831]/20 text-[#321210] px-3 py-1 rounded-full text-xs font-medium">
                    0 Submissions
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Due May 20</p>
                </div>}
            </div>
          </Card>
        </> : <>
          {/* Completed/To Review Assignments */}
          <Card className="mb-4 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="p-2 bg-green-100 rounded-lg h-fit">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-[#321210]">
                    Photosynthesis Quiz
                  </h4>
                  <p className="text-sm text-gray-600">Biology 101</p>
                  <div className="flex items-center mt-2">
                    {userType === 'student' ? <span className="text-sm text-green-600 font-medium">
                        Grade: A (95%)
                      </span> : <span className="text-sm text-green-600 font-medium">
                        8 Graded
                      </span>}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center self-start">
                {userType === 'student' ? 'View Feedback' : 'View Details'}
              </Button>
            </div>
          </Card>
          <Card className="mb-4 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <div className="p-2 bg-green-100 rounded-lg h-fit">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-[#321210]">
                    Linear Equations Worksheet
                  </h4>
                  <p className="text-sm text-gray-600">Advanced Mathematics</p>
                  <div className="flex items-center mt-2">
                    {userType === 'student' ? <span className="text-sm text-green-600 font-medium">
                        Grade: B+ (88%)
                      </span> : <span className="text-sm text-green-600 font-medium">
                        5 Graded
                      </span>}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center self-start">
                {userType === 'student' ? 'View Feedback' : 'View Details'}
              </Button>
            </div>
          </Card>
        </>}
    </div>;
};