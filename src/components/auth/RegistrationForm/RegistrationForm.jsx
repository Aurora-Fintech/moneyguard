import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoading,
  selectAuthError,
} from "../../../features/auth/authSelectors";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "şifreler eşleşmelidir")
    .required("şifre tekrarı zorunludur"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);

  const nameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();
  const confirmPasswordFieldId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = values;
    try {
      await dispatch(register(values)).unwrap();
      reset();
    } catch (error) {
      const errorMessage =
        error.message || "An error occured. Please try again.";

      if (errorMessage.includes("E-mail in use")) {
        console.error("This email is already registered.");
      } else {
        console.error(`${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor={nameFieldId}>Name</label>
        <input type="text" id={nameFieldId} {...register("name")} />
        <p style={{ color: "red" }}>{errors.name?.message}</p>
      </div>
      <p style={{ color: "red" }}>{errors.email?.message}</p>

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

      <div>
        <label htmlFor={confirmPasswordFieldId}>Confirm password</label>
        <input type="password" id={confirmPasswordFieldId} />
      </div>

      {authError && <p style={{ color: "red" }}>{authError}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};

export default RegistrationForm;
