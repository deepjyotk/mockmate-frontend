// InterviewModel.ts

import { TimeslotModel } from './TimeslotModel';

export interface InterviewModel {
  interview_id: string;
  type: string;
  slots: TimeslotModel[];
}
