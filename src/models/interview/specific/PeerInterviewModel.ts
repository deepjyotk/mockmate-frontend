import { PastInterviewQuestionForMeModel } from "./PastInterviewQuestionForMeModel";
import { PeerUserModel } from "./PeerUserModel";

export interface PastInterviewModel {
    pastInterviewID: string;
    pastInterviewDateAndTime: string;
    pastInterviewType: string;
    questionForMe: PastInterviewQuestionForMeModel;
    peerUser: PeerUserModel;
    feedbackByPeer: FeedbackByPeerModel ;
    feedbackGiven: boolean ;
    roomIDHash: string;
}
  



export interface FeedbackByPeerModel {
    /**
     * Communication skills rating between 1 and 5.
     * **Required**
     */
    communicationSkillsRating: number;
  
    /**
     * Technical skills rating between 1 and 5.
     * **Optional**
     */
    technicalSkillsRating?: number;
  
    /**
     * Text describing what the peer did well.
     * Maximum length: 500 characters.
     * **Optional**
     */
    didWellText?: string;
  
    /**
     * Text describing things the peer can improve.
     * Maximum length: 500 characters.
     * **Optional**
     */
    thingsToImproveText?: string;
  
    /**
     * Indicates whether the peer is selected for the next round.
     * **Required**
     */
    nextRoundSelection: boolean;
  
    /**
     * Rating indicating how good a match the peer is.
     * Between 1 and 5.
     * **Required**
     */
    goodMatchForPeerRating: number;
  }
  