import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrencyRates } from "./currencyOperations.js";

export const MOCK_RATES = [
    { currencyCodeA: 840, currencyCodeB: 980, rateBuy: 37.00, rateSell: 37.50 }, // USD
    { currencyCodeA: 978, currencyCodeB: 980, rateBuy: 39.50, rateSell: 40.20 }, // EUR
];

const initialState = {
  rates: MOCK_RATES, 
  isLoading: false,
  error: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rates = action.payload; 
      })
      .addCase(fetchCurrencyRates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      });
  },
});

export default currencySlice.reducer;