import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTransactionThunk } from "../../../features/transactions/transactionsSlice";
import styles from "./TransactionsItem.module.css";

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();
  const expenseCategories = useSelector(
    (state) => state.categories.expenseCategories
  );

  const handleDelete = () => {
    if (window.confirm("Bu işlemi silmek istediğine emin misin?")) {
      dispatch(deleteTransactionThunk(transaction.id));
    }
  };

  const handleEdit = () => {
    console.log("Düzenlenecek işlem:", transaction);
  };

  // Tarihi okunabilir formatta göster
  const formattedDate = transaction.transactionDate
    ? new Date(transaction.transactionDate).toLocaleDateString()
    : transaction.date || "-";

  const typeLower = transaction.type?.toLowerCase(); // income / expense
  const amount = transaction.amount ?? transaction.sum;
  const category = expenseCategories.filter(
    (cat) => cat.id === transaction.categoryId
  )?.[0];

  return (
    <tr className={styles.tr}>
      <td className={styles.td}>{formattedDate}</td>

      <td
        className={`${styles.td} ${styles.type} ${
          typeLower === "income" ? styles.typeIncome : styles.typeExpense
        }`}
      >
        {typeLower === "income" ? "+" : "-"}
      </td>

      <td className={styles.td}>
        {typeLower === "expense" ? category?.name : null}
        {typeLower === "income" && (
          <div className={styles.incomeLabel}>Income</div>
        )}
      </td>

      <td className={styles.td}>{transaction.comment || "-"}</td>
      <td className={`${styles.td} ${styles.sum}`}>{Math.abs(amount)} ₺</td>
      <td className={`${styles.td} ${styles.actions}`}>
        <button
          className={`${styles.button} ${styles.editButton}`}
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className={`${styles.button} ${styles.deleteButton}`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TransactionsItem;
