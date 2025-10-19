import React from "react";
import { useSelector } from "react-redux";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import EmptyTransactions from "../EmptyTransactions/EmptyTransactions";

const TransactionsList = () => {
  const { transactionsList, isLoading, error } = useSelector(
    (state) => state.transactions
  );

  if (error) return <div>Hata oluştu: {error}</div>;
  if (isLoading) return <div>İşlemler yükleniyor...</div>;
  if (!transactionsList || transactionsList.length === 0) {
    return <EmptyTransactions />;
  }

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
          <th style={{ textAlign: "center" }}>İşlemler</th>
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
