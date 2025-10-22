import React from "react";
import styles from "./PeriodSelector.module.css";
import Select from "react-select";

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
  const yearOptions = getYearOptions();
  const classNames = {
    control: () => styles.dropdownControl,
    menu: () => styles.dropdownMenu,
    option: () => styles.dropdownOption,
    singleValue: () => styles.dropdownValue,
    valueContainer: () => styles.dropdownValueContainer,
    indicatorsContainer: () => styles.dropdownIndicators,
  };

  // zorunlu inline styles
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      background:
        "linear-gradient(360deg, rgba(83, 61, 186, 0.7) 0%, rgba(80, 48, 154, 0.7) 35.94%, rgba(106, 70, 165, 0.7) 61.04%, rgba(133, 93, 175, 0.7) 100%)",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#FF868D" : "transparent",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }),
  };

  const selectedMonth = MONTH_OPTIONS.find((opt) => opt.value === month);
  const selectedYear = yearOptions.find((opt) => opt.value === year);

  return (
    <div className={styles.selectorContainer}>
      <Select
        value={selectedMonth}
        onChange={(option) => onChange(option.value, year)}
        options={MONTH_OPTIONS}
        classNames={classNames}
        styles={customStyles}
        isSearchable={false}
        placeholder="Ay Seçin"
        menuPortalTarget={document.body}
      />

      <Select
        value={selectedYear}
        onChange={(option) => onChange(month, option.value)}
        options={yearOptions}
        classNames={classNames}
        styles={customStyles}
        isSearchable={false}
        placeholder="Yıl Seçin"
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default PeriodSelector;
