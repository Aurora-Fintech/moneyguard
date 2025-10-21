// src/assets/components/Transactions/ModalEditTransaction/ModalEditTransaction.jsx

import React from "react";
import { useDispatch } from "react-redux";
import { closeEditModal } from "../../../features/transactions/transactionsSlice";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";

import styles from "./ModalEditTransaction.module.css";

const ModalEditTransaction = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEditModal());
  };

  return (
    // ✅ classname: edit-modal-overlay
    <div className={styles.editModalOverlay} onClick={handleClose}>
      {/* ✅ classname: edit-modal-content */}
      <div
        className={styles.editModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ classname: edit-modal-close-button */}
        <button className={styles.editModalCloseButton} onClick={handleClose}>
          &times;
        </button>

        {/* ✅ classname: edit-modal-title */}
        <h2 className={styles.editModalTitle}>Edit Transaction</h2>

        <EditTransactionForm onSaveSuccess={handleClose} />
      </div>
    </div>
  );
};

export default ModalEditTransaction;
