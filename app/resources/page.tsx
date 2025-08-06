"use client"
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileTextIcon, ImageIcon,  VideoIcon, PlusIcon, SearchIcon, DownloadIcon } from 'lucide-react';
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
  
export default function Resources() {
     const [userData, setUserData] = useState<UserDataType | null>(null);
      const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if we're on the client side
        if (typeof window === 'undefined') return;
        
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setLoading(false);
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

  // Show loading state FIRST
  if (loading) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <div className="text-[#321210]">Loading...</div>
      </div>
    );
  }

  // Show error state if no userData SECOND
  if (!userData) {
    return (
      <div className="p-5 bg-[#f9f9f9] flex items-center justify-center min-h-screen">
        <div className="text-[#321210]">Unable to load assignment</div>
      </div>
    );
  }

  // NOW it's safe to destructure - userData is guaranteed to exist
  const { user } = userData;
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
  return <div className="p-5 bg-[#f9f9f9]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#321210]">Resources</h2>
        <p className="text-gray-600">
          {userType === 'student' ? 'Access study materials and notes' : 'Manage and share teaching materials'}
        </p>
      </div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Search resources..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c1f52f]" />
      </div>
      {/* Upload Button (for tutors only) */}
      {userType === 'tutor' && <div className="mb-6">
          <Button variant="default" className="flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-1" />
            Upload New Material
          </Button>
        </div>}
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('all')}>
          All
        </button>
        <button className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'documents' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('documents')}>
          Documents
        </button>
        <button className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'presentations' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('presentations')}>
          Presentations
        </button>
        <button className={`pb-2 px-4 font-medium whitespace-nowrap ${activeTab === 'videos' ? 'text-[#7c5831] border-b-2 border-[#7c5831]' : 'text-gray-500'}`} onClick={() => setActiveTab('videos')}>
          Videos
        </button>
      </div>
      {/* Resources List */}
      <div className="space-y-4">
        {/* Math Resources */}
        <h3 className="font-semibold text-[#321210] mb-3">
          Advanced Mathematics
        </h3>
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="p-2 bg-[#c1f52f]/20 rounded-lg h-fit">
                <FileTextIcon className="h-6 w-6 text-[#321210]" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-[#321210]">
                  Quadratic Equations Notes
                </h4>
                <p className="text-sm text-gray-500">
                  PDF • 2.4 MB • Updated 3 days ago
                </p>
              </div>
            </div>
            <Button className="p-2 text-gray-500 hover:text-[#321210]">
              <DownloadIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="p-2 bg-[#d98d9f]/20 rounded-lg h-fit">
                <VideoIcon className="h-6 w-6 text-[#321210]" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-[#321210]">
                  Function Transformations Tutorial
                </h4>
                <p className="text-sm text-gray-500">
                  MP4 • 45:12 • Updated 1 week ago
                </p>
              </div>
            </div>
            <Button className="p-2 text-gray-500 hover:text-[#321210]">
              <DownloadIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="p-2 bg-[#7c5831]/20 rounded-lg h-fit">
                <ImageIcon className="h-6 w-6 text-[#321210]" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-[#321210]">
                  Calculus Formula Sheet
                </h4>
                <p className="text-sm text-gray-500">
                  PNG • 1.2 MB • Updated 2 weeks ago
                </p>
              </div>
            </div>
            <Button className="p-2 text-gray-500 hover:text-[#321210]">
              <DownloadIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
        {/* Biology Resources */}
        <h3 className="font-semibold text-[#321210] mt-6 mb-3">Biology 101</h3>
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="p-2 bg-[#c1f52f]/20 rounded-lg h-fit">
                <FileTextIcon className="h-6 w-6 text-[#321210]" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-[#321210]">
                  Cell Structure Study Guide
                </h4>
                <p className="text-sm text-gray-500">
                  PDF • 3.1 MB • Updated 2 days ago
                </p>
              </div>
            </div>
            <Button className="p-2 text-gray-500 hover:text-[#321210]">
              <DownloadIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div className="flex">
              <div className="p-2 bg-[#d98d9f]/20 rounded-lg h-fit">
                <ImageIcon className="h-6 w-6 text-[#321210]" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-[#321210]">
                  Photosynthesis Diagram
                </h4>
                <p className="text-sm text-gray-500">
                  PNG • 2.8 MB • Updated 5 days ago
                </p>
              </div>
            </div>
            <Button className="p-2 text-gray-500 hover:text-[#321210]">
              <DownloadIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>;
};