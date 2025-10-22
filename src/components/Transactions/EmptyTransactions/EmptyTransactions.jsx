import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../../features/transactions/transactionsSlice";
import styles from "./EmptyTransactions.module.css";

const EmptyTransactions = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) => state.transactions.isModalOpen);

  return (
    <section
      className={`${styles.emptyContainer} ${
        isModalOpen ? styles.inactive : ""
      }`}
      aria-live="polite"
    >
      <div className={styles.inner}>
        <h3 className={styles.title} aria-hidden={isModalOpen}>
          No transactions available yet.
        </h3>

        <p className={styles.subtitle} aria-hidden={isModalOpen}>
          Let&apos;s add your first transaction:
        </p>

        <button
          type="button"
          onClick={() => dispatch(toggleModal())}
          className={`form-button ${styles.addButton}`}
          aria-hidden={isModalOpen}
        >
          ADD TRANSACTION
        </button>
      </div>
    </section>
  );
};

export default EmptyTransactions;
