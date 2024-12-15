import { PastInterviewsModel } from "@/models/interview/specific/PastInterviewsModel";
import { convertUTCToLocalTime } from "@/utils/datetime/formatToClientTimezone";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";



 interface PastInterviewQuestionForMeState {
    questionId: string;
    questionTitle: string;
}


interface PeerUserState{
    peerUserId: string;
    peerUserName: string;
} 


interface PastInterviewState {
    pastInterviewID: string;
    pastInterviewDateAndTime: string;
    pastInterviewType: string;
    questionForMe: PastInterviewQuestionForMeState;
    peerUser: PeerUserState;
}

// Define the Status enum
export enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

// Define the initial state interface
interface PastInterviewSectionState {
    page: string;
    limit: string;
    totalListings: string;
    totalPages: string;
    results: PastInterviewState[];
    status: Status;
    error: string | null;
}

// Initial state
const initialState: PastInterviewSectionState = {
  page: "1", 
  limit: "10",
  totalListings: "0",
  totalPages: "0",
  results: [],
  status: Status.Idle,
  error: null,
};


export const mapModelToState = (
  models: PastInterviewsModel
): PastInterviewSectionState => {
  return {
    
    page: models.page.toString(),
    limit: models.limit.toString(),
    totalListings: models.totalListings.toString(),
    totalPages: models.totalPages.toString(),
    results: models.results.map( (model) =>{
        return {
            pastInterviewID: model.pastInterviewID,
            pastInterviewDateAndTime:  convertUTCToLocalTime(model.pastInterviewDateAndTime),
            pastInterviewType: model.pastInterviewType,
            questionForMe: {
              questionId: model.questionForMe.questionId,
              questionTitle: model.questionForMe.questionTitle,
            },
            peerUser: {
              peerUserId: model.peerUser.peerUserId,
              peerUserName: model.peerUser.peerUserName,
            },
        
        };
    }),
    status: Status.Success,
    error: null, 
  }
};

// Create the slice
const pastInterviewSectionSlice = createSlice({
  name: "pastInterviewSection",
  initialState,
  reducers: {
    initializeScheduleState: (
      state,
      action: PayloadAction<PastInterviewSectionState>
    ) => {
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalListings = action.payload.totalListings;
        state.totalPages = action.payload.totalPages;
        state.results = action.payload.results;
        state.status = action.payload.status;
        state.error = action.payload.error;  
    },
}});

export const { initializeScheduleState } = pastInterviewSectionSlice.actions;

export default pastInterviewSectionSlice.reducer;