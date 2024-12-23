// RoomMainComponent.js
"use client";

import { GetRoomPayloadResponse } from "@/models/room/GetRoomPayloadResponse";
import BehavioralInterviewComponent from "./BehavioralInterviewComponent/BehavioralInterviewComponent";
import SoftwareEngineeringComponent from "./SoftwareEngineeringComponent/SoftwareEngineeringComponent";

interface RoomMainComponentProps {
  roomId: string;
  roomPayload: GetRoomPayloadResponse;
  isInterviewerRole: boolean;
  dividerPosition: number;
  handleMouseDown: () => void;
  handleEndCall: () => void;
}

const RoomMainComponent = ({
  roomId,
  roomPayload,
  isInterviewerRole,
  dividerPosition,
  handleMouseDown,
  handleEndCall,
}: RoomMainComponentProps) => {
//   const leftPanelRef = useRef<HTMLDivElement | null>(null);
//   const rightPanelRef = useRef<HTMLDivElement | null>(null);
//   const dividerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="mt-16">
      {roomPayload.roomDetails.interviewType.type === "Software Engineering" ? (
        <SoftwareEngineeringComponent
          roomId={roomId}
          roomPayload={roomPayload}
          isInterviewerRole={isInterviewerRole}
          dividerPosition={dividerPosition}
          handleMouseDown={handleMouseDown}
          handleEndCall={handleEndCall}
        />
      ) : (
        <BehavioralInterviewComponent
          roomId={roomId}
          roomPayload={roomPayload}
          isInterviewerRole={isInterviewerRole}
          dividerPosition={dividerPosition}
          handleMouseDown={handleMouseDown}
          handleEndCall={handleEndCall}
        />
      )}
    </main>
  );
};

export default RoomMainComponent;
