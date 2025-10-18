import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoading,
  selectAuthError,
} from "../../../features/auth/authSelectors";
import { logIn } from "../../../features/auth/authOperations";
import { useId } from "react";
import { useNavigate, Link } from "react-router-dom";
import css from "./LoginForm.module.css";
import emailIcon from "../../../assets/icons/emailIcon.svg";
import passwordIcon from "../../../assets/icons/passwordIcon.svg";

// Validasyon Şeması
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("E-mail is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .required("Password is required"),
});

// Varsayılan değerler
const initialValues = { email: "", password: "" };

const LoginForm = () => {
  // Redux dispatch ve selector
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);
  const navigate = useNavigate();

  const emailFieldId = useId();
  const passwordFieldId = useId();

  // useForm Hook'u ile form yönetimi
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values) => {
    try {
      await dispatch(logIn(values)).unwrap();
      console.log("Successfully Logged in");
      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={css.authCard}>
      <form onSubmit={handleSubmit(onSubmit)} className={css.loginForm}>
        <div className={css.loginInputWrapper}>
          <label htmlFor={emailFieldId} className={css.visuallyHidden}>
            E-mail
          </label>

          <img
            src={emailIcon}
            alt="Email icon"
            className={css.loginInputIcon}
          />

          <input
            type="email"
            id={emailFieldId}
            placeholder="E-mail"
            {...register("email")}
            className={css.loginFormInput}
          />
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        </div>

        <div className={css.loginInputWrapper}>
          <label htmlFor={passwordFieldId} className={css.visuallyHidden}>
            Password
          </label>

          <img
            src={passwordIcon}
            alt="Password icon"
            className={css.loginInputIcon}
          />

          <input
            type="password"
            id={passwordFieldId}
            placeholder="Password"
            {...register("password")}
            className={css.loginFormInput}
          />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </div>

        {authError && <p style={{ color: "red" }}>{authError}</p>}
        <div className={css.loginButtonWrapper}>
          <button type="submit" className="form-button">
            {isLoading ? "Loading..." : "LOG IN"}
          </button>
          <Link to="/register">
            <button type="button" className="form-button-register">
              REGISTER
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
