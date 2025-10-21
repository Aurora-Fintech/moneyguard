import React from "react";
import styles from "./StatisticsTable.module.css";

const DEFAULT_COLORS = [
  "#36A2EB",
  "#FF6384",
  "#FF9F40",
  "#FFCD56",
  "#4BC0C0",
  "#9966FF",
  "#C9CBCF",
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
];

/**
 * İstatistikler sekmesindeki kategori bazlı işlem listesini gösteren tablo bileşeni.
 * @param {Array<Object>} data - categoriesSummary'den gelen filtrelenmemiş tüm veriler (Gelir + Gider).
 * @param {number} expenseTotal - Seçilen dönemin toplam gideri.
 * @param {number} incomeTotal - Seçilen dönemin toplam geliri.
 */
const StatisticsTable = ({ data = [], expenseTotal = 0, incomeTotal = 0 }) => {
  const tableData = data.map((item) => ({
    ...item,
    absTotal: Math.abs(item.total),
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(Number.isFinite(amount) ? amount : 0);
  };

  if (tableData.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <h4 className={styles.noData}>
          Seçilen dönemde hiçbir işlem bulunmamaktadır.
        </h4>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <ul className={styles.categoryList}>
        {tableData.map((item, index) => {
          const color =
            item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];

          return (
            <li key={item.name} className={styles.categoryItem}>
              <div className={styles.categoryNameWrapper}>
                <span
                  className={styles.colorIndicator}
                  style={{ backgroundColor: color }}
                ></span>
                <span className={styles.categoryName}>{item.name}</span>
              </div>
              <div className={styles.sumWrapper}>
                <span className={styles.sum}>
                  {formatCurrency(item.absTotal)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.totalsWrapper}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Expenses:</span>
          <span className={styles.expenseAmount}>
            {formatCurrency(Math.abs(expenseTotal))}
          </span>
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Income:</span>
          <span className={styles.incomeAmount}>
            {formatCurrency(incomeTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTable;
