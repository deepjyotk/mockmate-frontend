// DataModel.ts

import { InterviewLevelModel } from './InterviewLevelModel';
import { InterviewTypeModel } from './InterviewTypeModel';
import { ScheduleModel } from './ScheduleModel';

export interface InitialDataModel {
  interviewLevels: InterviewLevelModel[];
  interviewTypes: InterviewTypeModel[];
  schedules: ScheduleModel[];
}
