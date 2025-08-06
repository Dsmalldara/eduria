"use client "
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsProps {
  userType: string;
  setUserType: (type: string) => void;
}

export default function Settings({ userType, setUserType }: SettingsProps) {
  const handleUserTypeToggle = () => {
    setUserType(userType === 'student' ? 'tutor' : 'student');
  };

  return (
    <div className="p-5 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-900">Settings</h2>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Demo Toggle */}
      <Card className="p-4 mb-6 border-l-4 border-lime-400">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-amber-900">Demo Mode</h3>
            <p className="text-sm text-gray-600">
              Toggle between student and tutor view
            </p>
          </div>
          <Button 
            variant={userType === 'student' ? 'default' : 'secondary'} 
            size="sm" 
            onClick={handleUserTypeToggle}
          >
            {userType === 'student' ? 'View as Tutor' : 'View as Student'}
          </Button>
        </div>
      </Card>

      {/* Account Settings */}
      <div className="mb-6">
        <h3 className="font-semibold text-amber-900 mb-3">Account</h3>
        <Card className="overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-full mr-3">
                <User className="h-5 w-5 text-amber-900" />
              </div>
              <p className="font-medium text-amber-900">Edit Profile</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="border-b p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-lime-100 rounded-full mr-3">
                <Bell className="h-5 w-5 text-amber-900" />
              </div>
              <p className="font-medium text-amber-900">
                Notification Preferences
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-full mr-3">
                <Shield className="h-5 w-5 text-amber-900" />
              </div>
              <p className="font-medium text-amber-900">Privacy & Security</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <h3 className="font-semibold text-amber-900 mb-3">Preferences</h3>
        <Card className="overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-amber-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Change app appearance</p>
            </div>
            <Button className="p-1">
              <ToggleLeft className="h-6 w-6 text-gray-400" />
            </Button>
          </div>
          <div className="border-b p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-amber-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive emails about classes and assignments
              </p>
            </div>
            <Button className="p-1">
              <ToggleRight className="h-6 w-6 text-lime-400" />
            </Button>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-amber-900">Push Notifications</p>
              <p className="text-sm text-gray-500">
                Receive alerts on your device
              </p>
            </div>
            <Button className="p-1">
              <ToggleRight className="h-6 w-6 text-lime-400" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Support */}
      <div className="mb-6">
        <h3 className="font-semibold text-amber-900 mb-3">Support</h3>
        <Card className="overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-lime-100 rounded-full mr-3">
                <HelpCircle className="h-5 w-5 text-amber-900" />
              </div>
              <p className="font-medium text-amber-900">Help Center</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="border-b p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-full mr-3">
                <HelpCircle className="h-5 w-5 text-amber-900" />
              </div>
              <p className="font-medium text-amber-900">Contact Support</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <p className="font-medium text-red-500">Log Out</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Eduria v1.0.0</p>
        <p className="mt-1">
          © 2023 Eduria Learning Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}