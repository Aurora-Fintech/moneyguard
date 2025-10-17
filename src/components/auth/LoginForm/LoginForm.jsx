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
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor={emailFieldId}>E-mail</label>
        <input type="email" id={emailFieldId} {...register("email")} />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>

      <div>
        <label htmlFor={passwordFieldId}>Password</label>
        <input type="password" id={passwordFieldId} {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>

      {authError && <p style={{ color: "red" }}>{authError}</p>}

      <button type="submit">{isLoading ? "Loading..." : "Log In"}</button>
    </form>
  );
};

export default LoginForm;
