// signupSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SignupRequest } from "@/models/auth/signup/signupRequest";
import { SignupResponseModel } from "@/models/auth/signup/signupResponse";
import { ExceptionResponseModel } from "@/models/global/ExceptionResponseModel";
import { axiosPostRequest } from "@/services/axiosService";

export enum signupRequestType {
  requestOTP,
  verifyOtpAndRegister
}

// Async thunk for user signup
export const requestOTPThunk = createAsyncThunk<
  SignupResponseModel,
  SignupRequest,
  { rejectValue: string }
>("auth/requestOTPThunk", async (credentials, { rejectWithValue }) => {
  try {
    const data = await axiosPostRequest('/auth/request-otp', credentials);

    if ("error" in data) {
      const error = data as ExceptionResponseModel;
      return rejectWithValue(error.message || "Signup failed");
    }

    // Assuming the server sets the HTTP-only cookie here
    return data.payload as SignupResponseModel;
  } catch {
    return rejectWithValue("Signup failed");
  }
});

// Async thunk for user signup
export const verifyOtpAndRegister = createAsyncThunk<
  SignupResponseModel,
  SignupRequest,
  { rejectValue: string }
>("auth/verifyOtpAndRegister", async (credentials, { rejectWithValue }) => {
  try {
    const data = await axiosPostRequest('/auth/verify-otp-and-register', credentials);

    if ("error" in data) {
      const error = data as ExceptionResponseModel;
      return rejectWithValue(error.message || "Signup failed");
    }

    // Assuming the server sets the HTTP-only cookie here
    return data.payload as SignupResponseModel;
  } catch {
    return rejectWithValue("Signup failed");
  }
});

// Async thunk for submitting signup with validation
export const submitSignup = createAsyncThunk<
  void,
  signupRequestType,
  {
    state: { signup: typeof initialState };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: any;
    rejectValue: string;
  }
>("auth/submitSignup", async (typeReq, { getState, dispatch, rejectWithValue }) => {
  const {
    otp ,
    username,
    email,
    password,
    confirmPassword,
    rolesTargeting,
    relevantWorkExperience,
  } = getState().signup;

  // Client-side validations
  if (!username || username.length < 3) {
    return rejectWithValue("Username must be at least 3 characters long.");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return rejectWithValue("Invalid email address.");
  }
  if (!password || password.length < 6) {
    return rejectWithValue("Password must be at least 6 characters long.");
  }
  if (password !== confirmPassword) {
    return rejectWithValue("Passwords do not match.");
  }
  if (!rolesTargeting.length) {
    return rejectWithValue("Select at least one role.");
  }

  const signupRequest: SignupRequest = {
    otp,
    username,
    email,
    password,
    role: "FREE_USER",
    universityMajor: "Computer Science",
    universityName: "New York University",
    rolesTargeting,
    relevantWorkExperience,
  };

  if(typeReq == signupRequestType.requestOTP){
    await dispatch(requestOTPThunk(signupRequest));
  }else{
    await dispatch(verifyOtpAndRegister(signupRequest));
  }
});



// Define the initial state for signup
interface SignupState {
  otp: string; 
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rolesTargeting: string[];
  relevantWorkExperience: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SignupState = {
  otp:"", 
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  rolesTargeting: [],
  relevantWorkExperience: 0,
  status: "idle",
  error: null,
};

// Create the signup slice
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setOTP: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
      state.error = null;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.error = null;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.error = null;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      state.error = null;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
      state.error = null;
    },
    setRolesTargeting: (state, action: PayloadAction<string[]>) => {
      state.rolesTargeting = action.payload;
      state.error = null;
    },
    setRelevantWorkExperience: (state, action: PayloadAction<number>) => {
      state.relevantWorkExperience = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOTPThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        requestOTPThunk.fulfilled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (state, action: PayloadAction<SignupResponseModel>) => {
          state.status = "succeeded";
          state.error = null;
          // Removed the client-side cookie setting
          // The server should set the HTTP-only cookie
        }
      )
      .addCase(requestOTPThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Validation failed";
      });
  },
});

// Export actions and reducer
export const {
  setOTP,
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  setRolesTargeting,
  setRelevantWorkExperience,
} = signupSlice.actions;

export default signupSlice.reducer;