// src/components/Transactions/ModalAddTransaction/AddTransactionForm.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getCategories } from "../../../features/categories/categoriesSlice";
import { addNewTransaction } from "../../../features/transactions/transactionsSlice";

import styles from "./AddTransactionForm.module.css";

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

  // DÜZELTİLDİ: Redux store'dan incomeCategories ve expenseCategories çekiliyor
  const { incomeCategories, expenseCategories, isLoading } = useSelector(
    (state) => state.categories
  );

  const [isIncome, setIsIncome] = useState(true);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const toggleSwitch = () => setIsIncome((prev) => !prev);

  // Kategori listesi Gelir/Gider durumuna göre belirlenir
  const categoriesToShow = isIncome ? incomeCategories : expenseCategories;

  // Bugünden ileri tarih seçilemez, maxDate olarak kullanılıyor
  const maxDate = new Date();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Transaction</h2>

      {/* Gelir / Gider Switch */}
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

      {/* --- Formik Form Başlangıç --- */}
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
          console.log("incomeCategories: ", incomeCategories);
          if (isIncome) {
            finalCategoryId = incomeCategories[0]?.id;
          } else {
            if (!values.category) {
              setFieldError("category", "Gider kategorisi seçimi zorunludur.");
              return;
            }

            // Kategori ID'si category name'ine göre bulunur
            const selectedCategory = categoriesToShow.find(
              (cat) => cat.name === values.category
            );

            finalCategoryId = selectedCategory?.id;

            if (!finalCategoryId) {
              setFieldError("category", "Geçersiz kategori ID'si.");
              return;
            }
          }

          const transactionData = {
            transactionDate: values.date.toISOString(),
            amount: parseFloat(values.sum),
            categoryId: finalCategoryId,
            type: isIncome ? "INCOME" : "EXPENSE",
            comment: values.comment || "",
          };

          try {
            await dispatch(addNewTransaction(transactionData)).unwrap();
            resetForm();
            onCancel();
          } catch (error) {
            alert(error?.message || "İşlem eklenirken hata oluştu.");
          }
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={styles.form}>
            {/* Kategori Seçimi (Sadece Expense için) */}
            {!isIncome && (
              <div className={styles.inputGroup}>
                <Field
                  as="select"
                  name="category"
                  className={`${styles.input} ${
                    touched.category && errors.category ? styles.inputError : ""
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

            {/* Tutar ve Tarih */}
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

              <div className={styles.inputGroup}>
                <DatePicker
                  selected={values.date}
                  onChange={(date) => setFieldValue("date", date)}
                  dateFormat="dd/MM/yyyy"
                  maxDate={maxDate} // Bugünden sonraki tarihi engeller
                  className={`${styles.input} ${
                    touched.date && errors.date ? styles.inputError : ""
                  }`}
                />
                {touched.date && errors.date && (
                  <div className={styles.errorText}>{errors.date}</div>
                )}
              </div>
            </div>

            {/* Yorum */}
            <div className={styles.inputGroup}>
              <Field
                as="textarea"
                name="comment"
                placeholder="Comment"
                className={styles.input}
              />
            </div>

            {/* Butonlar */}
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
        )}
      </Formik>
    </div>
  );
};

export default AddTransactionForm;
