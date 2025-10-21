import React from "react";
import styles from "./PeriodSelector.module.css";

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const getYearOptions = () => {
  const START_YEAR = 2000;
  const END_YEAR = 2025;

  const years = [];

  for (let i = END_YEAR; i >= START_YEAR; i--) {
    years.push(i);
  }

  return years.map((year) => ({ value: year, label: String(year) }));
};

/**
 * İstatistikler için Ay ve Yıl seçme Dropdown bileşeni.
 * @param {number} month
 * @param {number} year
 * @param {function} onChange
 */
const PeriodSelector = ({ month, year, onChange }) => {
  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value);
    onChange(newMonth, year);
  };

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value);
    onChange(month, newYear);
  };

  const yearOptions = getYearOptions();

  return (
    <div className={styles.selectorContainer}>
      {/* Ay Seçimi  */}
      <select
        className={styles.dropdown}
        value={month}
        onChange={handleMonthChange}
      >
        {MONTH_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Yıl Seçimi  */}
      <select
        className={styles.dropdown}
        value={year}
        onChange={handleYearChange}
      >
        {yearOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodSelector;
