import { PastInterviewQuestionForMeModel } from "./PastInterviewQuestionForMeModel";
import { PeerUserModel } from "./PeerUserModel";

export interface PastInterviewModel {
    pastInterviewID: string;
    pastInterviewDateAndTime: string;
    pastInterviewType: string;
    questionForMe: PastInterviewQuestionForMeModel;
    peerUser: PeerUserModel;
}
  