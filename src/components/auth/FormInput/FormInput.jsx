import css from "./FormInput.module.css";

const FormInput = ({ id, label, icon, type, placeholder, register, error }) => (
  <div className={css.InputWrapper}>
    <div className={css.inputContainer}>
      <label htmlFor={id} className={css.visuallyHidden}>
        {label}
      </label>
      <img src={icon} alt={label} className={css.inputIcon} />
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...register}
        className={css.formInput}
      />
    </div>
    {error && <p className={css.authErrorMessage}>{error}</p>}
  </div>
);

export default FormInput;
