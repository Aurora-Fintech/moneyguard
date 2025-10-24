import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import logoIcon from "../../assets/icons/moneyGuardLogo.svg";

const students = [
  {
    name: "Furkan Yücel",
    github: "https://github.com/furkycl",
    linkedin: "https://www.linkedin.com/in/furkycl",
    title: "Team Lead",
  },
  {
    name: "Cemre Deniz Yıldız",
    github: "https://github.com/Cemrdeniz",
    linkedin: "https://www.linkedin.com/in/cemre-yildiz",
    title: "Scrum Master",
  },
  {
    name: "Burcu Budak",
    github: "https://github.com/cucuhead",
    linkedin: "https://www.linkedin.com/in/burcu-budak",
    title: "Full Stack Developer",
  },
  {
    name: "Begüm Narmanlı",
    github: "https://github.com/begumnarmanli",
    linkedin: "https://www.linkedin.com/in/begumnarmanli",
    title: "Full Stack Developer",
  },
  {
    name: "Berke Zopirli",
    github: "https://github.com/zopirli-berke",
    linkedin: "https://www.linkedin.com/in/berke-zopirli",
    title: "Full Stack Developer",
  },
];

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const nextStudent = () => {
    setCurrentStudentIndex((prevIndex) => (prevIndex + 1) % students.length);
  };
  const prevStudent = () => {
    setCurrentStudentIndex(
      (prevIndex) => (prevIndex - 1 + students.length) % students.length
    );
  };

  const currentStudent = students[currentStudentIndex];

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerWrapper}>
          <div className={styles.logoContainer}>
            <img
              src={logoIcon}
              alt="Money Guard Logo"
              className={styles.logoIcon}
            />

            <span className={styles.logoText}>Money Guard</span>
          </div>

          <div className={styles.infoContainer}>
            <span className={styles.rightsText}>
              © 2025 All rights reserved
            </span>
            <span className={styles.studentLink} onClick={openModal}>
              GoIT Student
            </span>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className={styles.backdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>

            <h2 className={styles.modalHeader}>Our Team</h2>

            <div className={styles.studentCard}>
              <h3 className={styles.studentName}>{currentStudent.name}</h3>
              <p className={styles.studentTitle}>{currentStudent.title}</p>
              <p className={styles.studentCounter}>
                {currentStudentIndex + 1} / {students.length}
              </p>

              <div className={styles.linksContainer}>
                <a
                  href={currentStudent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  GitHub
                </a>
                <a
                  href={currentStudent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            <div className={styles.navigation}>
              <button className={styles.navButton} onClick={prevStudent}>
                &larr; Previous
              </button>
              <button className={styles.navButton} onClick={nextStudent}>
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
