import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllTransactions,
  createTransaction,
} from "../../api/userTransactionApi2.js";

// ASENKRON THUNK: Tüm işlemleri çek
export const getTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("Token yok");
      const data = await fetchAllTransactions(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ASENKRON THUNK: Yeni işlem ekle
export const addNewTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue("Token yok");
      const data = await createTransaction(transactionData, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// INITIAL STATE
const initialState = {
  balance: 0,
  transactionsList: [],
  isModalOpen: false,
  isLoading: false,
  error: null,
};

// SLICE
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload ?? !state.isModalOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactionsList = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addNewTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.id) {
          state.transactionsList.unshift(action.payload);
        }
        state.isModalOpen = false;
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isModalOpen = false;
      });
  },
});

export const { toggleModal } = transactionsSlice.actions;
export default transactionsSlice.reducer;
