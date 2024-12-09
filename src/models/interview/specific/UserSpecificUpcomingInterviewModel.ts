import { UpcomingInterviewQuestionForPeerModel } from "./UpcomingInterviewQuestionForPeerModel";
import { UserSpecificInterviewsPayloadModel } from "./UserSpecificInterviewPayloadModel";
import { UserSpecificInterviewTypeModel } from "./UserSpecificInterviewTypeModel";


// TODO : this file is taking wrong
export interface UserSpecificUpcomingInterviewModel {
  interviewId: number;
  interviewType: UserSpecificInterviewTypeModel;
  interviewDateAndTime: string ;
  upcomingInterviewQuestionForPeer: UpcomingInterviewQuestionForPeerModel | null;
  }