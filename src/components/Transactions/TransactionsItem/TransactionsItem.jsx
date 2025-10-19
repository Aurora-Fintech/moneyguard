// src/features/transactions/TransactionsItem.jsx

import React from "react";
import { useSelector } from "react-redux";

const TransactionsItem = ({ transaction }) => {
  const { allCategories } = useSelector((state) => state.categories);

  const isIncome = transaction.type === "INCOME";
  const typeSymbol = isIncome ? "+" : "−";
  const typeColor = isIncome ? "green" : "red";

  const dateValue = transaction.transactionDate;
  const amountValue = transaction.amount;

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString("tr-TR")
    : "N/A";

  const categoryName =
    allCategories.find((cat) => cat.id === transaction.categoryId)?.name ||
    "Unknown";

  return (
    <tr style={{ borderBottom: `1px solid ${typeColor}` }}>
      <td>{formattedDate}</td>
      <td style={{ color: typeColor, fontWeight: "bold" }}>{typeSymbol}</td>
      <td>{categoryName}</td>
      <td>{transaction.comment || ""}</td>
      <td style={{ color: typeColor, fontWeight: "bold" }}>
        {amountValue?.toFixed(2) || "0.00"}
      </td>
      <td>
        <button
          onClick={() => console.log("Düzenle:", transaction.id)}
          style={{
            cursor: "pointer",
            border: "none",
            background: "transparent",
          }}
        >
          &#9998;
        </button>
        <button
          onClick={() => console.log("Sil:", transaction.id)}
          style={{
            cursor: "pointer",
            border: "none",
            background: "transparent",
          }}
        >
          &#128465;
        </button>
      </td>
    </tr>
  );
};

export default TransactionsItem;
