import { PastInterviewsModel } from "./PastInterviewsModel";
import { UserSpecificUpcomingInterviewModel } from "./UserSpecificUpcomingInterviewModel";

export interface UserSpecificInterviewsPayloadModel {
  userInfo : UserInfoModel;
  upcomingInterviews: UserSpecificUpcomingInterviewModel[];
  pastInterviews: PastInterviewsModel;
}

interface    UserInfoModel{
    username: string;
    userProfileUrl:string ;
}