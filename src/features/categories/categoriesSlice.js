// src/features/categories/categoriesSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Yolu doğru kontrol edin: src/features/categories'den src/api/transactionsAPI.js'e
// Dosya adının büyük/küçük harf duyarlılığını kontrol ederek aşağıdaki yoldan birini kullanın:
import { fetchCategories } from "../../api/userTransactionApi2";
// VEYA: import { fetchCategories } from '../../api/TransactionsApi';

// --------------------------------------------------------
// ASENKRON THUNK: Kategori Verisini Çekme
// --------------------------------------------------------
export const getCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Token'ı Redux'tan çek
      const token = getState().auth?.token;

      console.log("request*1: ", token);

      if (!token) {
        return rejectWithValue("Kullanıcı oturumu açmamış. Token yok.");
      }

      // API'ı çağır
      const data = await fetchCategories(token);

      // Backend'den gelen veriyi döndür
      return data;
    } catch (error) {
      // Hata durumunda mesajı döndür
      return rejectWithValue(error.message);
    }
  }
);

// --------------------------------------------------------
// SLICE: Kategorileri Yönetme
// --------------------------------------------------------
const initialState = {
  allCategories: [],
  expenseCategories: [],
  incomeCategories: [],
  isLoading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCategories = action.payload;

        // Veriyi türe göre ayır ('EXPENSE' ve 'INCOME' [cite: image_e0385c])
        state.expenseCategories = action.payload.filter(
          (cat) => cat.type === "EXPENSE"
        );
        state.incomeCategories = action.payload.filter(
          (cat) => cat.type === "INCOME"
        );
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
