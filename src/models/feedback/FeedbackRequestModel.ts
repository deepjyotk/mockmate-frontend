export interface FeedbackRequestModel {
    roomHash: string; 
    peerFeedback: PeerFeedbackModel;
  }
  
  export interface PeerFeedbackModel {
    communicationSkillsRating: number; // 1-5
    technicalSkillsRating?: number; // 1-5 (nullable, hence optional)
    didWellText: string;
    thingsToImproveText: string;
    nextRoundSelection: boolean;
    goodMatchForPeerRating: number; // 1-5
  }
  