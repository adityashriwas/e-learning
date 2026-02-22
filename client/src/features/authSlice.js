import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
}; 

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
    },
    userLoggedOut:(state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    }
  },
});

export const {userLoggedIn, userLoggedOut, setAuthChecked} = authSlice.actions;
export default authSlice.reducer;
