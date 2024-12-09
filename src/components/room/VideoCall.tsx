'use client';

import React, { useEffect, useRef } from 'react';
import { ZegoInvitationType, ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  roomId: string;
  userName: string;
  userID: string;
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

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userName, userID }) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await generateKitToken(roomId, userID, userName);
        const zc = ZegoUIKitPrebuilt.create(token);

        if (videoContainerRef.current) {
          zc.joinRoom({
            container: videoContainerRef.current,
            showPreJoinView: false,
            sharedLinks: [],
            scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
            },
          });
        }
      } catch (error) {
        console.error(`Error initializing ZegoUIKit: ${error}`);
      }
    })();
  }, [roomId, userID, userName]);

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
