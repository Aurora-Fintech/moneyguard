import React from "react";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../../features/transactions/transactionsSlice";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import styles from "./ModalAddTransaction.module.css";

const ModalAddTransaction = () => {
  const dispatch = useDispatch();

  // Modal'ı kapatma fonksiyonu
  const handleClose = () => {
    dispatch(toggleModal());
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose}>
          &times;
        </button>

        {/* onCancel prop'u handleClose'a bağlanır */}
        <AddTransactionForm onCancel={handleClose} />
      </div>
    </div>
  );
};

export default ModalAddTransaction;
