import axios from "axios";

// Axios instance
export const userTransactionApi = axios.create({
  baseURL: "https://wallet.b.goit.study/",
});

// Token ayarlama
export const setToken = (token) => {
  userTransactionApi.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
};

// Tüm işlemleri çek
export const fetchAllTransactions = async (token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.get("api/transactions");
    return response.data;
  } catch (error) {
    console.error("İşlemleri çekerken hata:", error.response || error);
    throw error;
  }
};

// Yeni işlem ekle
export const createTransaction = async (transactionData, token) => {
  if (token) setToken(token);

  // Backend’in beklediği payload yapısı
  const payload = {
    transactionDate: transactionData.transactionDate, // ISO string
    type: transactionData.type, // "INCOME" veya "EXPENSE"
    categoryId: transactionData.categoryId,
    comment: transactionData.comment || "",
    amount: Number(transactionData.amount),
  };

  try {
    const response = await userTransactionApi.post("api/transactions", payload);
    return response.data;
  } catch (error) {
    console.error("İşlem eklerken hata:", error.response || error);
    throw error;
  }
};
