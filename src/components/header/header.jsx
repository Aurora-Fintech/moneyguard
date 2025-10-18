import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../LogoutModal/LogoutModal';
import { selectUser } from '../../features/auth/authSelectors';
import styles from './Header.module.css';
import logo from '../../assets/icons/logo.svg';
import exitIcon from '../../assets/icons/exit.svg';
import '../../styles/global.css';

export default function Header() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const username = user?.email ? user.email.split('@')[0] : 'Name';

  const openLogoutModal = () => setIsLogoutOpen(true);
  const closeLogoutModal = () => setIsLogoutOpen(false);

  return (
   <header className={styles.header}>
  <div className={styles.headerContainer}>
    <div className={styles.headerLeft}>
      <img src={logo} alt="Money Guard" className={styles.headerLogo} />
      <span className={styles.appName}>Money Guard</span>
    </div>

    <div className={styles.headerRight}>
      <span className="exit-text">{username}</span>
      <span className={styles.headerDivider}></span>
      <button className={styles.exitBtn} onClick={openLogoutModal}>
        <img
          src={exitIcon}
          alt="exit"
          className={styles.exitIcon}
          
        />
        <span className={styles.exitText}>Exit</span>
      </button>
    </div>
  </div>

  {isLogoutOpen && (
    <LogoutModal onClose={closeLogoutModal} navigate={navigate} />
  )}
</header>

  );
}
