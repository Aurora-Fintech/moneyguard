import axios from "axios";

// Axios instance
export const userTransactionApi = axios.create({
  baseURL: "https://wallet.b.goit.study/",
});

// Token ayarlama
export const setToken = (token) => {
  if (token) {
    userTransactionApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  } else {
    delete userTransactionApi.defaults.headers.common["Authorization"];
  }
};

// --- İşlemler --- //

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
    console.error("İşlem eklerken hata:", error.response.data || error);
    throw error;
  }
};

// ✅ YENİ İŞLEM: İşlem Güncelle
export const updateTransaction = async (transactionData, token) => {
  if (token) setToken(token); // ID'yi veriden ayırın, çünkü API genellikle ID'yi payload'da beklemez

  const { id: transactionId, ...updatePayload } = transactionData; // API'nin beklediği formatta payload'ı düzenleyin

  const payload = {
    ...updatePayload,
    // amount'ı güncellerken sayı olduğundan emin olun
    amount: Number(updatePayload.amount),
    // Diğer alanlar: transactionDate, type, categoryId, comment
  };

  try {
    // PATCH metodunu kullanarak ilgili ID'deki işlemi güncelliyoruz
    const response = await userTransactionApi.patch(
      `api/transactions/${transactionId}`,
      payload
    );
    return response.data; // Güncellenmiş işlem objesi dönmeli
  } catch (error) {
    console.error("İşlem güncellerken hata:", error.response.data || error);
    throw error;
  }
};

// İşlem sil
export const deleteTransaction = async (transactionId, token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.delete(
      `api/transactions/${transactionId}`
    );
    return response.data;
  } catch (error) {
    console.error("İşlem silerken hata:", error.response || error);
    throw error;
  }
};

// Kategorileri çek
export const fetchCategories = async (token) => {
  if (token) setToken(token);

  try {
    const response = await userTransactionApi.get("api/transaction-categories");
    return response.data;
  } catch (error) {
    console.error("Kategorileri çekerken hata:", error.response || error);
    throw error;
  }
};
