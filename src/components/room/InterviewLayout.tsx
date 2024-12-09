'use client';

import { GetRoomPayloadResponse } from '@/models/room/GetRoomPayloadResponse';
import VideoCall from '@/components/room/VideoCall';
import QuestionSection from '@/components/room/QuestionSection';
import { useState, useRef } from 'react';

interface InterviewLayoutProps {
  roomId: string;
  interviewId: string;
  roomPayload: GetRoomPayloadResponse;
}

const InterviewLayout = ({ roomId, interviewId, roomPayload }: InterviewLayoutProps) => {
  const [dividerPosition, setDividerPosition] = useState(50); // Initial divider at 50%
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  // Handle the dragging of the divider
  const handleMouseMove = (e: MouseEvent) => {
    const containerWidth = dividerRef.current?.parentElement?.offsetWidth || 1;
    const newDividerPosition = (e.clientX / containerWidth) * 100;
    setDividerPosition(Math.min(80, Math.max(20, newDividerPosition))); // Clamp between 20% and 80%
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-100 text-white p-4 flex justify-between items-center z-50 shadow-md">
        <button className="px-4 py-2 bg-blue-500 rounded">Swap Role</button>
      </nav>

      {/* Main Content */}
      <main className="mt-16"> {/* Adjust mt-16 based on navbar height */}
        <div
          style={{
            height: 'calc(100vh - 64px)', // Subtract navbar height if necessary
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
          }}
        >
          {/* Left Panel */}
          <div
            ref={leftPanelRef}
            className={`flex flex-col bg-gray-100 overflow-hidden`}
            style={{
              flex: `0 0 ${dividerPosition}%`, // Fixed flex basis based on divider position
            }}
          >
            <VideoCall
              roomId={roomId}
              userName={roomPayload.userDetails.userName}
              userID={roomPayload.userDetails.userID.toString()}
            />
          </div>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="w-px cursor-col-resize bg-gray-300 hover:bg-gray-400"
            onMouseDown={handleMouseDown}
          ></div>

          {/* Right Panel */}
          <div
            ref={rightPanelRef}
            className="flex flex-col bg-white overflow-y-auto"
            style={{
              flex: `1 1 ${100 - dividerPosition}%`, // Remaining space
            }}
          >
            {roomPayload.userDetails.interviewRole.length > 0 ? (
              <div className="p-5 h-full overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Interview Questions</h2>
                <ul className="space-y-2">
                  <QuestionSection question={roomPayload.peerInfo.question} />
                </ul>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewLayout;