
import React from 'react';
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import styles from "../../components/LeftSidebar/LeftSidebar.module.css";
import Header from '../../components/header/header.jsx'; 

export default function DashboardPage() {
  return (
    <div className={styles.mainLayout}>
      <Header />
      <LeftSidebar />
    </div>
  );
}
