// src/assets/components/Transactions/ModalEditTransaction/EditTransactionForm.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateTransactionThunk } from "../../../features/transactions/transactionsSlice";
import styles from "./EditTransactionForm.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTransactionForm = ({ onSaveSuccess }) => {
  const dispatch = useDispatch();
  const editingTransaction = useSelector(
    (state) => state.transactions.editingTransaction
  );
  const expenseCategories = useSelector(
    (state) => state.categories.expenseCategories
  );

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(0.01, "Miktar 0'dan büyük olmalıdır.")
      .required("Miktar zorunludur."),
    transactionDate: Yup.date()
      .required("Tarih zorunludur.")
      .max(new Date(), "İşlem tarihi gelecekte olamaz."),
    categoryId: Yup.string().when("type", {
      is: (type) => type === "EXPENSE",
      then: () => Yup.string().required("Gider kategorisi zorunludur."),
      otherwise: () => Yup.string().notRequired(),
    }),
    comment: Yup.string().max(30, "Yorum 30 karakterden uzun olamaz."),
    type: Yup.string()
      .oneOf(["INCOME", "EXPENSE"])
      .required("İşlem türü zorunludur."),
  });

  const getInitialValues = (tx) => {
    if (!tx) {
      return {
        id: null,
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
        comment: "",
      };
    }

    const type = tx.type?.toUpperCase() || "EXPENSE";
    const amount = Math.abs(tx.amount || tx.sum || "");
    const transactionDateStr = tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const initialCategoryId =
      tx.categoryId && type === "EXPENSE" ? tx.categoryId : "";

    return {
      id: tx.id,
      amount,
      transactionDate: transactionDateStr,
      type,
      categoryId: initialCategoryId,
      comment: tx.comment || "",
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const finalAmount =
        values.type === "EXPENSE"
          ? -Math.abs(Number(values.amount))
          : Math.abs(Number(values.amount));

      const payload = {
        id: values.id,
        amount: finalAmount,
        transactionDate: values.transactionDate,
        type: values.type,
        comment: values.comment,
        categoryId: values.type === "EXPENSE" ? values.categoryId : null,
      };

      const resultAction = await dispatch(updateTransactionThunk(payload));

      if (updateTransactionThunk.fulfilled.match(resultAction)) {
        onSaveSuccess();
      } else {
        alert("İşlem güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("İşlem güncellenirken beklenmedik bir hata oluştu.");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (!editingTransaction) {
    return (
      <div className={styles.editFormLoadingMessage}>
        Düzenlenecek işlem bulunamadı.
      </div>
    );
  }

  return (
    <Formik
      initialValues={getInitialValues(editingTransaction)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting, errors, touched }) => (
        <Form className={styles.editForm}>
          {/* --- TYPE SHOW ONLY --- */}
          <div className={styles.editFormTypeSwitcher}>
            <span
              className={`${styles.editFormTypeLabel} ${
                editingTransaction.type === "INCOME"
                  ? styles.editFormActiveIncome
                  : ""
              }`}
            >
              Income
            </span>

            <span
              className={`${styles.editFormTypeLabel} ${
                editingTransaction.type === "EXPENSE"
                  ? styles.editFormActiveExpense
                  : ""
              }`}
            >
              Expense
            </span>
          </div>

          {/* Kategori Seçimi (sadece EXPENSE ise) */}
          {values.type === "EXPENSE" && (
            <div className={styles.editFormGroup}>
              <Field
                as="select"
                name="categoryId"
                className={styles.editFormInput}
              >
                <option value="" disabled>
                  Kategori Seçin
                </option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className={styles.editFormError}
              />
            </div>
          )}

          {/* Miktar ve Tarih */}
          <div className={styles.editFormAmountDateGroup}>
            <div className={styles.editFormGroup}>
              <Field
                type="number"
                name="amount"
                placeholder="Miktar (₺)"
                className={styles.editFormInput}
              />
              <ErrorMessage
                name="amount"
                component="div"
                className={styles.editFormError}
              />
            </div>

            <div className={styles.editFormGroupDate}>
              <DatePicker
                selected={
                  values.transactionDate
                    ? new Date(values.transactionDate)
                    : null
                }
                onChange={(date) =>
                  setFieldValue(
                    "transactionDate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                dateFormat="dd.MM.yyyy"
                maxDate={new Date()}
                placeholderText="Tarih"
                className={`${styles.editFormInput} ${styles.editFormDateInput}`}
              />
              <ErrorMessage
                name="transactionDate"
                component="div"
                className={styles.editFormError}
              />
            </div>
          </div>

          {/* Yorum */}
          <div className={styles.editFormGroup}>
            <Field
              as="textarea"
              name="comment"
              placeholder="Yorum"
              className={styles.editFormInput}
            />
            <ErrorMessage
              name="comment"
              component="div"
              className={styles.editFormError}
            />
          </div>

          {/* Butonlar */}
          <div className={styles.editFormButtonGroup}>
            <button
              type="submit"
              className={styles.editFormSaveButton}
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Kaydediliyor..." : "SAVE"}
            </button>
            <button
              type="button"
              className={styles.editFormCancelButton}
              onClick={onSaveSuccess}
              disabled={isSubmitting || isLoading}
            >
              CANCEL
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditTransactionForm;
