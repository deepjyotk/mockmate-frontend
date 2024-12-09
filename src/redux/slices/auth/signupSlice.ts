import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SignupRequest } from "@/models/auth/signup/signupRequest";
import Cookies from 'js-cookie';
import { SignupResponseModel } from "@/models/auth/signup/signupResponse";
import { ExceptionResponseModel } from "@/models/global/ExceptionResponseModel";
import { axiosPostRequest } from "@/services/axiosService";


export const signupUser = createAsyncThunk<
  SignupResponseModel,
  SignupRequest,
  { rejectValue: string }
>("auth/signupUser", async (credentials, { rejectWithValue }) => {
  try {
    const data = (await axiosPostRequest('/auth/register', credentials) );

    if("error" in data) {
       const error = data as ExceptionResponseModel ;
      return rejectWithValue( error.message || "Signup failed");
    }
    
    return data.payload as SignupResponseModel ;
  } catch (error: any) {
    return rejectWithValue("Signup failed");
  }
});

export const submitSignup = createAsyncThunk<
  void,
  void,
  {
    state: { signup: typeof initialState };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch: any;
    rejectValue: string;
  }
>("auth/submitSignup", async (_, { getState, dispatch, rejectWithValue }) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    rolesTargeting,
    relevantWorkExperience,
  } = getState().signup;

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
    username,
    email,
    password,
    role: "FREE_USER",
    universityMajor: "Computer Science",
    universityName: "New York University",
    rolesTargeting,
    relevantWorkExperience,
  };

  await dispatch(signupUser(signupRequest));
});

interface SignupState {
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
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  rolesTargeting: [],
  relevantWorkExperience: 0,
  status: "idle",
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
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
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<SignupResponseModel>) => {
        state.status = "succeeded";
        state.error = null;
        if (action.payload.token) {
          // localStorage.setItem("accessToken", action.payload.token);
          Cookies.set('accessToken', action.payload.token, {
            expires: 7, // Expires in 7 days
            path: '/', // Cookie available throughout the site
            // sameSite: 'strict', // Protect against CSRF
          });
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Signup failed";
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Validation failed";
      });
  },
});

export const {
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  setRolesTargeting,
  setRelevantWorkExperience,
} = signupSlice.actions;

export default signupSlice.reducer;
