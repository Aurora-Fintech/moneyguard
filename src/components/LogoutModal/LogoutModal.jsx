import React, { useState, useEffect } from "react";
import styles from "./LogoutModal.module.css";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authOperations";
import logo from '../../assets/icons/logo.svg';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"; 

export default function LogoutModal({ onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const showSuccessToast = () => {
    iziToast.show({
      title: "Success",
      message: "You have logged out successfully",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      color: "#000",
      backgroundColor: "#4BB543",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,  
      padding: 25,    
    });
  };

  const showErrorToast = (errorMsg) => {
    iziToast.show({
      title: "Error",
      message: errorMsg || "Logout failed due to server error",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      color: "#000",
      backgroundColor: "#FF4C4C", // red
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,
      padding: 25,
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await dispatch(logout()).unwrap();
      onClose();
      showSuccessToast();
    } catch (error) {
      showErrorToast(error?.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalLogo}>
          <img src={logo} alt="Money Guard" className={styles.headerLogo} />
          <h3 className={styles.modalTitle}>Money Guard</h3>
        </div>
        <span className="logout-text">Are you sure you want to log out?</span>
        <div className={styles.modalbtnDiv}>
          <button
            onClick={handleConfirm}
            className="form-button"
            disabled={loading}
          >
            {loading ? "Logging out..." : "LOG OUT"}
          </button>
          <button
            onClick={onClose}
            className="form-button-register"
            disabled={loading}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
