// src/components/Transactions/ModalAddTransaction/AddTransactionForm.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getCategories } from "../../../features/categories/categoriesSlice";
import { addNewTransaction } from "../../../features/transactions/transactionsSlice";

import styles from "./AddTransactionForm.module.css";

// iziToast import
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Sabit Income kategorisi ID'si
const INCOME_CATEGORY_ID = "063f25c8-1033-40f4-b15b-21d496c8a584";

// --- Form doğrulama ---
const validationSchema = Yup.object().shape({
  sum: Yup.number()
    .typeError("Tutar geçerli bir sayı olmalıdır.")
    .positive("Tutar pozitif olmalı")
    .required("Tutar zorunludur"),
  date: Yup.date().required("Tarih zorunludur"),
});

const AddTransactionForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { incomeCategories, expenseCategories } = useSelector(
    (state) => state.categories
  );

  const [isIncome, setIsIncome] = useState(true);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const toggleSwitch = () => setIsIncome((prev) => !prev);
  const categoriesToShow = isIncome ? incomeCategories : expenseCategories;
  const maxDate = new Date();

  // --- iziToast fonksiyonları ---
  const showSuccessToast = () => {
    iziToast.show({
      title: "Success",
      message: "Transaction added successfully",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      backgroundColor: "#4BB543",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,
      padding: 25,
    });
  };

  const showErrorToast = (msg) => {
    iziToast.show({
      title: "Error",
      message: msg || "Transaction could not be added",
      position: "topRight",
      timeout: 3000,
      progressBar: true,
      backgroundColor: "#FF4C4C",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      layout: 2,
      zindex: 9999,
      maxWidth: 500,
      padding: 25,
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Transaction</h2>

      {/* --- Income/Expense Switch --- */}
      <div className={styles.switchWrapper}>
        <span
          className={styles.switchText}
          style={{
            color: isIncome ? "var(--yellow)" : "var(--font-color-white)",
          }}
        >
          Income
        </span>

        <div className={styles.switchBackground} onClick={toggleSwitch}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSwitch();
            }}
            className={`${styles.switchButton} ${
              isIncome ? styles.income : styles.expense
            }`}
          >
            {isIncome ? "+" : "−"}
          </button>
        </div>

        <span
          className={styles.switchText}
          style={{
            color: !isIncome ? "var(--red)" : "var(--font-color-white)",
          }}
        >
          Expense
        </span>
      </div>

      {/* --- Formik --- */}
      <Formik
        initialValues={{
          category: "",
          sum: "",
          date: new Date(),
          comment: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldError }) => {
          let finalCategoryId;
          let amount = parseFloat(values.sum);

          if (isIncome) {
            finalCategoryId = incomeCategories[0]?.id;
          } else {
            if (!values.category) {
              setFieldError("category", "Gider kategorisi seçimi zorunludur.");
              return;
            }

            const selectedCategory = categoriesToShow.find(
              (cat) => cat.name === values.category
            );

            finalCategoryId = selectedCategory?.id;

            if (!finalCategoryId) {
              setFieldError("category", "Geçersiz kategori ID'si.");
              return;
            }

            amount = -amount;
          }

          const transactionData = {
            transactionDate: values.date.toISOString(),
            amount,
            categoryId: finalCategoryId,
            type: isIncome ? "INCOME" : "EXPENSE",
            comment: values.comment || "",
          };

          try {
            await dispatch(addNewTransaction(transactionData)).unwrap();
            resetForm();
            showSuccessToast();
          } catch (error) {
            console.error(error);
            showErrorToast(error?.message);
          }
        }}
      >
        {({ values, setFieldValue, errors, touched }) => {
          const [toastShown, setToastShown] = React.useState(false);

          const handleCommentChange = (e) => {
            let value = e.target.value;
            let showToast = false;

            const lines = value.split("\n");
            if (lines.length > 2) {
              value = lines.slice(0, 2).join("\n");
              showToast = true;
            }

            if (value.length > 30) {
              value = value.slice(0, 30);
              showToast = true;
            }

            setFieldValue("comment", value);

            if (showToast && !toastShown) {
              iziToast.show({
                title: "Uyarı",
                message: "Yorum en fazla 2 satır ve 30 karakter olabilir",
                position: "topRight",
                timeout: 3000,
                progressBar: true,
                backgroundColor: "rgba(255, 134, 141, 1)",
              });
              setToastShown(true);
            }

            if (!showToast && toastShown) {
              setToastShown(false);
            }
          };

          return (
            <Form className={styles.form}>
              {!isIncome && (
                <div className={styles.inputGroup}>
                  <Field
                    as="select"
                    name="category"
                    className={`${styles.input} ${
                      touched.category && errors.category
                        ? styles.inputError
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categoriesToShow?.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Field>
                  {touched.category && errors.category && (
                    <div className={styles.errorText}>{errors.category}</div>
                  )}
                </div>
              )}

              {/* --- Amount + Date --- */}
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <Field
                    name="sum"
                    type="text"
                    placeholder="0.00"
                    className={`${styles.input} ${
                      touched.sum && errors.sum ? styles.inputError : ""
                    }`}
                    onKeyDown={(e) =>
                      ["-", "+", "e"].includes(e.key) && e.preventDefault()
                    }
                  />
                  {touched.sum && errors.sum && (
                    <div className={styles.errorText}>{errors.sum}</div>
                  )}
                </div>

                <div className={`${styles.inputGroup} ${styles.dateWrapper}`}>
                  <DatePicker
                    selected={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                    dateFormat="dd/MM/yyyy"
                    maxDate={maxDate}
                    className={`${styles.input} ${
                      touched.date && errors.date ? styles.inputError : ""
                    }`}
                  />
                  <svg
                    className={styles.calendarIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="var(--font-color-white-60)"
                      strokeWidth="2"
                      d="M7 11h10M7 15h10M5 5h14a2 2 0 0 1 2 2v12a2 
                      2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 
                      2-2Zm2-4v4m10-4v4"
                    />
                  </svg>
                </div>
              </div>

              {/* --- Comment --- */}
              <div className={styles.inputGroup}>
                <textarea
                  name="comment"
                  placeholder="Comment"
                  className={styles.input}
                  rows={2}
                  value={values.comment}
                  onChange={handleCommentChange}
                />
              </div>

              {/* --- Butonlar --- */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitBtn}>
                  Add
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddTransactionForm;
