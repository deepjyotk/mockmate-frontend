import React, { useRef, useState } from "react";
import VideoCall from "@/components/room/VideoCall/VideoCall";
import EditorMain from "./editor/EditorMain";
import { GetRoomPayloadResponse } from "@/models/room/GetRoomPayloadResponse";

interface SoftwareEngineeringComponentProps {
  roomId: string;
  roomPayload: GetRoomPayloadResponse; // Replace `any` with the appropriate type for roomPayload
  isInterviewerRole: boolean;
  handleEndCall: () => void;
}

const SoftwareEngineeringComponent: React.FC<SoftwareEngineeringComponentProps> = ({
  roomId,
  roomPayload,
  isInterviewerRole,
  handleEndCall,
}) => {
  const videoCallRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!videoCallRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const initialLeft = position.x;
    const initialTop = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      setPosition({ x: initialLeft + deltaX, y: initialTop + deltaY });
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    setDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-100 flex">
      {/* Main Editor Section */}
      <div className="flex-1">
        <EditorMain />
      </div>

      {/* Draggable Video Call Section */}
      <div
        ref={videoCallRef}
        className="absolute z-10 w-48 h-48 bg-white shadow-md border rounded-md"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
   <VideoCall
  roomId={roomId}
  userName={roomPayload?.userDetails?.userName || "Guest"}
  userID={roomPayload.userDetails?.userID.toString()}
  interviewTypeModel={roomPayload?.roomDetails.interviewType}
  isInterviewerRole={isInterviewerRole}
  onEndCall={handleEndCall}
/>

      </div>
    </div>
  );
};

export default SoftwareEngineeringComponent;
