import { InterviewModel } from "../../home/InterivewModel";
import { InterviewLevelModel } from "./InterviewLevelModel";

export interface InitDataInterviewPayloadModel {
    interview_levels: InterviewLevelModel[];
    interviews: InterviewModel[];
  }