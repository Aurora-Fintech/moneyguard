import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation.jsx";
import Balance from "../../components/Balance/Balance.jsx";
import CurrencyTab from "../../components/CurrencyTab/CurrencyTab.jsx";
import CurrencyAreaChart from "../../components/CurrencyAreaChart/CurrencyAreaChart.jsx";
import styles from "./LeftSidebar.module.css";

export default function LeftSidebar() {
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes("/currency")) return "currency";

    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className={styles.sidebar}>
      <Navigation />

      <div
        className={activeTab === "home" ? styles.homeTab : styles.currencyTab}
      >
        <Balance />
        <CurrencyTab />
        <CurrencyAreaChart />
      </div>
    </div>
  );
}
