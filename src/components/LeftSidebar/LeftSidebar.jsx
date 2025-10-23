import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation.jsx";
import CurrencyTab from "../../components/CurrencyTab/CurrencyTab.jsx";
import CurrencyAreaChart from "../../components/CurrencyAreaChart/CurrencyAreaChart.jsx";
import Balance from "../../components/Balance/Balance.jsx";
import styles from "./LeftSidebar.module.css";

export default function LeftSidebar() {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/statistics")) return "statistics";
    if (path.startsWith("/dashboard/currency")) return "currency";
    if (path === "/dashboard" || path === "/dashboard/") return "home";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className={styles.sidebar}>
      {/* Sol kolon: Navigation + Balance */}
      <div className={styles.leftColumn}>
        <Navigation />

        {/* Balance — mobilde sadece home, tablet+ her zaman */}
        <div
          className={`${styles.balance} ${
            activeTab !== "home" ? styles.hideOnMobile : ""
          }`}
        >
          <Balance />
        </div>
      </div>

      {/* Sağ kolon: CurrencyTab + Chart */}
      <div className={styles.rightColumn}>
        <div
          className={`${styles.currencyTab} ${
            activeTab === "currency" ? styles.activeMobile : ""
          }`}
        >
          <CurrencyTab />
          <CurrencyAreaChart />
        </div>
      </div>
    </div>
  );
}
