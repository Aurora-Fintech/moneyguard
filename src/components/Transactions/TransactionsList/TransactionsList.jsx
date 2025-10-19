import React from "react";
import { useSelector } from "react-redux";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import EmptyTransactions from "../EmptyTransactions/EmptyTransactions";

const TransactionsList = () => {
  // Redux store'dan transaction listesini, loading ve error durumlarını alıyoruz
  const { transactionsList, isLoading, error } = useSelector(
    (state) => state.transactions
  );

  // Hata varsa göster
  if (error) return <div>Hata oluştu: {error.message}</div>;

  // Loading durumu varsa göster
  if (isLoading) return <div>İşlemler yükleniyor...</div>;

  // Liste boşsa placeholder göster
  if (!transactionsList || transactionsList.length === 0) {
    return <EmptyTransactions />;
  }

  // Liste boşsa placeholder göster

  // Liste doluysa tabloyu render et
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
      }}
    >
      <thead>
        <tr>
          <th>Tarih</th>
          <th>Tip</th>
          <th>Kategori</th>
          <th>Yorum</th>
          <th>Tutar</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {transactionsList.map((transaction) => (
          <TransactionsItem key={transaction?.id} transaction={transaction} />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsList;
