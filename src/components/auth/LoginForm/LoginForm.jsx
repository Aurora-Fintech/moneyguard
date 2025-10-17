import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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

const LoginForm = () => {
  // useForm Hook'u ile form yönetimi
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted", data);
    // redux mantığı gelecek
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" {...register("email")} />
        <p style={{ color: "red" }}>{errors.email?.message}</p>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register("password")} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
