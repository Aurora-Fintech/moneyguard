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

// --- Bakiyeyi Hesaplama Yardımcısı ---
/**
 * İşlem listesini alarak toplam bakiyeyi hesaplar.
 * Gider (Expense) işlemlerinin amount alanının NEGATİF geldiği varsayılmıştır.
 */
const calculateBalance = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const amount = Number(transaction.amount);
    return acc + amount;
  }, 0);
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

// Başlangıç listesini çek
const initialTransactions = loadFromLocalStorage();

const initialState = {
  balance: calculateBalance(initialTransactions), // ✅ Başlangıç bakiyesi hesaplandı
  transactionsList: initialTransactions,
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
        saveToLocalStorage(state.transactionsList); // ✅ Bakiyeyi güncelle
        state.balance = calculateBalance(state.transactionsList); // ⭐️ KONSOL KONTROLÜ
        console.log("--- getTransactions.fulfilled ---");
        console.log("Tüm İşlemler:", state.transactionsList);
        console.log("Yeni Bakiye:", state.balance);
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.transactionsList.unshift(action.payload);
        saveToLocalStorage(state.transactionsList);
        state.isModalOpen = false; // ✅ Bakiyeyi güncelle
        state.balance = calculateBalance(state.transactionsList); // ⭐️ KONSOL KONTROLÜ
        console.log("--- addNewTransaction.fulfilled ---");
        console.log("Eklenen İşlem:", action.payload);
        console.log("Yeni Bakiye:", state.balance);
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactionsList = state.transactionsList.filter(
          (tx) => tx.id !== action.payload
        );
        saveToLocalStorage(state.transactionsList); // ✅ Bakiyeyi güncelle
        state.balance = calculateBalance(state.transactionsList); // ⭐️ KONSOL KONTROLÜ
        console.log("--- deleteTransactionThunk.fulfilled ---");
        console.log("Silinen İşlem ID'si:", action.payload);
        console.log("Yeni Bakiye:", state.balance);
      });
  },
});

export const { toggleModal } = transactionsSlice.actions;
export default transactionsSlice.reducer;
