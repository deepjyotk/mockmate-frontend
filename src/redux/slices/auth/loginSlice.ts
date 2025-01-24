// redux/slices/auth/loginSlice.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginRequest } from '@/models/auth/loginRequest';
import { LoginResponse } from '@/models/auth/loginResponse';
import { axiosPostRequest } from '@/services/axiosService';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';


// Async thunk for login using loginService
export const loginUser = createAsyncThunk<
  LoginResponse, // Return type of the payload creator
  LoginRequest,  // First argument to the payload creator
  { rejectValue: string } // Type of rejectWithValue
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await axiosPostRequest('/auth/login', credentials);
      if ("error" in data){
        return rejectWithValue(data.message|| 'Login failed');
      }
      return data.payload as LoginResponse;
    } catch (error: any) {
      // Customize error handling based on your API's error structure
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// New thunk for handling form submission with validation
export const submitLogin = createAsyncThunk<
  void, // Return type
  void, // First argument (none)
  {
    state: { login: typeof initialState };
    dispatch: any;
    rejectValue: string;
  }
>(
  'auth/submitLogin',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { userOrEmail, password } = getState().login;

    // Determine if userOrEmail is email or username
    const isEmail = userOrEmail.includes("@");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/; // Example: At least 3 characters, alphanumeric and certain symbols
    const passwordRegex = /^(?=.*[A-Z]).{3,}$/;

    if (isEmail) {
      if (!emailRegex.test(userOrEmail)) {
        return rejectWithValue('Please enter a valid email address.');
      }
    } else {
      if (!usernameRegex.test(userOrEmail)) {
        return rejectWithValue('Please enter a valid username (at least 3 characters, alphanumeric).');
      }
    }

    if (!passwordRegex.test(password)) {
      return rejectWithValue('Password must be at least 3 characters long and contain at least one uppercase letter.');
    }

    // Prepare the login request payload
    const loginRequest: LoginRequest = {
      userOrEmail, // Ensure this matches your backend's expected field name
      password,
    };

    // Dispatch the loginUser thunk
    await dispatch(loginUser(loginRequest));
  }
);

// Initial state
interface LoginState {
  userOrEmail: string;
  password: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LoginState = {
  userOrEmail: '',
  password: '',
  status: 'idle',
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserOrEmail: (state, action: PayloadAction<string>) => {
      state.userOrEmail = action.payload;
      state.error = null;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      state.error = null;
    },
    resetLoginState(state) {
      Object.assign(state, initialState);
      // or:
      // return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle loginUser lifecycle
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.error = null;
        if (action.payload) {
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // Handle submitLogin rejection (validation errors)
      .addCase(submitLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Validation failed';
      });
  },
});

// Export actions and reducer
export const { setUserOrEmail, setPassword, resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
