'use client';

import { GetRoomPayloadResponse } from '@/models/room/GetRoomPayloadResponse';
import VideoCall from '@/components/room/VideoCall';
import QuestionSection from '@/components/room/QuestionSection';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axiosWebSocketServiceClient from '@/services/axiosWebSocketClient';
import { ChangeInterviewRoleResponseDTO } from '@/models/room/ChangeRoleResponsePayloadModel';

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
  const [isInterviewerRole, setIsInterviewerRole] = useState(false);
  const router = useRouter();

  // WebSocket client
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const containerWidth = dividerRef.current?.parentElement?.offsetWidth || 1;
    const newDividerPosition = (e.clientX / containerWidth) * 100;
    setDividerPosition(Math.min(80, Math.max(20, newDividerPosition))); // Clamp between 20% and 80%
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleEndCall = () => {
    console.log('The call has ended!');
    alert('The call has ended!'); // Show a message

    // Determine whether to navigate to the feedback page
    const currentTime = new Date();
    const interviewEndTime = new Date(roomPayload.roomDetails.interviewEndTime);
    const twentyMinutesInMs = 20 * 60 * 1000;
    const timeDiff = Math.abs(currentTime.getTime() - interviewEndTime.getTime());

    if (currentTime > interviewEndTime || timeDiff > twentyMinutesInMs) {
      // Navigate to feedback page and pass roomId via URL
      router.push(`/interviewfeedback/${encodeURIComponent(roomId)}/`);
    }
  };

  // WebSocket connection and registration
  useEffect(() => {
    // Initialize STOMP client over SockJS
    const socket = new SockJS('http://localhost:9090/ws'); // Adjust the URL if different
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Attempt to reconnect every 5 seconds if disconnected
      debug: (str) => {
        console.log(`STOMP: ${str}`);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Register the user
        const registrationPayload = {
          roomId: roomId,
          interviewId: parseInt(interviewId),
        };

        stompClient.publish({
          destination: '/app/register',
          body: JSON.stringify(registrationPayload),
        });

        console.log(`Subscribed to /topic/room/${roomId}`);
        // Subscribe to room updates
        subscriptionRef.current = stompClient.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
          console.log('Message received from subscription callback');
          try {
            const payload: ChangeInterviewRoleResponseDTO = JSON.parse(message.body);
            console.log('Received role change:', payload);

            // Determine if the current user is now an interviewer
            const currentUserId = roomPayload.userDetails.userID;
            const isInterviewer = payload.peer1.interviewId === currentUserId
              ? payload.peer1.interviewRole === "Interviewer"
              : payload.peer2.interviewRole === "Interviewer";

            setIsInterviewerRole(isInterviewer);
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: (event) => {
        console.warn('WebSocket closed:', event);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      // Cleanup on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        console.log('Unsubscribed from /topic/room/' + roomId);
      }
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log('WebSocket client deactivated');
      }
    };
  }, [roomId, interviewId, roomPayload.userDetails.userID]);

  // Swap Role Handler
  const handleSwapRole = async () => {
    try {
      // Prepare the payload
      const swapRolePayload = {
        roomId: roomId,
        interviewId: parseInt(interviewId),
      };

      // Make the API call to swap role
      const response = await axiosWebSocketServiceClient.post(
        '/room/swap-role', // Adjust the endpoint as needed
        swapRolePayload
      );

      console.log('Swap role response:', response.data);

      // The role change will be handled via WebSocket subscription
      // Optionally, you can update the state immediately if needed
    } catch (error: any) {
      console.error('Error swapping role:', error);
      alert('Failed to swap role. Please try again.');
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-100 text-white p-4 flex justify-between items-center z-50 shadow-md">
        <button
          className="px-4 py-2 bg-blue-500 rounded"
          onClick={handleSwapRole}
        >
          Swap Role
        </button>
      </nav>

      {/* Main Content */}
      <main className="mt-16">
        <div
          style={{
            height: 'calc(100vh - 64px)', // Adjust based on navbar height
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
              flex: `0 0 ${dividerPosition}%`,
            }}
          >
            <VideoCall
              roomId={roomId}
              userName={roomPayload.userDetails.userName}
              userID={roomPayload.userDetails.userID.toString()}
              onEndCall={handleEndCall}
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
              flex: `1 1 ${100 - dividerPosition}%`,
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
