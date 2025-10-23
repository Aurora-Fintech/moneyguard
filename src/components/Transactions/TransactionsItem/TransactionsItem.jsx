import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransactionThunk,
  openEditModal,
} from "../../../features/transactions/transactionsSlice";
import styles from "./TransactionsItem.module.css";
// iziToast import
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import editIcon from "../../../assets/icons/editIcon.svg";

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();
  const expenseCategories = useSelector(
    (state) => state.categories.expenseCategories
  );

  const showSuccessToast = (msg) => {
    iziToast.show({
      title: "Success",
      message: msg || "Transaction deleted successfully",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      backgroundColor: "#4BB543",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,
      padding: 25,
    });
  };

  const showErrorToast = (msg) => {
    iziToast.show({
      title: "Error",
      message: msg || "Transaction could not be deleted",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      backgroundColor: "#FF4C4C",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,
      padding: 25,
    });
  };

  // Silme işlemi
  const handleDelete = () => {
    iziToast.show({
      title: "Confirmation Required",
      message: "Are you sure you want to **permanently delete** this item?",
      position: "center",
      timeout: false,
      close: true,
      overlay: true,
      id: "delete-confirm",
      zindex: 99999,
      // CUSTOM STYLE:
      class: "dark-confirm-toast",

      buttons: [
        [
          // YES, DELETE button
          "<button class='delete-confirm-btn delete-btn'><b>Yes, Delete</b></button>",
          async (instance, toast) => {
            instance.hide({ transitionOut: "fadeOutUp" }, toast, "button");

            try {
              await dispatch(deleteTransactionThunk(transaction.id)).unwrap();
              showSuccessToast();
            } catch (error) {
              showErrorToast(error?.message);
            }
          },
          true,
        ],
        [
          // CANCEL button
          "<button class='delete-confirm-btn cancel-btn'>Cancel</button>",
          (instance, toast) => {
            instance.hide({ transitionOut: "fadeOutUp" }, toast, "button");
          },
        ],
      ],
    });
  };

  const handleEdit = () => {
    dispatch(openEditModal(transaction));
  };

  const formattedDate = transaction.transactionDate
    ? new Date(transaction.transactionDate).toLocaleDateString()
    : transaction.date || "-";

  const typeLower = transaction.type?.toLowerCase();
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
        <button className={styles.iconButton} onClick={handleEdit}>
          <img src={editIcon} alt="Edit" />
        </button>

        <button
          className={`form-button ${styles.deleteButton}`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TransactionsItem;
