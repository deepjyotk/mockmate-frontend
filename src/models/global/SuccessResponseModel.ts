import { LoginResponse } from "../auth/loginResponse";
import { SignupResponseModel } from "../auth/signup/signupResponse";
import { InitDataInterviewPayloadModel } from "../interview/init/InterviewPayloadModel";
import { ScheduleInterviewResponseModel } from "../interview/init/ScheduleInterviewResponseModel";
import { UserSpecificInterviewsPayloadModel } from "../interview/specific/UserSpecificInterviewPayloadModel";
import { QuestionResponsePayloadModel } from "../question/particular/QuestionResponsePayloadModel";
import { GetRoomPayloadResponse } from "../room/GetRoomPayloadResponse";
import { RoomResponsePayloadModel } from "../room/RoomResponsePayloadModel";

export interface SuccessfulResponseModel{
    message: string;
    payload: InitDataInterviewPayloadModel | SignupResponseModel | LoginResponse | ScheduleInterviewResponseModel | UserSpecificInterviewsPayloadModel | QuestionResponsePayloadModel | RoomResponsePayloadModel | GetRoomPayloadResponse; 
    timestamp: string; 
    status: string; 
  }
  