import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import styles from "../../components/LeftSidebar/LeftSidebar.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.mainLayout}>
      <LeftSidebar />
    </div>
  );
}
