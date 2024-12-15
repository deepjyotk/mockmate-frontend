// File: hooks/useWebSocket.ts

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp, { Frame, Subscription } from 'stompjs';

interface UseWebSocketProps {
  roomId: string;
  interviewId: string;
  onRoomUpdate: (data: RoomResponseDTO) => void;
}
// File: models/room/RoomResponseDTO.ts

export interface RoomResponseDTO {
    /**
     * Details about the current user.
     */
    userDetails: UserDetails;
  
    /**
     * Details about the peer user (e.g., the other participant in the room).
     */
    peerInfo: PeerInfo;
  
    /**
     * Additional details about the room.
     */
    roomDetails: RoomDetails;
  }
  
  export interface UserDetails {
    /**
     * The name of the user.
     */
    userName: string;
  
    /**
     * The unique identifier for the user.
     */
    userID: number;
  
    /**
     * The current role of the user in the interview (e.g., "interviewer" or "candidate").
     */
    interviewRole: string[];
  }
  
  export interface PeerInfo {
    /**
     * The current question assigned to the peer user.
     */
    question: string;
  }
  
  export interface RoomDetails {
    /**
     * The scheduled end time for the interview.
     * This should be in ISO 8601 format (e.g., "2023-10-05T14:48:00Z").
     */
    interviewEndTime: string;
  }
  // File: src/models/room/UserRegistrationDTO.ts

export interface UserRegistrationDTO {
    /**
     * The unique identifier for the user's interview session.
     * This should correspond to the user's ID in the back-end system.
     */
    interviewId: number;
  
    /**
     * The unique identifier for the room the user is joining.
     * Users within the same room will communicate and receive updates.
     */
    roomId: string;
  }
  
  

const useWebSocket = ({ roomId, interviewId, onRoomUpdate }: UseWebSocketProps) => {
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const subscriptionsRef = useRef<Subscription | null>(null);

  useEffect(() => {
    // Initialize SockJS connection
    const socket = new SockJS('http://localhost:9090/ws'); // Adjust the URL if needed
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, (frame: Frame) => {
      console.log('Connected to WebSocket:', frame);

      // Send registration message
      const registration: UserRegistrationDTO = { interviewId: parseInt(interviewId), roomId };
      stompClient.send('/app/register', {}, JSON.stringify(registration));

      // Subscribe to the room topic
      const subscription = stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        const roomResponse: RoomResponseDTO = JSON.parse(message.body);
        onRoomUpdate(roomResponse);
      });

      subscriptionsRef.current = subscription;
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (subscriptionsRef.current) {
        subscriptionsRef.current.unsubscribe();
      }
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log('Disconnected from WebSocket');
        });
      }
    };
  }, [roomId, interviewId, onRoomUpdate]);
};

export default useWebSocket;


