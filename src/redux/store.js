import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import studentReducer from './studentSlice.js';
import attendanceReducer from './attendanceSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    attendance: attendanceReducer,
  },
});


