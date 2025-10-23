import React from "react";
import { useSelector, useDispatch } from "react-redux";
import StatisticsChart from "../StatisticsChart/StatisticsChart.jsx";
import StatisticsTable from "../StatisticsTable/StatisticsTable.jsx";
import PeriodSelector from "../PeriodSelector/PeriodSelector.jsx";
import styles from "./Statistics.module.css";
import { selectStatisticsSummary } from "../../features/transactions/transactionsSelector.js";
import { setPeriod } from "../../features/transactions/transactionsSlice.js";

export default function Statistics() {
  const dispatch = useDispatch();

  const month = useSelector((state) => state.transactions.selectedMonth);
  const year = useSelector((state) => state.transactions.selectedYear);
  const { categoriesSummary, expenseTotal, incomeTotal, balanceAfter } =
    useSelector(selectStatisticsSummary);

  const handlePeriodChange = (newMonth, newYear) => {
    dispatch(setPeriod({ month: newMonth, year: newYear }));
  };

  const hasChartData =
    categoriesSummary &&
    Array.isArray(categoriesSummary) &&
    categoriesSummary.length > 0;

  return (
    <div className={styles.statisticsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Statistics</h1>
      </div>

      <div className={styles.statisticContentLayout}>
        {/* Sol kısım: Chart alanı */}
        <div className={styles.chartWrapper}>
          {hasChartData ? (
            <StatisticsChart
              data={categoriesSummary}
              centerAmount={balanceAfter}
            />
          ) : (
            <div className={styles.noDataPlaceholder}>
              <p>No data available for this period</p>
            </div>
          )}
        </div>

        {/* Sağ panel: Period + Table */}
        <div className={styles.rightPanel}>
          <div className={styles.periodAndTable}>
            <PeriodSelector
              month={month}
              year={year}
              onChange={handlePeriodChange}
            />
            <StatisticsTable
              data={categoriesSummary}
              expenseTotal={expenseTotal}
              incomeTotal={incomeTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
