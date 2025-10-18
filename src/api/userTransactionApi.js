import axios from "axios";

export const userTransactionsApi = axios.create({
  baseURL: "https://wallet.b.goit.study",
});
