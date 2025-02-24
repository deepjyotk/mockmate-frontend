/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserSpecificUpcomingInterviewModel } from "@/models/interview/specific/UserSpecificUpcomingInterviewModel";
import { QuestionResponsePayloadModel } from "@/models/question/particular/QuestionResponsePayloadModel";
import { RoomResponsePayloadModel } from "@/models/room/RoomResponsePayloadModel";
import { axiosGetRequest, axiosPostRequest } from "@/services/axiosService";
import { Empty } from "@/types/Empty";
import { convertToUTC, formatToClientTimezone } from "@/utils/datetime/formatToClientTimezone";

import { getDifferenceInSeconds } from "@/utils/datetime/getDifferenceFromNow";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserSpecificInterviewTypeState {
  durationMinutes: string;
  interviewTypeDescription: string;
  interviewTypeId: string;
  interviewTypeTitle: string;
}

export interface UpcomingInterviewQuestionForPeerState {
  questionID: string;
  questionTitle: string;
  questionDescription: string;
}

export interface UserSpecificUpcomingInterviewState {
  interviewId: string;
  interviewType: UserSpecificInterviewTypeState;
  interviewDateAndTime: string;
  upcomingInterviewQuestionForPeer: UpcomingInterviewQuestionForPeerState;
  counter: string ;
  reverseCountdownText: string
}

// Define the Status enum
export enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

// Define the initial state interface
interface UpcomingInterviewSectionState {
  upcomingInterviews: UserSpecificUpcomingInterviewState[];
  status: Status;
  error: string | null;
}

// Initial state
const initialState: UpcomingInterviewSectionState = {
  upcomingInterviews: [],
  status: Status.Idle,
  error: null,
};
const REMAINING_TIMING_DIFF_STARTS = 3600 ;
const JOIN_INTERVIEW_BUTTON_ENABLED = 60 ;
const ALLOW_TO_JOIN_AFTER_INTERVIEW_TIME = 1000 ;


//TODO: remove this
export const viewPeerQuestion = createAsyncThunk<
QuestionResponsePayloadModel, // Return type
  string, // Argument type
  { state: { upcomingInterviewSection: UpcomingInterviewSectionState }; rejectValue: string }
>(
  "upcomingInterviewSection/viewPeerQuestion",
  async (questionID: string, { rejectWithValue }) => {
    try {
      const response = await axiosGetRequest(`/questions/${questionID}`);
      if ("error" in response) {
        return rejectWithValue(response.message);
      }
      return response.payload as QuestionResponsePayloadModel;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "An error occurred.");
    }
  }
);

export const joinInterview = createAsyncThunk<
RoomResponsePayloadModel, // Return type
  string, // Argument type
  { state: { upcomingInterviewSection: UpcomingInterviewSectionState }; rejectValue: string }
>(
  "upcomingInterviewSection/joinInterview",
  async (interviewId: string, { rejectWithValue }) => {
    try {
      const x: Empty ={};
      const response = await axiosPostRequest(`/room/join-waiting-room?interviewId=${interviewId}`,x);
      if ("error" in response) {
        return rejectWithValue(response.message);
      }

      
      return response.payload as RoomResponsePayloadModel;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "An error occurred.");
    }
  }
);

// Mapper function to convert model to state
export const mapModelToState = (
  models: UserSpecificUpcomingInterviewModel[]
): UserSpecificUpcomingInterviewState[] => {
  return models.map((model) => ({
    counter: getDifferenceInSeconds( (model.interviewDateAndTime) ).toString(),
    reverseCountdownText: '',
    interviewId: model.interviewId.toString(),
    interviewType: {
      durationMinutes: model.interviewType.toString(),
      interviewTypeDescription: model.interviewType.durationMinutes.toString(),
      interviewTypeId: model.interviewType.id.toString(),
      interviewTypeTitle: model.interviewType.type,
    },
    interviewDateAndTime: formatToClientTimezone( model.interviewDateAndTime ),
    upcomingInterviewQuestionForPeer: {
      questionID: model.upcomingInterviewQuestionForPeer
        ? model.upcomingInterviewQuestionForPeer.questionID.toString()
        : "",
      questionTitle: model.upcomingInterviewQuestionForPeer
        ? model.upcomingInterviewQuestionForPeer.questionTitle
        : "TBA",
      questionDescription: model.upcomingInterviewQuestionForPeer
        ? model.upcomingInterviewQuestionForPeer.questionDescription
        : "TBA",
    },
  }));
};

// Create the slice
const upcomingInterviewSectionSlice = createSlice({
  name: "upcomingInterviewSection",
  initialState,
  reducers: {
    initializeScheduleState: (
      state,
      action: PayloadAction<UserSpecificUpcomingInterviewState[]>
    ) => {
      state.upcomingInterviews = action.payload;
      state.status = Status.Success;
      state.error = null;
    
    },
    decrementAllCountdowns: (state) => {
        state.upcomingInterviews.forEach((interview) => {
          const utcTime = convertToUTC(interview.interviewDateAndTime);
          const remainingSeconds = getDifferenceInSeconds(utcTime!);
          if (remainingSeconds > 0) { 
            interview.counter = remainingSeconds.toString();
            if (remainingSeconds <= REMAINING_TIMING_DIFF_STARTS && remainingSeconds> JOIN_INTERVIEW_BUTTON_ENABLED) {
              interview.reverseCountdownText = `${Math.floor(remainingSeconds / 60)}m ${remainingSeconds % 60}s`;
            } else if(remainingSeconds <= REMAINING_TIMING_DIFF_STARTS && remainingSeconds <= JOIN_INTERVIEW_BUTTON_ENABLED){
              interview.reverseCountdownText = "Join Interview";
            }else{
                interview.reverseCountdownText = "";
            }
          } else if(Math.abs(remainingSeconds) <= ALLOW_TO_JOIN_AFTER_INTERVIEW_TIME ) {
            interview.reverseCountdownText = "Join Interview";
          }else{
            interview.reverseCountdownText = "Expired";
          }
        });
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewPeerQuestion.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;        
      })
      .addCase(viewPeerQuestion.fulfilled, (state, action) => {
        state.status = Status.Success;
         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
         action.payload.questionS3Url ; // TODO: this contains the s3 of the file, and I want to open in the new tab with custom url in the tab, and not show the s3 url, how to do?
        console.log("Fetched Question:", action.payload);
      })
      .addCase(viewPeerQuestion.rejected, (state, action) => {
        state.status = Status.Error;
        state.error = action.payload as string;
      })

      .addCase(joinInterview.pending, (state)=>{})
      .addCase(joinInterview.fulfilled, (state, action)=>{})
      .addCase(joinInterview.rejected, (state, action)=>{
        state.status = Status.Error;
        state.error = action.payload as string;
      })
  },
});

export const { initializeScheduleState , decrementAllCountdowns} = upcomingInterviewSectionSlice.actions;
export default upcomingInterviewSectionSlice.reducer;