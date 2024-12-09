import { InterviewTypeModel } from "./InterviewTypeModel";
import { UpcomingInterviewQuestionForPeerModel } from "../specific/UpcomingInterviewQuestionForPeerModel";

export interface UpcomingInterviewModel {
    interviewId: string;
    interviewType: InterviewTypeModel;
    interviewDateAndTime: string | null;
    upcomingInterviewQuestionForPeer: UpcomingInterviewQuestionForPeerModel | null;
  }