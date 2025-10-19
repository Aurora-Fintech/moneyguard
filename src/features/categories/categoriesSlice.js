// src/features/categories/categoriesSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// --------------------------------------------------------
// ASENKRON THUNK: Kategori Verisini Çekme
// --------------------------------------------------------
export const getCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Redux store'dan token'ı çek
      const token = getState().auth.token;

      if (!token) {
        return rejectWithValue("Kullanıcı oturumu açmamış. Token yok.");
      }

      // API çağrısı
      const data = await fetchCategories(token);

      return data;
    } catch (error) {
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

        // Veriyi türe göre ayır
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
