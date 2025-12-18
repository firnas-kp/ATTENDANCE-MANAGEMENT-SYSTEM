import { createSlice } from '@reduxjs/toolkit';

const AUTH_KEY = 'ams_auth';
const USERS_KEY = 'ams_users';

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : { user: null, isAuthenticated: false };
  } catch {
    return { user: null, isAuthenticated: false };
  }
};

const initialState = {
  user: loadAuthFromStorage().user,
  isAuthenticated: loadAuthFromStorage().isAuthenticated,
};

const saveAuthToStorage = (state) => {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ user: state.user, isAuthenticated: state.isAuthenticated })
  );
};

const loadUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const users = loadUsers();
      users.push(action.payload);
      saveUsers(users);
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveAuthToStorage(state);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      saveAuthToStorage(state);
    },
  },
});

export const { registerUser, loginSuccess, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRegisteredUsers = () => loadUsers();

export default authSlice.reducer;


