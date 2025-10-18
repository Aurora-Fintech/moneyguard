import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 24000.0,

  transactions: [
    {
      id: "t-1",
      type: "income",
      category: "Salary",
      amount: 15000.0,
      date: "2025-10-01",
      comment: "Monthly salary deposit.",
    },
    {
      id: "t-2",
      type: "expense",
      category: "Food",
      amount: 550.5,
      date: "2025-10-02",
      comment: "Weekly grocery shopping.",
    },
    {
      id: "t-3",
      type: "expense",
      category: "Transportation",
      amount: 120.0,
      date: "2025-10-03",
      comment: "Monthly bus pass.",
    },
    {
      id: "t-4",
      type: "income",
      category: "Other Income",
      amount: 5000.0,
      date: "2025-10-10",
      comment: "Freelance project payment.",
    },
    {
      id: "t-5",
      type: "expense",
      category: "Entertainment",
      amount: 300.0,
      date: "2025-10-15",
      comment: "Cinema tickets and dinner.",
    },
  ],
  isLoading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // İşlem ekleme, silme, düzenleme (gerçek fonksiyonlar buraya gelecek)
    // Şimdilik sadece Mock veriyi tutuyoruz.
  },
});

export default transactionsSlice.reducer;

// Actions (Şimdilik gerek yok)
// export const { addTransaction } = transactionsSlice.actions;
