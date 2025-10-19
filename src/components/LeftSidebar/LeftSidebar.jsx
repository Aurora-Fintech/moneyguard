import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation.jsx";
// import Balance from "../../components/Balance/Balance.jsx";
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
  <div className={styles.leftColumn}>
    <Navigation />
    {/* <Balance /> */}
  </div>
  <div className={styles.rightColumn}>
    <div className={activeTab === "home" ? styles.homeTab : styles.currencyTab}>
      <CurrencyTab />
      <CurrencyAreaChart />
    </div>
  </div>
</div>

  );
}
