import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../../api/userTransactionApi.js";

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

// --- YARDIMCI FONKSİYON: CategoryName Ekleme ---
const addCategoryNameToTransaction = (transaction, categories) => {
  // Sadece Gider işlemleri için ve categoryId varsa ekle
  if (transaction.type === "EXPENSE" && transaction.categoryId) {
    const category = categories.find(
      (cat) => String(cat.id) === String(transaction.categoryId)
    );
    return {
      ...transaction,
      categoryName: category ? category.name : "Bilinmeyen Kategori",
    };
  }
  return transaction;
};

// --- ASENKRON THUNK'LAR ---
export const getTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState(); // State'i al
      const token = state.auth?.token;
      if (!token) {
        return loadFromLocalStorage();
      }

      const allExpenseCategories = state.categories.expenseCategories || []; // Kategorileri al

      const data = await fetchAllTransactions(token);

      // 💥 KÖKTEN ÇÖZÜM 1: Gelen tüm işlemlere categoryName ekle
      const transactionsWithNames = data.map((tx) =>
        addCategoryNameToTransaction(tx, allExpenseCategories)
      );

      return transactionsWithNames;
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

      // Kategori adını formdan almış olmalıyız (EditForm'daki gibi)
      const allExpenseCategories =
        getState().categories.expenseCategories || [];

      // 💥 KÖKTEN ÇÖZÜM 2: Eklenen işleme categoryName ekle
      newTransaction = addCategoryNameToTransaction(
        newTransaction,
        allExpenseCategories
      );

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

// ✅ GÜNCELLENMİŞ UPDATE THUNK'INIZ
export const updateTransactionThunk = createAsyncThunk(
  "transactions/updateTransaction",
  async (transactionData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token; // API'ye göndereceğimiz payload'dan UI için eklenen categoryName'i çıkar
      const apiPayload = { ...transactionData };
      delete apiPayload.categoryName;
      let updatedTransaction = transactionData;

      if (token) {
        // API çağrısı temizlenmiş payload ile
        const data = await updateTransaction(apiPayload, token);
        updatedTransaction = data;
      }

      if (!updatedTransaction.id) {
        updatedTransaction.id = transactionData.id;
      }

      const allExpenseCategories =
        getState().categories.expenseCategories || [];

      // 💥 KÖKTEN ÇÖZÜM 3: Güncellenen işleme categoryName ekle
      // API'den dönen objeye categoryName ekle. Bu, formdan gelen veriyi kullanmak yerine,
      // API'den dönen categoryId'ye göre kategoriyi tekrar bulur.
      updatedTransaction = addCategoryNameToTransaction(
        updatedTransaction,
        allExpenseCategories
      );

      return updatedTransaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
// ... (Reducer ve Action'lar aynı kalır)
// Bu kısım aynı kaldığı için aşağıdaki kodu dosyanıza eklemeniz yeterli.

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
      // Global loading for fetch
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
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Loading around add
      .addCase(addNewTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.transactionsList.unshift(action.payload);
        saveToLocalStorage(state.transactionsList);
        state.isModalOpen = false;
        state.balance = calculateBalance(state.transactionsList);
        state.isLoading = false;
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Loading around delete
      .addCase(deleteTransactionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransactionThunk.fulfilled, (state, action) => {
        state.transactionsList = state.transactionsList.filter(
          (tx) => tx.id !== action.payload
        );
        saveToLocalStorage(state.transactionsList);
        state.balance = calculateBalance(state.transactionsList);
        state.isLoading = false;
      })
      .addCase(deleteTransactionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ✅ Transaction update (merge local + server data)
      .addCase(updateTransactionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransactionThunk.fulfilled, (state, action) => {
        const updatedFromServer = action.payload || {};
        const arg = action.meta?.arg || {};
        const idx = state.transactionsList.findIndex(
          (tx) => tx.id === (updatedFromServer.id ?? arg.id)
        );

        if (idx !== -1) {
          state.transactionsList[idx] = {
            ...state.transactionsList[idx],
            ...updatedFromServer,
            amount:
              arg.amount ??
              updatedFromServer.amount ??
              state.transactionsList[idx].amount,
            transactionDate:
              arg.transactionDate ??
              updatedFromServer.transactionDate ??
              state.transactionsList[idx].transactionDate,
            type:
              arg.type ??
              updatedFromServer.type ??
              state.transactionsList[idx].type,
            comment:
              arg.comment ??
              updatedFromServer.comment ??
              state.transactionsList[idx].comment,
            categoryId:
              (arg.type === "EXPENSE" ? arg.categoryId : null) ??
              updatedFromServer.categoryId ??
              state.transactionsList[idx].categoryId,
          };
        }

        saveToLocalStorage(state.transactionsList);
        state.isEditModalOpen = false;
        state.editingTransaction = null;
        state.balance = calculateBalance(state.transactionsList);
        state.isLoading = false;
      })
      .addCase(updateTransactionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// 1. Reducer action'ları (toggleModal ve yeni action'lar)
export const { toggleModal, openEditModal, closeEditModal, setPeriod } =
  transactionsSlice.actions;

// 3. Varsayılan reducer
export default transactionsSlice.reducer;
