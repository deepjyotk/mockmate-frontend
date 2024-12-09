// ScheduleModel.ts

import { InterviewModel } from "./InterivewModel";



export interface ScheduleModel {
  id: string;
  date: string; // ISO date format
  interviews: InterviewModel[];
}
