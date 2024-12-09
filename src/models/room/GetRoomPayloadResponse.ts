// interfaces.ts

export interface GetRoomPayloadResponse {
    roomDetails: {
      roomIDHash: string;
      interviewID: number;
    };
    userDetails: {
      userID: number;
      userName: string;
      fullName: string;
      interviewRole: 'Interviewer' | 'Interviewee';
    };
    peerInfo: {
      peerRole: 'Interviewer' | 'Interviewee';
      question: QuestionModel ; 
    };
  }
  

  export interface QuestionModel {
      questionID: number;
      questionS3Url: string;
      questionTitle: string;
      interviewTypeId: string ;
      questionDifficultyID: number ;
      tags: string[];
      companies: {
        companyID: number; 
        frequencyAsked: string;
        lastAskedDate: string | null;
      }[];
    
  }


