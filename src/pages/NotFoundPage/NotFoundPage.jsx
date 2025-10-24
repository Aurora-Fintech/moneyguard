import React from "react";
import { Link } from "react-router-dom";
import css from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <div className={css.notFoundContainer}>
      <h1 className={css.notFoundErrorCode}>404</h1>
      <p className={css.notFoundErrorMessage}>Oops! Page Not Found.</p>
      <p className={css.notFoundErrorDescription}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/login" className={`form-button ${css.notFoundGoBackButton}`}>
        Go Back to Login
      </Link>
    </div>
  );
};

export default NotFoundPage;
