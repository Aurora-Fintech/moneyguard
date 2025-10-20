// src/components/Transactions/EmptyTransactions/EmptyTransactions.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../../features/transactions/transactionsSlice";
import styles from "./EmptyTransactions.module.css";

const EmptyTransactions = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.transactions.isModalOpen);

  return (
    <div
      className={styles.emptyContainer}
      style={{
        pointerEvents: isModalOpen ? "none" : "auto", // modal açıksa tıklanamaz
      }}
    >
      <h3
        className={styles.title}
        style={{ visibility: isModalOpen ? "hidden" : "visible" }}
      >
        No transactions available yet.
      </h3>
      <p
        className={styles.subtitle}
        style={{ visibility: isModalOpen ? "hidden" : "visible" }}
      >
        Let's add your first transaction:
      </p>

      <button
        onClick={() => dispatch(toggleModal())} // güncel action
        className={styles.addButton}
        style={{ visibility: isModalOpen ? "hidden" : "visible" }}
      >
        ADD TRANSACTION
      </button>
    </div>
  );
};

export default EmptyTransactions;
