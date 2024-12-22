import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { InterviewTypeModel } from "@/models/home/InterviewTypeModel";

interface VideoCallProps {
  roomId: string;
  userName: string;
  userID: string;
  interviewTypeModel: InterviewTypeModel;
  isInterviewerRole: boolean;
  onEndCall: () => void;
}

const generateKitToken = async (roomId: string, userID: string, userName: string) => {
  const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID || "0", 10);
  const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || "";
  if (!appID || !serverSecret) {
    throw new Error("Missing AppID or ServerSecret in .env file");
  }

  return ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userID, userName);
};

const VideoCall: React.FC<VideoCallProps> = ({
  roomId,
  userName,
  userID,
  interviewTypeModel: InterviewTypeModel,
  onEndCall,
}) => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const zegoInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeZego = async () => {
      try {
        const token = await generateKitToken(roomId, userID, userName);
        const zegoInstance = ZegoUIKitPrebuilt.create(token);

        zegoInstanceRef.current = zegoInstance;

        if (videoContainerRef.current) {
          zegoInstance.joinRoom({
            container: videoContainerRef.current,
            showPreJoinView: false,
            scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
            },
            onLeaveRoom: onEndCall,
          });
        }
      } catch (error) {
        console.error("Error initializing ZegoUIKit:", error);
      }
    };

    initializeZego();

    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
    };
  }, [roomId, userID, userName, onEndCall]);

  return (
    <div ref={videoContainerRef} className="w-full h-full bg-gray-200">
      {/* Video content is rendered here */}
    </div>
  );
};

export default VideoCall;
