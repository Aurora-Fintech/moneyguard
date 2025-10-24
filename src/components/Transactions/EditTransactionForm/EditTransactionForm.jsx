import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateTransactionThunk,
  closeEditModal,
} from "../../../features/transactions/transactionsSlice";
import styles from "./EditTransactionForm.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const EditTransactionForm = () => {
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
      .min(0.01, "Amount must be greater than 0.")
      .required("Amount is required."),
    transactionDate: Yup.date()
      .required("Date is required.")
      .max(new Date(), "Transaction date cannot be in the future."),
    categoryId: Yup.string().when("type", {
      is: (type) => type === "EXPENSE",
      then: () => Yup.string().required("Expense category is required."),
      otherwise: () => Yup.string().notRequired(),
    }),
    comment: Yup.string().max(30, "Comment cannot exceed 30 characters."),
    type: Yup.string()
      .oneOf(["INCOME", "EXPENSE"])
      .required("Type is required."),
  });

  const getInitialValues = (tx) => {
    if (!tx)
      return {
        id: null,
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
        comment: "",
      };

    const type = tx.type?.toUpperCase() || "EXPENSE";
    const amount = Math.abs(tx.amount ?? tx.sum ?? "");
    const transactionDateStr = tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const initialCategoryId =
      tx.categoryId && type === "EXPENSE" ? String(tx.categoryId) : "";

    return {
      id: tx.id,
      amount,
      transactionDate: transactionDateStr,
      type,
      categoryId: initialCategoryId,
      comment: tx.comment || "",
    };
  };

  const showSuccessToast = () => {
    iziToast.show({
      title: "Success",
      message: "Transaction updated successfully",
      position: "topRight",
      timeout: 2800,
      progressBar: true,
      backgroundColor: "#4BB543",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      zindex: 9999,
    });
  };

  const showErrorToast = (msg) => {
    iziToast.show({
      title: "Error",
      message: msg || "An error occurred while updating",
      position: "topRight",
      timeout: 3200,
      progressBar: true,
      backgroundColor: "#FF4C4C",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      zindex: 9999,
    });
  };

  const categoryOptions = useMemo(
    () =>
      (expenseCategories || []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [expenseCategories]
  );

  const selectStyles = useMemo(
    () => ({
      container: (base) => ({ ...base, width: "100%" }),
      control: (base, state) => ({
        ...base,
        minHeight: 44,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        borderBottom: `2px solid rgba(255,255,255,${
          state.isFocused ? 1 : 0.3
        })`,
        borderRadius: 0,
        cursor: "pointer",
      }),
      valueContainer: (b) => ({ ...b, padding: "4px 0 8px 0" }),
      placeholder: (b) => ({
        ...b,
        color: "var(--font-color-white-60)",
        fontFamily: "var(--font-family-base)",
      }),
      singleValue: (b) => ({
        ...b,
        color: "var(--font-color-white)",
        fontFamily: "var(--font-family-base)",
      }),
      indicatorsContainer: (b) => ({ ...b, color: "var(--font-color-white)" }),
      dropdownIndicator: (b, s) => ({
        ...b,
        transition: "transform .2s ease",
        transform: s.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      }),
      menuPortal: (b) => ({ ...b, zIndex: 10000 }),
      menu: (b) => ({
        ...b,
        background: "var(--dropdown-color-gradient)",
        borderRadius: 16,
        boxShadow: "0 12px 24px rgba(0,0,0,.35)",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
      }),
      menuList: (b) => ({ ...b, padding: 8, maxHeight: 240 }),
      option: (base, state) => {
        const isHover = state.isFocused && !state.isSelected;
        return {
          ...base,
          borderRadius: 12,
          color: isHover ? "#FF868D" : "var(--font-color-white)",
          background: state.isSelected
            ? "linear-gradient(96.76deg,#ffc727 -16.42%,#9e40ba 97.04%,#7000ff 150.71%)"
            : isHover
            ? "rgba(255, 134, 141, 0.18)"
            : "transparent",
          cursor: "pointer",
        };
      },
      noOptionsMessage: (b) => ({ ...b, color: "var(--font-grey)" }),
    }),
    [expenseCategories]
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && dispatch(closeEditModal());
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) dispatch(closeEditModal());
    },
    [dispatch]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const finalAmount =
        values.type === "EXPENSE"
          ? -Math.abs(Number(values.amount))
          : Math.abs(Number(values.amount));
      if (values.type === "EXPENSE" && !values.categoryId) {
        showErrorToast("Expense category is required.");
        setSubmitting(false);
        setIsLoading(false);
        return;
      }

      const payload = {
        id: values.id,
        amount: finalAmount,
        transactionDate: values.transactionDate,
        type: values.type,
        comment: values.comment,
        categoryId:
          values.type === "EXPENSE" ? String(values.categoryId) : null,
      };

      const resultAction = await dispatch(updateTransactionThunk(payload));
      if (updateTransactionThunk.fulfilled.match(resultAction)) {
        showSuccessToast();
        dispatch(closeEditModal());
      } else {
        showErrorToast();
      }
    } catch (error) {
      console.error("Update error:", error);
      showErrorToast("Unexpected error");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (!editingTransaction) {
    return (
      <div
        className={styles.overlay}
        role="dialog"
        aria-modal="true"
        onClick={handleOverlayClick}
      >
        <div className={styles.modal}>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={() => dispatch(closeEditModal())}
          >
            ×
          </button>
          <div className={styles.editFormLoadingMessage}>
            No transaction to edit.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close"
          onClick={() => dispatch(closeEditModal())}
        >
          ×
        </button>

        <h2 className={`${styles.title} edit-transaction-header`}>
          Edit transaction
        </h2>

        <Formik
          initialValues={getInitialValues(editingTransaction)}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => {
            const today = new Date();
            return (
              <Form className={styles.editForm}>
                {/* Type selection */}
                <div className={styles.typeTitleGroup}>
                  <p
                    className={
                      values.type === "INCOME"
                        ? styles.incomeActive
                        : styles.typeInactive
                    }
                  >
                    Income
                  </p>
                  <span className={styles.typeSeparator}>/</span>
                  <p
                    className={
                      values.type === "EXPENSE"
                        ? styles.expenseActive
                        : styles.typeInactive
                    }
                  >
                    Expense
                  </p>
                </div>

                {/* Category select */}
                {values.type === "EXPENSE" && (
                  <div className={styles.editFormGroup}>
                    <label className="select-category-txt">
                      Select a category
                    </label>
                    <Select
                      instanceId="edit-category-select"
                      name="categoryId"
                      options={categoryOptions}
                      value={
                        values.categoryId
                          ? categoryOptions.find(
                              (o) => o.value === values.categoryId
                            ) || null
                          : null
                      }
                      onChange={(opt) =>
                        setFieldValue(
                          "categoryId",
                          opt ? String(opt.value) : ""
                        )
                      }
                      placeholder="Select a category"
                      menuPortalTarget={
                        typeof document !== "undefined" ? document.body : null
                      }
                      styles={selectStyles}
                      classNamePrefix="rs"
                    />
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className={styles.editFormError}
                    />
                  </div>
                )}

                {/* Amount and Date */}
                <div className={styles.editFormAmountDateGroup}>
                  <div className={styles.editFormGroup}>
                    <Field
                      type="text"
                      name="amount"
                      inputMode="decimal"
                      placeholder="Amount"
                      className={styles.editFormInput}
                      onKeyDown={(e) =>
                        ["-", "+", "e"].includes(e.key) && e.preventDefault()
                      }
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
                      maxDate={today}
                      placeholderText="Date"
                      className={`${styles.editFormInput} ${styles.editFormDateInput}`}
                      calendarClassName={styles.calendar}
                    />
                    {/* Calendar Icon */}
                    <svg
                      className={styles.calendarIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 16 2.5v11A1.5 1.5 0 0 1 14.5 15h-13A1.5 1.5 0 0 1 0 13.5v-11A1.5 1.5 0 0 1 1.5 1H3V.5a.5.5 0 0 1 .5-.5zM1 4v9.5a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5V4H1z" />
                    </svg>
                  </div>
                </div>

                {/* Comment with character counter */}
                <div className={styles.editFormGroup}>
                  <Field
                    as="textarea"
                    name="comment"
                    placeholder="Comment"
                    className={styles.editFormInput}
                    rows="2"
                    value={values.comment}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 30) {
                        setFieldValue("comment", val);
                      } else {
                        iziToast.show({
                          title: "Warning",
                          message: "Comment cannot exceed 30 characters",
                          position: "topRight",
                          timeout: 3000,
                          progressBar: true,
                          backgroundColor: "#FFAA33",
                          transitionIn: "fadeInRight",
                          transitionOut: "fadeOutRight",
                          layout: 2,
                          zindex: 9999,
                          maxWidth: 400,
                          padding: 20,
                        });
                      }
                    }}
                  />
                  <div className={styles.commentCounter}>
                    {values.comment.length}/30
                  </div>
                  <ErrorMessage
                    name="comment"
                    component="div"
                    className={styles.editFormError}
                  />
                </div>

                {/* Buttons */}
                <div className={styles.editFormButtonGroup}>
                  <button
                    type="submit"
                    className={`${styles.editFormSaveButton} form-button`}
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? "Saving..." : "SAVE"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.editFormCancelButton} form-button-register`}
                    onClick={() => dispatch(closeEditModal())}
                    disabled={isSubmitting || isLoading}
                  >
                    CANCEL
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditTransactionForm;
