/* eslint-disable react/no-unescaped-entities */
"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { MicIcon, VideoIcon, MonitorIcon, MessageCircleIcon, UsersIcon, MicOffIcon, VideoOffIcon, XIcon } from 'lucide-react';
export default function LiveClass(){
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);


  return <div className="bg-[#321210] min-h-screen flex flex-col">
      {/* Header with timer */}
      <div className="bg-[#321210] p-4 flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold">Advanced Mathematics</h2>
          <p className="text-gray-300 text-sm">Ms. Taylor</p>
        </div>
        <div className="bg-[#c1f52f] px-3 py-1 rounded-full text-[#321210] font-bold">
          45:22
        </div>
      </div>
      {/* Main video area */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Teacher video" className="w-full h-full object-cover" />
        </div>
        {/* Student videos */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="h-24 w-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Student 1" className="h-full w-full object-cover" />
          </div>
          <div className="h-24 w-20 bg-gray-800 rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Student 2" className="h-full w-full object-cover" />
          </div>
          <div className="h-24 w-20 bg-gray-800 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center bg-[#7c5831]">
              <span className="text-white font-bold">You</span>
            </div>
          </div>
        </div>
        {/* Whiteboard toggle button */}
        <div className="absolute top-4 left-4">
          <Button variant="default" size="sm" className="flex items-center">
            <MonitorIcon size={16} className="mr-1" />
            Whiteboard
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="bg-[#321210] p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className={`p-3 rounded-full ${micOn ? 'bg-gray-700' : 'bg-red-500'}`} onClick={() => setMicOn(!micOn)}>
            {micOn ? <MicIcon className="h-5 w-5 text-white" /> : <MicOffIcon className="h-5 w-5 text-white" />}
          </button>
          <button className={`p-3 rounded-full ${videoOn ? 'bg-gray-700' : 'bg-red-500'}`} onClick={() => setVideoOn(!videoOn)}>
            {videoOn ? <VideoIcon className="h-5 w-5 text-white" /> : <VideoOffIcon className="h-5 w-5 text-white" />}
          </button>
        </div>
        <div className="flex space-x-4">
          <Button className={`p-3 rounded-full ${showChat ? 'bg-[#c1f52f]' : 'bg-gray-700'}`} onClick={() => setShowChat(!showChat)}>
            <MessageCircleIcon className={`h-5 w-5 ${showChat ? 'text-[#321210]' : 'text-white'}`} />
          </Button>
          <Button className={`p-3 rounded-full ${showParticipants ? 'bg-[#c1f52f]' : 'bg-gray-700'}`} onClick={() => setShowParticipants(!showParticipants)}>
            <UsersIcon className={`h-5 w-5 ${showParticipants ? 'text-[#321210]' : 'text-white'}`} />
          </Button>
          <Button className="p-3 rounded-full bg-red-500">
            <XIcon className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
      {/* Chat panel (conditionally shown) */}
      {showChat && <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg z-10">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-bold text-[#321210]">Chat</h3>
            <Button onClick={() => setShowChat(false)}>
              <XIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <div className="p-3 h-full overflow-y-auto">
            <div className="mb-3">
              <p className="text-xs text-gray-500">Ms. Taylor</p>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm">
                  Welcome everyone! Today we'll be covering quadratic equations.
                </p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-gray-500">Emma</p>
              <div className="bg-gray-100 p-2 rounded-lg">
                <p className="text-sm">
                  I had a question about yesterday's homework.
                </p>
              </div>
            </div>
          </div>
        </div>}
      {/* Participants panel (conditionally shown) */}
      {showParticipants && <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg z-10">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-bold text-[#321210]">Participants (4)</h3>
            <Button onClick={() => setShowParticipants(false)}>
              <XIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <div className="p-3">
            <div className="flex items-center p-2 border-b">
              <div className="h-8 w-8 rounded-full bg-[#7c5831] flex items-center justify-center text-white mr-2">
                MT
              </div>
              <div>
                <p className="text-sm font-medium">Ms. Taylor</p>
                <p className="text-xs text-gray-500">Tutor</p>
              </div>
            </div>
            <div className="flex items-center p-2 border-b">
              <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Student" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Alex Thompson</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
            <div className="flex items-center p-2 border-b">
              <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Student" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">Emma Wilson</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
            <div className="flex items-center p-2">
              <div className="h-8 w-8 rounded-full overflow-hidden mr-2 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">JL</span>
              </div>
              <div>
                <p className="text-sm font-medium">Jason Lee</p>
                <p className="text-xs text-gray-500">Student (Audio only)</p>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};