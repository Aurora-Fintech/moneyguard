import React from "react";

const LoginPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
