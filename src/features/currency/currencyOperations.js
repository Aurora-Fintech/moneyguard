import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCurrencyRates } from "../../api/currencyApi.js";

export const fetchCurrencyRates = createAsyncThunk(
  "currency/fetchCurrencyRates",
  async (_, thunkAPI) => {
    try {
      const rates = await getCurrencyRates();
      return rates;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to fetch currency rates"
      );
    }
  }
);
