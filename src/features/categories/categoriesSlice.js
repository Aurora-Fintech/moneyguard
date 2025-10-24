import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories } from "../../api/userTransactionApi";

export const getCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;

      if (!token) {
        return rejectWithValue("Kullanıcı oturumu açmamış. Token yok.");
      }

      const data = await fetchCategories(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
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
