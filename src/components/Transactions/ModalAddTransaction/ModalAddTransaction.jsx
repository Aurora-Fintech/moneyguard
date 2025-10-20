// src/components/Transactions/ModalAddTransaction/ModalAddTransaction.jsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../../features/transactions/transactionsSlice";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import styles from "./ModalAddTransaction.module.css";

const ModalAddTransaction = () => {
  const dispatch = useDispatch();
  // isModalOpen'ı buradan çekmeye gerek yok, çünkü render koşulunu dışarı taşıdık,
  // ama kodunuzda dursun istiyorsanız tutabilirsiniz.

  // Modal'ı kapatma fonksiyonu
  const handleClose = () => {
    // Redux'a modalı kapatması için aksiyon gönderilir (payload olmadan tam tersini yapar)
    dispatch(toggleModal());
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleClose} // 🟢 DÜZELTME: handleClose çağrıldı
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={handleClose} // 🟢 DÜZELTME: handleClose çağrıldı
        >
          &times;
        </button>

        {/* onCancel prop'u handleClose'a bağlanır */}
        <AddTransactionForm onCancel={handleClose} />
      </div>
    </div>
  );
};

export default ModalAddTransaction;
