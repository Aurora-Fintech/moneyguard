import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// Redux aksiyonları
import {
  getTransactions,
  toggleModal,
} from "../../features/transactions/transactionsSlice";
import { getCategories } from "../../features/categories/categoriesSlice";

// Bileşenler
import TransactionsList from "../../components/Transactions/TransactionsList/TransactionsList";
import ModalAddTransaction from "../../components/Transactions/ModalAddTransaction/ModalAddTransaction";

// CSS Modülü import edildi
import styles from "./HomeTable.module.css";

export default function DashboardPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // İşlemleri ve Kategorileri Redux store'a çek
    dispatch(getTransactions());
    dispatch(getCategories());
  }, [dispatch]);

  const handleOpenModal = () => {
    // İşlem ekleme modalını aç
    dispatch(toggleModal(true));
  };

  return (
    <>
      {/* Transaction Add Modal */}
      <ModalAddTransaction />

      {/* Ana Layout: Tüm alanı kaplar ve listeyi barındırır */}
      <div className={styles.dashboardLayout}>
        {/* İşlem Listesi bileşeni (içi boşsa EmptyTransactions'ı gösterir) */}
        <TransactionsList />
      </div>

      {/* Floating Action Button (+) - Sabit Buton */}
      {/* Bu buton, sayfa içeriği ne olursa olsun (boş liste/dolu liste) sabit kalır. */}
      <button
        onClick={handleOpenModal}
        className={styles.fabButton} // CSS Modülünden stil çekildi
      >
        +
      </button>
    </>
  );
}
