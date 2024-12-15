export interface ChangeInterviewRoleResponseDTO {
    /**
     * The hash identifier of the room.
     */
    roomHash: string;
  
    /**
     * Details of the first peer in the room.
     */
    peer1: PeerDTOModel;
  
    /**
     * Details of the second peer in the room.
     */
    peer2: PeerDTOModel;
  }


  export interface PeerDTOModel {
    /**
     * The unique identifier of the interview.
     */
    interviewId: number;
  
    /**
     * The role of the interview participant.
     * Possible values: "Interviewer" or "Interviewee".
     */
    interviewRole: InterviewRoleModel;
  }

  export enum InterviewRoleModel {
    INTERVIEWER = "Interviewer",
    INTERVIEWEE = "Interviewee",
  }