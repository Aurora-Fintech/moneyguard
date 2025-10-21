import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
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
        await deleteTransaction(transactionId, token);
      }
      return transactionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ UPDATE THUNK'INIZ
export const updateTransactionThunk = createAsyncThunk(
  "transactions/updateTransaction",
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      let updatedTransaction = transactionData;

      if (token) {
        const data = await updateTransaction(transactionData, token);
        updatedTransaction = data;
      }

      if (!updatedTransaction.id) {
        updatedTransaction.id = transactionData.id;
      }

      return updatedTransaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialTransactions = loadFromLocalStorage();
const today = new Date();
const initialState = {
  balance: calculateBalance(initialTransactions),
  transactionsList: initialTransactions,
  isModalOpen: false,
  isEditModalOpen: false,
  editingTransaction: null,
  isLoading: false,
  error: null,
  selectedMonth: today.getMonth() + 1,
  selectedYear: today.getFullYear(),
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload ?? !state.isModalOpen;
    }, // ✅ YENİ ACTION'LAR
    openEditModal: (state, action) => {
      state.editingTransaction = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingTransaction = null;
    },
    setPeriod: (state, action) => {
      state.selectedMonth = action.payload.month;
      state.selectedYear = action.payload.year;
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
        state.balance = calculateBalance(state.transactionsList);
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
        state.isModalOpen = false;
        state.balance = calculateBalance(state.transactionsList);
        console.log("--- addNewTransaction.fulfilled ---");
        console.log("Eklenen İşlem:", action.payload);
        console.log("Yeni Bakiye:", state.balance);
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactionsList = state.transactionsList.filter(
          (tx) => tx.id !== action.payload
        );
        saveToLocalStorage(state.transactionsList);
        state.balance = calculateBalance(state.transactionsList);
        console.log("--- deleteTransactionThunk.fulfilled ---");
        console.log("Silinen İşlem ID'si:", action.payload);
        console.log("Yeni Bakiye:", state.balance);
      })
      // ✅ YENİ EXTRA REDUCER: İşlem Güncelleme Başarılı Oldu
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        const updatedTransaction = action.payload;

        // İşlem listesinde ilgili ID'yi bul ve güncellenmiş işlemle değiştir
        state.transactionsList = state.transactionsList.map((tx) =>
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        );

        saveToLocalStorage(state.transactionsList);
        state.isEditModalOpen = false; // Modalı kapat
        state.editingTransaction = null; // Düzenleme işlemini sıfırla
        state.balance = calculateBalance(state.transactionsList); // Bakiyeyi güncelle

        console.log("--- updateTransactionThunk.fulfilled ---");
        console.log("Güncellenen İşlem:", updatedTransaction);
        console.log("Yeni Bakiye:", state.balance);
      });
  },
});

// 1. Reducer action'ları (toggleModal ve yeni action'lar)
export const { toggleModal, openEditModal, closeEditModal, setPeriod } =
  transactionsSlice.actions;

// 3. Varsayılan reducer
export default transactionsSlice.reducer;
