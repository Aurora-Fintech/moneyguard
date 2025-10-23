import React, { useState } from "react";
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
import logoIcon from "../../../assets/icons/moneyGuardLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "../FormInput/FormInput";
import clsx from "clsx";

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

      reset();
      navigate("/dashboard");
    } catch {
      // Hata yönetimi Redux state'i (authError) tarafından yapılıyor.
      // Bu catch bloğu, .unwrap() fırlattığında uygulamanın çökmesini engeller.
    }
  };

  // Şifre gösterme/gizleme
  const [showPassword, setShowPassword] = useState(false);

  // Blurlar için
  //  Lg => Large
  // Sm => Small
  // Rg => Right
  // Lt => Left
  // Tp => Top
  // Bt => Bottom
  return (
    <div className={css.loginBackground}>
      <div
        className={clsx(css.loginFormBlurLgRgBt, css.backgroundBlurCommon)}
      ></div>
      <div
        className={clsx(css.loginFormBlurSmRg, css.backgroundBlurCommon)}
      ></div>
      <div
        className={clsx(css.loginFormBlurSmBt, css.backgroundBlurCommon)}
      ></div>
      <div
        className={clsx(css.loginFormBlurLgLtTp, css.backgroundBlurCommon)}
      ></div>
      <div
        className={clsx(css.loginFormBlurSmLtTp, css.backgroundBlurCommon)}
      ></div>
      <div className={css.loginFormBlurCenter}></div>

      <div className={css.authCard}>
        <img
          src={logoIcon}
          alt="Money Guard icon"
          className={css.loginLogoIcon}
        />
        <h2 className={css.loginFormTitle}>Money Guard</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={css.loginForm}>
          <FormInput
            id={emailFieldId}
            label="E-mail"
            icon={emailIcon}
            type="email"
            placeholder="E-mail"
            register={register("email")}
            error={errors.email?.message}
          />

          <div className={css.loginInputContainer}>
            <FormInput
              id={passwordFieldId}
              label="Password"
              icon={passwordIcon}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              register={register("password")}
              error={errors.password?.message}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={css.showPasswordButton}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {authError && <p className={css.authErrorMessage}>{authError}</p>}
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
    </div>
  );
};

export default LoginForm;
