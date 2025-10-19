import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllTransactions,
  createTransaction,
  deleteTransaction, // ✅ doğru isim
} from "../../api/userTransactionApi2.js";

// --- LocalStorage Yardımcıları ---
const STORAGE_KEY = "transactions";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("LocalStorage kaydedilemedi:", error);
  }
};

// --- ASENKRON THUNK'LAR ---
export const getTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) {
        return loadFromLocalStorage();
      }
      const data = await fetchAllTransactions(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addNewTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      let newTransaction = {
        ...transactionData,
        id: Date.now(),
      };

      if (token) {
        const data = await createTransaction(transactionData, token);
        newTransaction = data;
      }

      return newTransaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTransactionThunk = createAsyncThunk(
  "transactions/deleteTransaction",
  async (transactionId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (token) {
        await deleteTransaction(transactionId, token); // ✅ burası düzeltildi
      }
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  balance: 0,
  transactionsList: loadFromLocalStorage(),
  isModalOpen: false,
  isLoading: false,
  error: null,
};

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
        saveToLocalStorage(state.transactionsList);
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.transactionsList.unshift(action.payload);
        saveToLocalStorage(state.transactionsList);
        state.isModalOpen = false;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactionsList = state.transactionsList.filter(
          (tx) => tx.id !== action.payload
        );
        saveToLocalStorage(state.transactionsList);
      });
  },
});

export const { toggleModal } = transactionsSlice.actions;
export default transactionsSlice.reducer;
