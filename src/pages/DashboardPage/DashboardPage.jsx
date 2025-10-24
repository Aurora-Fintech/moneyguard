import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import styles from "./DashboardPage.module.css";
import Header from "../../components/header/header.jsx";
import Balance from "../../components/Balance/Balance.jsx";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <Header />
      <div className={styles.container}>
        <aside className={styles.leftSidebar}>
          <Balance />
          <LeftSidebar />
          <div className={styles.sidebarDivider}></div>
        </aside>

        {/* SAĞ ALAN: sadece Outlet */}
        <main className={styles.mainArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
