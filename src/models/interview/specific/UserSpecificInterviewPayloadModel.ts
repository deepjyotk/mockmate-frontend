// src/models/interview/InterviewPayloadModel.ts
import { PastInterviewsModel } from "./PastInterviewsModel";
import { UserSpecificUpcomingInterviewModel } from "./UserSpecificUpcomingInterviewModel";
import { UserSpecificUpcomingInterviewsModel } from "./UserSpecificUpcomingInterviewsModel";

export interface UserSpecificInterviewsPayloadModel {
  upcomingInterviews: UserSpecificUpcomingInterviewModel[];
  pastInterviews: PastInterviewsModel;
}