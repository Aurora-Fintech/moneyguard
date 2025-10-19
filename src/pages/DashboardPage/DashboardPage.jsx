import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import HomeTable from "../../components/HomeTable/HomeTable.jsx";
import styles from "./DashboardPage.module.css";
import Header from "../../components/header/header.jsx";

const DashboardPage = () => {
  return (
    <div className={styles.dashboardPage}>
      <Header />
      <div className={styles.container}>
        <aside className={styles.leftSidebar}>
          <LeftSidebar />
          <div className={styles.sidebarDivider}></div>
        </aside>
        <HomeTable />
      </div>
    </div>
  );
};

export default DashboardPage;
