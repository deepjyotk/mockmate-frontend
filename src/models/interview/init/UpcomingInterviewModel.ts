import { InterviewTypeModel } from "@/models/home/InterviewTypeModel";
import { UpcomingInterviewQuestionForPeerModel } from "../specific/UpcomingInterviewQuestionForPeerModel";

export interface UpcomingInterviewModel {
    interviewId: string;
    interviewType: InterviewTypeModel;
    interviewDateAndTime: string | null;
    upcomingInterviewQuestionForPeer: UpcomingInterviewQuestionForPeerModel | null;
  }