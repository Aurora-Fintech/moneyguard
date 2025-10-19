import React from "react";
import { useSelector } from "react-redux";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import EmptyTransactions from "../EmptyTransactions/EmptyTransactions";
import styles from "./TransactionsList.module.css";

const TransactionsList = () => {
  const { transactionsList, isLoading, error } = useSelector(
    (state) => state.transactions
  );

  if (error) return <div>Hata oluştu: {error}</div>;
  if (isLoading) return <div>İşlemler yükleniyor...</div>;
  if (!transactionsList || transactionsList.length === 0) {
    return <EmptyTransactions />;
  }
  console.log("transactions: ", transactionsList);
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.theadRow}>
          <th className={styles.th}>Date</th>
          <th className={styles.th}>Type</th>
          <th className={styles.th}>Category</th>
          <th className={styles.th}>Comment</th>
          <th className={styles.th}>Sum</th>
          <th className={`${styles.th} ${styles.thCenter}`}>İşlemler</th>
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
