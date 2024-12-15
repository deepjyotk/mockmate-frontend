// src/types/ChangeRoleRequest.ts

/**
 * Interface representing the request payload for changing an interview role.
 */
export interface ChangeRoleRequest {
    /**
     * The hash identifier of the room.
     */
    roomHash: string;
  
    /**
     * The ID of the interview whose role is to be changed.
     */
    interviewId: number;
  }
  

  