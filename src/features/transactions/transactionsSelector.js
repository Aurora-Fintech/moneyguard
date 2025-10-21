import { createSelector } from "@reduxjs/toolkit";

const selectTransactionsList = (state) => state.transactions.transactionsList;
const selectAllCategories = (state) => state.categories.allCategories;

const selectSelectedMonth = (state) => state.transactions.selectedMonth;
const selectSelectedYear = (state) => state.transactions.selectedYear;

export const selectStatisticsSummary = createSelector(
  [
    selectTransactionsList,
    selectAllCategories,
    selectSelectedMonth,
    selectSelectedYear,
  ],
  (transactionsList, categories, selectedMonth, selectedYear) => {
    if (!transactionsList || transactionsList.length === 0) {
      return {
        categoriesSummary: [],
        incomeTotal: 0,
        expenseTotal: 0,
        balanceAfter: 0,
      };
    }

    const categoryMap =
      categories && categories.length > 0
        ? categories.reduce((map, cat) => {
            map[cat.id] = cat;
            return map;
          }, {})
        : {};

    let categoriesSummary = {};
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactionsList.forEach((t) => {
      const dateKey = t.date || t.transactionDate;

      const amount = t.amount;
      const type = t.type?.toLowerCase() || "unknown";
      const isExpense = type === "expense";
      const categoryId = t.categoryId;

      if (!dateKey) return;

      let safeDateKey = dateKey;
      if (
        typeof dateKey === "string" &&
        dateKey.length === 10 &&
        !dateKey.includes("T")
      ) {
        safeDateKey = dateKey + "T00:00:00";
      }

      const transactionDate = new Date(safeDateKey);
      if (isNaN(transactionDate.getTime())) return;
      const transactionMonth = Number(transactionDate.getMonth() + 1);
      const transactionYear = Number(transactionDate.getFullYear());

      if (
        transactionMonth !== Number(selectedMonth) ||
        transactionYear !== Number(selectedYear)
      ) {
        return;
      }

      if (type === "income") {
        incomeTotal += Math.abs(amount);
      } else if (isExpense) {
        expenseTotal += Math.abs(amount);
      }

      const isCategorized = categoryId && categoryMap[categoryId];
      const finalCategoryId = isCategorized ? categoryId : "unknown";

      if (isCategorized || finalCategoryId === "unknown") {
        const categoryInfo = isCategorized
          ? categoryMap[finalCategoryId]
          : { name: "Tanımsız İşlem", colorHex: "#808080" };

        if (!categoriesSummary[finalCategoryId]) {
          categoriesSummary[finalCategoryId] = {
            id: finalCategoryId,
            name: categoryInfo.name,
            total: 0,
            color: categoryInfo.colorHex,
            isExpense: isExpense,
          };
        }
        const sign = isExpense ? -1 : 1;
        categoriesSummary[finalCategoryId].total += sign * Math.abs(amount);
      }
    });

    const finalSummaryArray = Object.values(categoriesSummary).sort(
      (a, b) => Math.abs(b.total) - Math.abs(a.total)
    );

    return {
      categoriesSummary: finalSummaryArray,
      incomeTotal: incomeTotal,
      expenseTotal: expenseTotal,
      balanceAfter: incomeTotal - expenseTotal,
    };
  }
);
