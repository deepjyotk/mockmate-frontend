'use client';

import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  roomId: string;
  userName: string;
  userID: string;
  onEndCall: () => void; // New prop for end call event
}

const generateKitToken = async (
  roomId: string,
  userID: string,
  userName: string
): Promise<string> => {
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID ?? '0', 10);
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET ?? '';
  if (!appID) throw new Error('Missing AppID in .env file');
  if (!serverSecret) throw new Error('Missing ServerSecret in .env file');

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userID, userName);
  return kitToken;
};

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userName, userID, onEndCall }) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null); // Reference to the ZegoUIKitPrebuilt instance

  useEffect(() => {
    (async () => {
      try {
        const token = await generateKitToken(roomId, userID, userName);
        const zc = ZegoUIKitPrebuilt.create(token);
        
        // Store the instance in the ref
        zegoInstanceRef.current = zc;

        if (videoContainerRef.current) {
          zc.joinRoom({
            container: videoContainerRef.current,
            showPreJoinView: false,
            sharedLinks: [],
            scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
            },
            onLeaveRoom: () => {
              console.log('User has left the room');
              onEndCall();
            }
          });
        }
      } catch (error) {
        console.error(`Error initializing ZegoUIKit: ${error}`);
      }
    })();

    // Cleanup function to leave the room and destroy the Zego instance
    return () => {
      if (zegoInstanceRef.current) {
        console.log('Destroying Zego instance');
        zegoInstanceRef.current.destroy(); // Use destroy() instead of leaveRoom()
        zegoInstanceRef.current = null;
      }
    };
  }, [roomId, userID, userName, onEndCall]);

  return (
    <div
      ref={videoContainerRef}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 0,
      }}
    />
  );
};

export default VideoCall;
