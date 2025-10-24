import React, { useState } from "react";
import { useSelector } from "react-redux";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import EmptyTransactions from "../EmptyTransactions/EmptyTransactions";
import ModalEditTransaction from "../ModalEditTransaction/ModalEditTransaction";
import styles from "./TransactionsList.module.css";

const TransactionsList = () => {
  const [sortOrder, setSortOrder] = useState("desc"); // 🔹 Default: en son işlemler üstte
  const { transactionsList, isLoading, error, isEditModalOpen } = useSelector(
    (state) => state.transactions
  );

  if (error) return <div>Hata oluştu: {error}</div>;
  if (isLoading) return <div>İşlemler yükleniyor...</div>;
  if (!transactionsList || transactionsList.length === 0) {
    return <EmptyTransactions />;
  }

  // 🔹 Tarih filtresi (sadece gelecekteki işlemleri çıkar, bugünü dahil et)
  const now = new Date();
  const filteredTransactions = transactionsList.filter((transaction) => {
    const transDate = new Date(transaction.transactionDate || transaction.date);
    return transDate.getTime() <= now.getTime(); // timezone farkı etkilenmez
  });

  // 🔹 Sıralama (desc = en son işlemler üstte)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.transactionDate || a.date);
    const dateB = new Date(b.transactionDate || b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // 🔹 Sıralama butonu
  const handleSortClick = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th
              className={styles.th}
              onClick={handleSortClick}
              style={{ cursor: "pointer" }}
            >
              Date
              <span className={styles.sortIcon}>
                {sortOrder === "asc" ? "▲" : "▼"}
              </span>
            </th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Comment</th>
            <th className={styles.th}>Sum</th>
            <th className={`${styles.th} ${styles.thCenter}`}></th>
          </tr>
        </thead>

        <tbody>
          {sortedTransactions.map((transaction) => (
            <TransactionsItem key={transaction?.id} transaction={transaction} />
          ))}
        </tbody>
      </table>

      {isEditModalOpen && <ModalEditTransaction />}
    </>
  );
};

export default TransactionsList;
