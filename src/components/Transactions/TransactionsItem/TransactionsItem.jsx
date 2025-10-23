import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransactionThunk,
  openEditModal,
} from "../../../features/transactions/transactionsSlice";
import styles from "./TransactionsItem.module.css";
import editIcon from "../../../assets/icons/editIcon.svg";

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
      title: "Onay Gerekiyor",
      message:
        "Bu işlemi **kalıcı olarak** silmek istediğinizden emin misiniz?",
      position: "center",
      timeout: false,
      close: true,
      overlay: true,
      id: "delete-confirm",
      zindex: 99999,
      class: "dark-confirm-toast",

      buttons: [
        [
          "<button class='delete-confirm-btn delete-btn'><b>Evet, Sil</b></button>",
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
          "<button class='delete-confirm-btn cancel-btn'>İptal</button>",
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
  const category = expenseCategories.find(
    (cat) => cat.id === transaction.categoryId
  );

  return (
    <tr
      className={`${styles.tr} ${
        typeLower === "income" ? styles.income : styles.expense
      }`}
    >
      <td className={styles.td}>
        {/* MOBİL ETİKET BAŞLANGICI */}
        <span className={styles.mobileLabel}>Date:</span>
        {/* MOBİL ETİKET SONU */}
        {formattedDate}
      </td>

      <td
        className={`${styles.td} ${styles.type} ${
          typeLower === "income" ? styles.typeIncome : styles.typeExpense
        }`}
      >
        {/* MOBİL ETİKET BAŞLANGICI */}
        <span className={styles.mobileLabel}>Type:</span>
        {/* MOBİL ETİKET SONU */}
        {typeLower === "income" ? "+" : "-"}
      </td>

      <td className={styles.td}>
        {/* MOBİL ETİKET BAŞLANGICI */}
        <span className={styles.mobileLabel}>Category:</span>
        {/* MOBİL ETİKET SONU */}
        {typeLower === "expense" ? category?.name : null}
        {typeLower === "income" && (
          <div className={styles.incomeLabel}>Income</div>
        )}
      </td>

      {/* 🟢 GÜNCELLEME: Comment sütununa özel sınıf eklenerek alt satıra geçiş sağlanacak */}
      <td className={`${styles.td} ${styles.comment}`}>
        <span className={styles.mobileLabel}>Comment:</span>
        {transaction.comment
          ? transaction.comment.length > 30
            ? transaction.comment.slice(0, 30)
            : transaction.comment
          : "-"}
      </td>

      {/* 💰 SUM RENK KOŞULU BURADA */}
      <td
        className={`${styles.td} ${styles.sum} ${
          typeLower === "income" ? styles.sumIncome : styles.sumExpense
        }`}
      >
        {/* MOBİL ETİKET BAŞLANGICI */}
        <span className={styles.mobileLabel}>Sum:</span>
        {/* MOBİL ETİKET SONU */}
        {Math.abs(amount)}
      </td>

      <td className={`${styles.td} ${styles.actions}`}>
        {/* SIRA 1 (MASAÜSTÜ SOL): EDİT BUTONU */}
        <button className={styles.iconButton} onClick={handleEdit}>
          <img src={editIcon} alt="Edit" />
          <span className={styles.editLabel}>Edit</span>{" "}
          {/* MOBİL EDİT YAZISI */}
        </button>

        {/* SIRA 2 (MASAÜSTÜ SAĞ): DELETE BUTONU */}
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
