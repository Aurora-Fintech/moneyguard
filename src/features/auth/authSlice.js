import { createSlice } from "@reduxjs/toolkit";
import { logIn, register, refreshUser } from "./authOperations";

// Yardımcı reducer fonksiyonlar

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isLoggedIn = true;
  state.isLoading = false;
};

// Refresh durumu için yardımcı reducerlar
const handleRefreshFulFilled = (state, action) => {
  state.user = action.payload;
  state.isLoggedIn = true;
  state.isRefreshing = false;
};

const handleRefreshRejected = (state) => {
  state.isRefreshing = false;
};

const handleRefreshPending = (state) => {
  state.isRefreshing = true;
};
// Slice

const initialState = {
  user: { name: null, email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login durumları
      .addCase(logIn.pending, handlePending)
      .addCase(logIn.rejected, handleRejected)
      .addCase(logIn.fulfilled, handleFulfilled)
      // Register durumları
      .addCase(register.pending, handlePending)
      .addCase(register.rejected, handleRejected)
      .addCase(register.fulfilled, handleFulfilled)
      // Refresh durumları
      .addCase(refreshUser.pending, handleRefreshPending)
      .addCase(refreshUser.rejected, handleRefreshRejected)
      .addCase(refreshUser.fulfilled, handleRefreshFulFilled);
  },
});

export default authSlice.reducer;
