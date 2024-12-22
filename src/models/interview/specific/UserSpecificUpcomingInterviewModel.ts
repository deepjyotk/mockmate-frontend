import { InterviewTypeModel } from "@/models/home/InterviewTypeModel";
import { UpcomingInterviewQuestionForPeerModel } from "./UpcomingInterviewQuestionForPeerModel";



export interface UserSpecificUpcomingInterviewModel {
  interviewId: number;
  interviewType: InterviewTypeModel;
  interviewDateAndTime: string ;
  upcomingInterviewQuestionForPeer: UpcomingInterviewQuestionForPeerModel | null;
  }