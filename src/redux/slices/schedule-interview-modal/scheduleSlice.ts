/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExceptionResponseModel } from '@/models/global/ExceptionResponseModel';
import { SuccessfulResponseModel } from '@/models/global/SuccessResponseModel';
import { InitDataInterviewPayloadModel } from '@/models/interview/init/InterviewPayloadModel';
import { ScheduleInterviewRequestModel } from '@/models/interview/init/ScheduleInterviewRequestModel';
import { ScheduleInterviewResponseModel } from '@/models/interview/init/ScheduleInterviewResponseModel';
import { axiosPostRequest } from '@/services/axiosService';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';


const categorizeTimes = (utcDateTime: string): string => {
  const date = new Date(utcDateTime);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isThisWeek(date)) return format(date, 'EEEE'); // e.g., "Monday"
  return format(date, 'MMMM do'); // e.g., "December 3rd"
};

// Define enums
enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

// Define types for nested objects
interface InterviewType {
  interviewTypeId: string;
}

interface InterviewLevel {
  interviewLevelId: string;
}

interface InterviewTime {
  slotId: string;
}

interface InterviewTypeOption {
  interviewId: string;
  type: string;
}

interface DifficultyLevelOption {
  interviewLevelId: string;
  level: string;
}

interface TimeSlotOption{
  slotId : string ;
  time: string ;
}


interface InterviewTimeOption {
  interviewTypeId: string;
  times: TimeSlotOption[] ;
}



interface InitialBindingOption{
  interviewTypes: InterviewTypeOption[] ;
  difficultyLevels: DifficultyLevelOption[] ;
  interviewTimes: InterviewTimeOption[] ;
}


// Define the state interface
interface InterviewScheduleState {
  interviewType?: InterviewType | null; // Optional property
  interviewLevel?: InterviewLevel | null; // Optional property
  interviewTime?: InterviewTime | null; // Optional property
  interviewTypes: InterviewTypeOption[]; // Default empty array
  difficultyLevels: DifficultyLevelOption[]; // Default empty array
  interviewTimes: InterviewTimeOption[]; // Default empty array
  status: Status; // Use an enum for clarity
  error: string | null; // Default to null
}

// Initialize the state
const initialState: InterviewScheduleState = {
  interviewType: null,
  interviewLevel: null,
  interviewTime: null,
  // Optional properties are omitted if not set
  interviewTypes: [], // Default to an empty array
  difficultyLevels: [], // Default to an empty array
  interviewTimes: [], // Default to an empty array
  status: Status.Idle, // Use the enum
  error: null, // Default to null
};

// Define async thunk for scheduling the interview
export const scheduleInterviewThunk = createAsyncThunk<
ScheduleInterviewResponseModel, // Return type
  void, // Argument type
  { state: { schedule: InterviewScheduleState }; rejectValue: string }
>(
  'schedule/scheduleInterview',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().schedule;
    const { interviewType, interviewLevel, interviewTime } = state;

    try {
      if (!interviewType || !interviewLevel || !interviewTime) {
        return rejectWithValue('Missing required fields');
      }

      // Map Redux state to ScheduleInterviewRequestModel
      const requestData: ScheduleInterviewRequestModel = {
        interviewTypeId: interviewType.interviewTypeId,
        interviewLevelId: interviewLevel.interviewLevelId,
        interviewSlotId: interviewTime.slotId,
        additionalDescription: 'I want Hard Questions', // Hard-coded as per your requirement
      };
  
        const response = await axiosPostRequest(`/interviews/scheduleInterview`,requestData);
        if("error" in response){
          const error = response as ExceptionResponseModel ; 
          return rejectWithValue(error.message || 'Failed to schedule interview');  
        }else{
          const sucess = response as SuccessfulResponseModel ;
          return (sucess.payload) as ScheduleInterviewResponseModel;
        }
     

    } catch (error: any) {
      // Handle unexpected errors
      return rejectWithValue('Failed to schedule interview');
    }
  }
);

// Create the slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setInterviewType(state, action: PayloadAction<string>) {
      if (!state.interviewType) {
        state.interviewType = { interviewTypeId: action.payload };
      } else {
        state.interviewType.interviewTypeId = action.payload;
      }
    },
    setInterviewLevel(state, action: PayloadAction<string>) {
      if (!state.interviewLevel) {
        state.interviewLevel = { interviewLevelId: action.payload };
      } else {
        state.interviewLevel.interviewLevelId = action.payload;
      }
    },
    setInterviewTime(state, action: PayloadAction<string>) {
      if (!state.interviewTime) {
        state.interviewTime = { slotId: action.payload };
      } else {
        state.interviewTime.slotId = action.payload;
      }
    },
    resetScheduleState(state) {
      state.interviewType = undefined;
      state.interviewLevel = undefined;
      state.interviewTime = undefined;
      state.status = Status.Idle;
      state.error = null;
    },
    initializeScheduleState(
      state,
      action: PayloadAction<InitialBindingOption>
    ) {
      state.interviewTypes = action.payload.interviewTypes;
      state.difficultyLevels = action.payload.difficultyLevels;
      state.interviewTimes = action.payload.interviewTimes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scheduleInterviewThunk.pending, (state) => {
        state.status = Status.Loading;
        state.error = null;
      })
      .addCase(scheduleInterviewThunk.fulfilled, (state) => {
        state.status = Status.Success;
      })
      .addCase(scheduleInterviewThunk.rejected, (state, action) => {
        state.status = Status.Error;
        state.error = action.payload || 'Failed to schedule interview';
      });
  },
});

// Utility function to format date and time
const formatDateTime = (utcDateTime: string) => {
  const date = new Date(utcDateTime);

  // Format the day with ordinal suffix
  const day = date.getDate();
  const dayWithSuffix =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");

  // Format the month abbreviation
  const month = date.toLocaleString("en-US", { month: "short" });

  // Format the time in 12-hour format with AM/PM
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Combine everything
  return `${dayWithSuffix} ${month}, ${time}`;
};

// Utility function to map initial data to Redux state
export const mapInitialDataToReduxState = (data: InitDataInterviewPayloadModel): InitialBindingOption => {
  return {
    interviewTypes: data.interviews.map((x) => ({
      interviewId: x.interview_id, // Assuming each interview has an 'id' field
      type: x.type,
    })),
    difficultyLevels: data.interview_levels.map((level) => ({
      interviewLevelId: level.id.toString(), // Assuming each level has an 'id' field
      level: level.level, // Assuming each level has a 'name' field
    })),
    interviewTimes: data.interviews.map((interview)=>{
      console.log(interview.slots) ;
      
      return {
      interviewTypeId: interview.interview_id, 
      times: interview.slots.sort((a, b) => a.slot_date_time.localeCompare(b.slot_date_time)).map((time) => {
        const utcDate = new Date(time.slot_date_time); // Parse the UTC date
        const localDate = utcDate.toLocaleString();
        const formattedDateTime = formatDateTime(time.slot_date_time);
        return {
        slotId: time.slot_id, // Assuming each timeslot has an 'id' field
        time: formattedDateTime, 
      }
    }
    ),
    }}),
  };
};

// Export actions
export const {
  setInterviewType,
  setInterviewLevel,
  setInterviewTime,
  resetScheduleState,
  initializeScheduleState,
} = scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
