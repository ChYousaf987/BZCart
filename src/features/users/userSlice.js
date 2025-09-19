import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logUser, regUser, verifyOTP, logout } from "./userService";

const isUser = JSON.parse(localStorage.getItem("myUser"));
const isTempUser = JSON.parse(localStorage.getItem("tempUser"));

const initialState = {
  user: isUser ? isUser : null,
  tempUser: isTempUser ? isTempUser : null, // Track temporary user
  userLoading: false,
  userMessage: "",
  userError: false,
  userSuccess: false,
};

export const registerMyUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await regUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginMyUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      return await logUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const verifyOTPData = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, thunkAPI) => {
    try {
      let token = thunkAPI.getState().auth.tempUser?.token; // Use tempUser token
      if (!token) throw new Error("No temporary user token found");
      return await verifyOTP(otpData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await logout();
  return null;
});

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userReset: (state) => {
      state.userLoading = false;
      state.userError = false;
      state.userSuccess = false;
      state.userMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerMyUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(registerMyUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userMessage = action.payload;
        state.userError = true;
      })
      .addCase(registerMyUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.tempUser = action.payload; // Store temporary user
      })
      .addCase(loginMyUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(loginMyUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userMessage = action.payload;
        state.userError = true;
      })
      .addCase(loginMyUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = action.payload;
        state.tempUser = null; // Clear temporary user
      })
      .addCase(verifyOTPData.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(verifyOTPData.rejected, (state, action) => {
        state.userLoading = false;
        state.userMessage = action.payload;
        state.userError = true;
      })
      .addCase(verifyOTPData.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userSuccess = true;
        state.user = action.payload; // Set permanent user
        state.tempUser = null; // Clear temporary user
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.tempUser = null; // Clear both
        state.userSuccess = false;
        state.userError = false;
        state.userMessage = "";
      });
  },
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;
