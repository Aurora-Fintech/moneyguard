// src/pages/DashboardPage/DashboardPage.jsx (Hometable olarak adlandırdığınız dosya)

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // useSelector'ı ekledik

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

  // DÜZELTME: Modal durumunu Redux'tan çekiyoruz.
  const isModalOpen = useSelector((state) => state.transactions?.isModalOpen);

  useEffect(() => {
    dispatch(getTransactions());
    dispatch(getCategories());
  }, [dispatch]);

  const handleOpenModal = () => {
    // Modal açılırken sadece toggleModal() çağrılabilir, ancak sizin
    // toggleModal(true) kullanımınız da slice içinde desteklendiği için korunmuştur.
    dispatch(toggleModal(true));
  };

  return (
    <>
      {/* 🟢 ANA DÜZELTME: Modal sadece isModalOpen true ise render edilir */}
      {isModalOpen && <ModalAddTransaction />}

      {/* Ana Layout: Tüm alanı kaplar ve listeyi barındırır */}
      <div className={styles.dashboardLayout}>
        <TransactionsList />
      </div>

      {/* Floating Action Button (+) - Sabit Buton */}
      <button onClick={handleOpenModal} className={styles.fabButton}>
        +
      </button>
    </>
  );
}
