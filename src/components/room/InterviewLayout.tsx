// InterviewLayout.js
"use client";

import { GetRoomPayloadResponse } from "@/models/room/GetRoomPayloadResponse";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosWebSocketServiceClient from "@/services/axiosWebSocketClient";
import { ChangeInterviewRoleResponseDTO } from "@/models/room/ChangeRoleResponsePayloadModel";
import RoomNav from "./RoomNav";
import RoomMainComponent from "./RoomMainComponent";

interface InterviewLayoutProps {
  roomId: string;
  interviewId: string;
  roomPayload: GetRoomPayloadResponse;
}

const InterviewLayout = ({ roomId, interviewId, roomPayload }: InterviewLayoutProps) => {
  const [dividerPosition, setDividerPosition] = useState(50);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const [isInterviewerRole, setIsInterviewerRole] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsInterviewerRole(roomPayload.userDetails.interviewRole === "Interviewer");
  }, [roomPayload]);

  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const containerWidth = dividerRef.current?.parentElement?.offsetWidth || 1;
    const newDividerPosition = (e.clientX / containerWidth) * 100;
    setDividerPosition(Math.min(80, Math.max(20, newDividerPosition)));
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const handleEndCall = useCallback(() => {
    const currentTime = new Date();
    const interviewEndTime = new Date(roomPayload.roomDetails.interviewEndTime);
    const tenMinutesInMs = 10 * 60 * 1000;
    const timeDiff = Math.abs(currentTime.getTime() - interviewEndTime.getTime());


    //TODO: By passing --> future remove
    if (true || currentTime > interviewEndTime || timeDiff > tenMinutesInMs) {
      router.push(`/interviewfeedback/${encodeURIComponent(roomId)}/`);
    } else {
      router.push(`/`);
    }
  }, [roomId, roomPayload.roomDetails.interviewEndTime, router]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:9090/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const registrationPayload = { roomId: roomId, interviewId: parseInt(interviewId) };
        stompClient.publish({
          destination: "/app/register",
          body: JSON.stringify(registrationPayload),
        });
        subscriptionRef.current = stompClient.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
          try {
            const payload: ChangeInterviewRoleResponseDTO = JSON.parse(message.body);
            const currentUserRole = payload.peer1.interviewId.toString() === interviewId ? payload.peer1.interviewRole : payload.peer2.interviewRole;
            setIsInterviewerRole(currentUserRole === "Interviewer");
          } catch (error) {
            console.error("Error parsing message body:", error);
          }
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [roomId, interviewId]);

  const handleSwapRole = useCallback(async () => {
    try {
      const swapRolePayload = { roomId: roomId, interviewId: parseInt(interviewId) };
      await axiosWebSocketServiceClient.post("/room/swap-role", swapRolePayload);
    } catch (error) {
      console.error("Error swapping role:", error);
    }
  }, [roomId, interviewId]);

  const navbarRoleText = isInterviewerRole ? "Interviewer (You will ask questions to your peer)" : "Interviewee (Your peer will ask you questions)";

  return (
    <div className="relative">
      <RoomNav navbarRoleText={navbarRoleText} handleSwapRole={handleSwapRole} />
      <RoomMainComponent roomId={roomId} 
      roomPayload={roomPayload} isInterviewerRole={isInterviewerRole} 
      dividerPosition={dividerPosition} handleMouseDown={handleMouseDown} 
      handleEndCall={handleEndCall} />
    </div>
  );
};

export default InterviewLayout;