import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  authState: boolean;
  userDetails: {
    uid: string;
    name: string;
    email: string;
    profilePic: string;
  };
}

const initialState: AuthState = {
  authState: false,
  userDetails: {
    uid: "",
    name: "",
    email: "",
    profilePic: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    setUserDetailsState: (
      state,
      action: PayloadAction<{
        uid: string;
        name: string;
        email: string;
        profilePic: string;
      }>
    ) => {
      state.userDetails = action.payload;
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setAuthState, setUserDetailsState, resetAuth } =
  authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth.authState;
export const selectUserDetailsState = (state: RootState) =>
  state.auth.userDetails;

export default authSlice.reducer;
