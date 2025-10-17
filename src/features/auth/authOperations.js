import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { userTransactionsApi } from "../../api/userTransactionApi.js";
import { setToken } from "../../api/userTransactionApi.js";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await userTransactionsApi.post(
        "/api/auth/sign-in",
        credentials
      );
      setAuthHeader(response.data.token);
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
      const response = await userTransactionsApi.post(
        "/api/auth/sign-up",
        credentials
      );
      setAuthHeader(response.data.token);
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
      const { data } = await userTransactionsApi.get("/api/users/current");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
