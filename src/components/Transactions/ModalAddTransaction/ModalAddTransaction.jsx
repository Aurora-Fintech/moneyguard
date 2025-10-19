// src/components/Transactions/ModalAddTransaction/ModalAddTransaction.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../../features/transactions/transactionsSlice";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import styles from "./ModalAddTransaction.module.css";

const ModalAddTransaction = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.transactions.isModalOpen);

  // Modal'ı kapatma fonksiyonu
  const handleClose = () => {
    dispatch(toggleModal()); // güncel action
  };

  return (
    <div
      className={styles.overlay}
      onClick={toggleModal} // Overlay'e tıklayınca modal kapanır
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // Modal içine tıklayınca kapanmayı engeller
      >
        <button
          className={styles.closeBtn}
          onClick={toggleModal} // Butona tıklayınca modal kapanır
        >
          &times;
        </button>

        {/* Form komponenti: onCancel prop’u modal’ı kapatmak için */}
        <AddTransactionForm onCancel={toggleModal} />
      </div>
    </div>
  );
};

export default ModalAddTransaction;
