import React from "react";
import { useSelector } from "react-redux";
import styles from "./Balance.module.css";

const selectTotalBalance = (state) => state.transactions?.balance;

// para birimi için
const formatBalance = (amount) => {
  const validAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(validAmount);
};

const Balance = () => {
  const totalBalance = useSelector(selectTotalBalance);

  return (
    <div className={styles.balanceContainer}>
      <p className={styles.dashboardBalanceTxt}>YOUR BALANCE</p>
      <div className="dashboard-value">{formatBalance(totalBalance)}</div>
    </div>
  );
};

export default Balance;
