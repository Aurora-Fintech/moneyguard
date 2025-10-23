import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import { getCategories } from "../../../features/categories/categoriesSlice";
import { addNewTransaction } from "../../../features/transactions/transactionsSlice";

import styles from "./AddTransactionForm.module.css";

// Toast
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Doğrulama
const validationSchema = Yup.object().shape({
  sum: Yup.number()
    .typeError("The amount must be a valid number.")
    .positive("The amount must be positive.")
    .required("Amount is required."),
  date: Yup.date().required("Date is required."),
  // Category is required only for expenses
  category: Yup.mixed().when("$isIncome", {
    is: false,
    then: (s) => s.required("Expense category is required."),
    otherwise: (s) => s.notRequired(),
  }),
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

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const toggleSwitch = () => setIsIncome((p) => !p);
  const categoriesToShow = isIncome ? incomeCategories : expenseCategories;
  const options = useMemo(
    () =>
      (categoriesToShow || []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categoriesToShow]
  );

  const maxDate = new Date();

  const showSuccessToast = () =>
    iziToast.show({
      title: "Success",
      message: "Transaction added successfully",
      position: "topRight",
      timeout: 2800,
      progressBar: true,
      backgroundColor: "#4BB543",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      zindex: 9999,
    });

  const showErrorToast = (msg) =>
    iziToast.show({
      title: "Error",
      message: msg || "Transaction could not be added",
      position: "topRight",
      timeout: 3200,
      progressBar: true,
      backgroundColor: "#FF4C4C",
      transitionIn: "fadeInRight",
      transitionOut: "fadeOutRight",
      zindex: 9999,
    });

  // react-select custom styles (Global değişkenlerle)
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
    []
  );

  // overlay click – modal dışına tıklayınca kapat
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onCancel?.();
    },
    [onCancel]
  );

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          aria-label="Close"
          onClick={onCancel}
        >
          ×
        </button>

        <h2 className={`${styles.title} transaction-header`}>
          Add transaction
        </h2>

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

        <Formik
          initialValues={{
            category: null, // react-select object
            sum: "",
            date: new Date(),
            comment: "",
          }}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange={false}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              const amount = isIncome
                ? parseFloat(values.sum)
                : -Math.abs(parseFloat(values.sum));

              const categoryId = isIncome
                ? incomeCategories?.[0]?.id || null
                : values.category?.value || null;

              const payload = {
                transactionDate: values.date.toISOString(),
                amount,
                categoryId,
                type: isIncome ? "INCOME" : "EXPENSE",
                comment: values.comment || "",
              };

              await dispatch(addNewTransaction(payload)).unwrap();
              showSuccessToast();
              resetForm();
              onCancel?.();
            } catch (err) {
              console.error(err);
              showErrorToast(err?.message);
            } finally {
              setSubmitting(false);
            }
          }}
          context={{ isIncome }}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className={styles.form}>
              {!isIncome && (
                <div className={styles.inputGroup}>
                  <Select
                    instanceId="category-select"
                    name="category"
                    options={options}
                    value={values.category}
                    onChange={(opt) => setFieldValue("category", opt)}
                    placeholder="Select a category"
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    styles={selectStyles}
                    classNamePrefix="rs"
                  />
                  {errors.category && (
                    <div className={styles.errorText}>{errors.category}</div>
                  )}
                </div>
              )}

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <Field
                    name="sum"
                    type="text"
                    inputMode="decimal"
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
                    dateFormat="dd.MM.yyyy"
                    maxDate={maxDate}
                    filterDate={(d) => d <= maxDate}
                    className={`${styles.input} ${
                      touched.date && errors.date ? styles.inputError : ""
                    }`}
                    calendarClassName={styles.calendar}
                  />
                  {touched.date && errors.date && (
                    <div className={styles.errorText}>{errors.date}</div>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <Field
                  as="textarea"
                  name="comment"
                  placeholder="Comment"
                  className={styles.textarea}
                  rows="2"
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className={`${styles.submitBtn} form-button`}
                  disabled={isSubmitting}
                >
                  ADD
                </button>
                <button
                  type="button"
                  className={`${styles.cancelBtn} form-button-register`}
                  onClick={onCancel}
                >
                  CANCEL
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddTransactionForm;
