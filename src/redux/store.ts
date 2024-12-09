// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/auth/loginSlice';
import searchReducer from './slices/home/searchSlice';
import signupReducer from './slices/auth/signupSlice';
import scheduleInterviewReducer from './slices/schedule-interview-modal/scheduleSlice';
import upcomingInterviewSectionReducer from './slices/home/upcomingInterviewSectionSlice' ;
import pastInterviewSectionReducer from './slices/home/pastInterviewSectionSlice' ;

const store = configureStore({
  reducer: {
    login: loginReducer,
    search: searchReducer,
    signup: signupReducer,
    schedule : scheduleInterviewReducer,
    upcomingInterviewSection : upcomingInterviewSectionReducer,  
    pastInterviewSection: pastInterviewSectionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
