import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoading,
  selectAuthError,
} from "../../../features/auth/authSelectors";
import { register as registerUser } from "../../../features/auth/authOperations";
import { Link } from "react-router-dom";
import css from "./RegistrationForm.module.css";
import emailIcon from "../../../assets/icons/emailIcon.svg";
import passwordIcon from "../../../assets/icons/passwordIcon.svg";
import logoIcon from "../../../assets/icons/moneyGuardLogo.svg";
import nameIcon from "../../../assets/icons/nameIcon.svg";
import PasswordStrengthBar from "react-password-strength-bar";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "../FormInput/FormInput";
import clsx from "clsx";
import { clearAuthError } from "../../../features/auth/authSlice";

// Validasyon Şeması
const registerSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Password repetition is mandatory"),
});

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);

  const usernameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const confirmPasswordFieldId = useId();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  // Progress Bar için şifre izleme
  const [passwordValue, confirmPasswordValue] = watch([
    "password",
    "confirmPassword",
  ]);

  // Match Bar
  const { matchPercentage, barColor } = useMemo(() => {
    let matchCount = 0;
    const targetLength = passwordValue.length;
    const currentLength = confirmPasswordValue.length;

    // Confirm passwordun her karakterini asıl şifre ile karşılaştıren döngü
    for (let i = 0; i < currentLength; i++) {
      if (i < targetLength && passwordValue[i] === confirmPasswordValue[i]) {
        matchCount++;
      } else {
        break;
      }
    }

    // Yüzdeyi hesaplama
    const percentage = targetLength > 0 ? (matchCount / targetLength) * 100 : 0;
    const finalPercentage = Math.min(percentage, 100);

    // İlerlemeye göre renk belirleme
    let color = "#e0e0e0";
    if (finalPercentage === 100 && currentLength === targetLength) {
      color = "#25c281";
    } else if (finalPercentage > 50) {
      color = "#f6b44d";
    } else if (finalPercentage > 0) {
      color = "#ff8a80";
    }

    return { matchPercentage: finalPercentage, barColor: color };
  }, [passwordValue, confirmPasswordValue]);

  // Hata state'ini temizle
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (values) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = values;
    try {
      await dispatch(registerUser(userData)).unwrap();
      reset();
    } catch {
      // Hata yönetimi Redux thunk (registerUser operasyonu)
      // ve Redux state (authError) tarafından yapılıyor.
      // Bu catch bloğu, .unwrap() tarafından fırlatılan hatayı
      // yakalayarak uygulamanın çökmesini engellemek için gereklidir.
    }
  };

  // Şifre gösterme/gizleme
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Blurlar için
  //  Lg => Large
  // Sm => Small
  // Rg => Right
  // Lt => Left
  // Tp => Top
  // Bt => Bottom
  return (
    <>
      <div
        className={clsx(css.registerFormBlurSmRgTp, css.backgroundBlurCommon)}
      ></div>
      <div className={css.registerBackground}>
        <div
          className={clsx(css.registerFormBlurLgRgTp, css.backgroundBlurCommon)}
        ></div>
        <div
          className={clsx(css.registerFormBlurCenter, css.backgroundBlurCommon)}
        ></div>
        <div
          className={clsx(css.registerFormBlurLgTp, css.backgroundBlurCommon)}
        ></div>
        <div
          className={clsx(css.registerFormBlurSmLtTp, css.backgroundBlurCommon)}
        ></div>
        <div
          className={clsx(css.registerFormBlurLgBt, css.backgroundBlurCommon)}
        ></div>
        <div
          className={clsx(css.registerFormBlurSmLtBt, css.backgroundBlurCommon)}
        ></div>
        <div className={css.authCard}>
          <img
            src={logoIcon}
            alt="Money Guard icon"
            className={css.registerLogoIcon}
          />
          <h2 className={css.registerFormTitle}>Money Guard</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={css.registerForm}>
            {/* INPUT BAŞLANGIÇ */}

            <FormInput
              id={usernameFieldId}
              label="Username"
              icon={nameIcon}
              type="text"
              placeholder="Username"
              register={register("username")}
              error={errors.username?.message}
            />

            <FormInput
              id={emailFieldId}
              label="E-mail"
              icon={emailIcon}
              type="email"
              placeholder="E-mail"
              register={register("email")}
              error={errors.email?.message}
            />

            <div className={css.registerInputWrapper}>
              <div className={css.registerInputContainer}>
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
              <PasswordStrengthBar password={passwordValue} minLength={6} />
            </div>

            <div className={css.registerInputWrapper}>
              <div className={css.registerInputContainer}>
                <FormInput
                  id={confirmPasswordFieldId}
                  label="Confirm Password"
                  icon={passwordIcon}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  register={register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={css.showPasswordButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {confirmPasswordValue && (
                <div className={css.matchBarContainer}>
                  {" "}
                  <div className={css.matchBarBackground}>
                    {" "}
                    <div
                      className={css.matchBarFill}
                      style={{
                        width: `${matchPercentage}%`,
                        backgroundColor: barColor,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* INPUT SON */}

            {authError && <p className={css.authErrorMessage}>{authError}</p>}
            <div className={css.registerButtonWrapper}>
              <button
                type="submit"
                disabled={isLoading}
                className="form-button"
              >
                {isLoading ? "Loading..." : "REGISTER"}
              </button>
              <Link to="/login">
                <button type="button" className="form-button-register">
                  LOG IN
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
