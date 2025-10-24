import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  category: Yup.mixed().when("$isIncome", {
    is: false,
    then: (s) => s.required("Expense category is required."),
    otherwise: (s) => s.notRequired(),
  }),
  comment: Yup.string().max(30, "Comment cannot exceed 30 characters."),
});

const AddTransactionForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { incomeCategories, expenseCategories } = useSelector(
    (state) => state.categories
  );

  const [isIncome, setIsIncome] = useState(true);
  const datePickerRef = useRef(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const toggleSwitch = () => {
    setIsIncome((p) => !p);
  };

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

  const showCommentLimitToast = () => {
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
  };

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
            category: null,
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

              if (values.comment.length > 30) {
                showCommentLimitToast();
                setSubmitting(false);
                return;
              }

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
          {({ values, setFieldValue, touched, errors, isSubmitting }) => (
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

                <div
                  className={styles.inputGroup}
                  style={{ position: "relative" }}
                >
                  <DatePicker
                    ref={datePickerRef}
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
                  <svg
                    onClick={() => datePickerRef.current.setOpen(true)}
                    className={styles.calendarIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ cursor: "pointer" }}
                  >
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 16 2.5v11A1.5 1.5 0 0 1 14.5 15h-13A1.5 1.5 0 0 1 0 13.5v-11A1.5 1.5 0 0 1 1.5 1H3V.5a.5.5 0 0 1 .5-.5zM1 4v9.5a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5V4H1z" />
                  </svg>
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
                  value={values.comment}
                  onChange={(e) => {
                    const val = e.target.value;
                    const MAX_LENGTH = 30;

                    if (val.length <= MAX_LENGTH) {
                      setFieldValue("comment", val);
                    } else {
                      // Klavye girişini engelle
                      e.preventDefault();

                      // Toast'u garanti göstermek için küçük timeout
                      setTimeout(() => {
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
                      }, 0);
                    }
                  }}
                />
                <div className={styles.commentCounter}>
                  {values.comment.length}/30
                </div>
                {touched.comment && errors.comment && (
                  <div className={styles.errorText}>{errors.comment}</div>
                )}
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
