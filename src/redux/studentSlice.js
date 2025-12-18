import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentApi } from '../services/studentApi.js';

export const fetchStudents = createAsyncThunk('students/fetchAll', async () => {
  const response = await studentApi.get('/students');
  return response.data;
});

export const addStudent = createAsyncThunk('students/add', async (student) => {
  const response = await studentApi.post('/students', student);
  return response.data;
});

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, data }) => {
    const response = await studentApi.put(`/students/${id}`, data);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk('students/delete', async (id) => {
  await studentApi.delete(`/students/${id}`);
  return id;
});

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load students';
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
      });
  },
});

export const selectStudents = (state) => state.students.items;
export const selectStudentsLoading = (state) => state.students.loading;
export const selectStudentsError = (state) => state.students.error;

export default studentSlice.reducer;


