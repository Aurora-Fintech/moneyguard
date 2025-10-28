import { createSelector } from "@reduxjs/toolkit";

const selectTransactionsList = (state) => state.transactions.transactionsList;
const selectAllCategories = (state) => state.categories.allCategories;

const selectSelectedMonth = (state) => state.transactions.selectedMonth;
const selectSelectedYear = (state) => state.transactions.selectedYear;

// Safe date parsing that handles multiple formats
const parseToLocalDate = (dateLike) => {
  if (!dateLike) return null;
  if (dateLike instanceof Date) return isNaN(dateLike.getTime()) ? null : dateLike;

  if (typeof dateLike === "string") {
    const str = dateLike.trim();

    // ISO or with time component -> let Date parse it (handles Z and offsets)
    if (str.includes("T")) {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    }

    // YYYY-MM-DD -> construct with year, month-1, day to avoid TZ shifts
    const ymd = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const [, y, m, d] = ymd;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(dt.getTime()) ? null : dt;
    }

    // dd.MM.yyyy -> legacy UI formatted string
    const dmyDots = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (dmyDots) {
      const [, d, m, y] = dmyDots;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(dt.getTime()) ? null : dt;
    }

    // dd/MM/yyyy -> fallback
    const dmySlashes = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dmySlashes) {
      const [, d, m, y] = dmySlashes;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      return isNaN(dt.getTime()) ? null : dt;
    }

    // As a last resort, try native parsing
    const fallback = new Date(str);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  // Unsupported type
  return null;
};

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
      const dateKey = t.transactionDate || t.date;

      const rawAmount = t.amount ?? t.sum ?? 0;
      const amount = Number(rawAmount);
      if (!Number.isFinite(amount)) return;

      const type = (t.type || "").toString().toLowerCase();
      const isExpense = type === "expense";
      const isIncome = type === "income";
      const categoryId = t.categoryId;

      const transactionDate = parseToLocalDate(dateKey);
      if (!transactionDate) return;
      const transactionMonth = Number(transactionDate.getMonth() + 1);
      const transactionYear = Number(transactionDate.getFullYear());

      if (
        transactionMonth !== Number(selectedMonth) ||
        transactionYear !== Number(selectedYear)
      ) {
        return;
      }

      if (isIncome) {
        incomeTotal += Math.abs(amount);
      } else if (isExpense) {
        expenseTotal += Math.abs(amount);
      }

      const isCategorized = isExpense && categoryId && categoryMap[categoryId];
      const finalCategoryId = isCategorized ? categoryId : "unknown_expense";

      if (isExpense) {
        const categoryInfo = isCategorized
          ? categoryMap[finalCategoryId]
          : { name: "Tanımsız İşlem", colorHex: "#808080", type: "EXPENSE" };

        if (!categoriesSummary[finalCategoryId]) {
          categoriesSummary[finalCategoryId] = {
            id: finalCategoryId,
            name: categoryInfo.name,
            total: 0,
            color: categoryInfo.colorHex,
            isExpense: true,
          };
        }
        categoriesSummary[finalCategoryId].total -= Math.abs(amount);
      }
    });

    // If there are no expense categories but there is income, show income as a pseudo-category
    if (Object.keys(categoriesSummary).length === 0 && incomeTotal > 0) {
      categoriesSummary["__income__"] = {
        id: "income_total",
        name: "Income",
        total: incomeTotal,
        color: "#109618",
        isExpense: false,
      };
    }

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
