import { createSlice } from '@reduxjs/toolkit';

const ATTENDANCE_KEY = 'ams_attendance';

const loadAttendance = () => {
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveAttendance = (attendance) => {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
};

const initialState = {
  records: loadAttendance(), // { [date]: { [studentId]: 'present' | 'absent' } }
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    markAttendance: (state, { payload }) => {
      const { date, studentId, status } = payload;
      if (!state.records[date]) {
        state.records[date] = {};
      }
      state.records[date][studentId] = status;
      saveAttendance(state.records);
    },
  },
});

export const { markAttendance } = attendanceSlice.actions;

export const selectAttendanceForDate =
  (date) =>
  (state) =>
    state.attendance.records[date] || {};

export const selectAttendanceState = (state) => state.attendance.records;

export default attendanceSlice.reducer;


