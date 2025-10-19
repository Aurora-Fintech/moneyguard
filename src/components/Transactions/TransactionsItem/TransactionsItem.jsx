import React from "react";
import { useDispatch } from "react-redux";
import { deleteTransactionThunk } from "../../../features/transactions/transactionsSlice";

const TransactionsItem = ({ transaction }) => {
  const dispatch = useDispatch();

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

  // Backend’den gelen alan isimleri: amount, type
  const typeLower = transaction.type?.toLowerCase(); // INCOME / EXPENSE → income / expense
  const amount = transaction.amount ?? transaction.sum;

  return (
    <tr
      style={{
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <td>{formattedDate}</td>
      <td
        style={{
          color: typeLower === "income" ? "#24CCA7" : "#FF6596",
          fontWeight: 600,
        }}
      >
        {typeLower === "income" ? "Gelir" : "Gider"}
      </td>
      <td>{transaction.category || "-"}</td>
      <td>{transaction.comment || "-"}</td>
      <td>{amount} ₺</td>
      <td
        style={{
          textAlign: "center",
        }}
      >
        <button
          onClick={handleEdit}
          style={{
            marginRight: "8px",
            backgroundColor: "#f0f0f0",
            border: "none",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </td>
    </tr>
  );
};

export default TransactionsItem;
