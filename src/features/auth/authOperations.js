import { createAsyncThunk } from "@reduxjs/toolkit";
import { userTransactionApi, setToken } from "../../api/userTransactionApi2.js";

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "/api/auth/sign-in",
        credentials
      );
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionApi.post(
        "/api/auth/sign-up",
        credentials
      );
      setToken(response.data.token);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const savedToken = thunkAPI.getState().auth.token;
    if (savedToken) {
      setToken(savedToken);
    } else {
      return thunkAPI.rejectWithValue("Token doesn't exist");
    }

    try {
      const { data } = await userTransactionApi.get("/api/users/current");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const { data } = await userTransactionApi.delete("/api/auth/sign-out");
    // removeToken();
    return data;
  } catch (error) {
    console.error("logoutThunk hata:", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});
