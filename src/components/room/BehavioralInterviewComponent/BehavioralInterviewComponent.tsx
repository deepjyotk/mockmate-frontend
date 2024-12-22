// BehavioralInterviewComponent.js

import VideoCall from "@/components/room/VideoCall/VideoCall";
import QuestionSection from "@/components/room/QuestionSection";
import { useRef } from "react";
import { GetRoomPayloadResponse } from "@/models/room/GetRoomPayloadResponse";

interface BehavioralInterviewComponentProps {
  roomId: string;
  roomPayload: GetRoomPayloadResponse;
  isInterviewerRole: boolean;
  dividerPosition: number;
  handleMouseDown: () => void;
  handleEndCall: () => void;
}

const BehavioralInterviewComponent = ({
  roomId,
  roomPayload,
  isInterviewerRole,
  dividerPosition,
  handleMouseDown,
  handleEndCall,
}: BehavioralInterviewComponentProps) => {
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDownInternal = () => {
    if (handleMouseDown) handleMouseDown();
  };

  const handleEndCallInternal = () => {
    if (handleEndCall) handleEndCall();
  };

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        ref={leftPanelRef}
        className="flex flex-col bg-gray-100"
        style={{ flex: `0 0 ${isInterviewerRole ? dividerPosition : 100}%` }}
      >
        <VideoCall
          roomId={roomId}
          userName={roomPayload?.userDetails?.userName || "Guest"}
          userID={roomPayload?.userDetails?.userID?.toString() || "0"}
          onEndCall={handleEndCallInternal}
          interviewTypeModel={roomPayload?.roomDetails?.interviewType || "General"}
          isInterviewerRole={isInterviewerRole}
        />
      </div>

      <div>
        {isInterviewerRole && (
          <div>
            <div
              ref={dividerRef}
              className="w-px cursor-col-resize bg-gray-300"
              onMouseDown={handleMouseDownInternal}
            ></div>

            <div
              ref={rightPanelRef}
              className="flex flex-col bg-white overflow-y-auto"
              style={{ flex: `1 1 ${100 - dividerPosition}%` }}
            >
              <div className="p-5 h-full overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                  Interview Questions
                </h2>
                <QuestionSection question={roomPayload?.peerInfo?.question || "No question available"} />
              </div>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
};

export default BehavioralInterviewComponent;
