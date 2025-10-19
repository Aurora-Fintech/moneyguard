// import React from "react";
// import { useSelector } from "react-redux";
// import styles from "./Balance.module.css";

// const selectTotalBalance = (state) => state.transactions.balance;

// const Balance = () => {
//   const totalBalance = useSelector(selectTotalBalance);

//   const formatBalance = (amount) => {
//     return new Intl.NumberFormat("tr-TR", {
//       style: "currency",
//       currency: "TRY",
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   return (
//     <div className={styles.balanceContainer}>
//       <p className="dashboard-balance-txt">YOUR BALANCE</p>
//       <div className="dashboard-value">{formatBalance(totalBalance)}</div>
//     </div>
//   );
// };

// export default Balance;
