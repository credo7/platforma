import classNames from "classnames";

export const classNameInput = (error, value) =>
  classNames(
    "UserForm__input",
    { "UserForm__input--alert": value && error },
    { "UserForm__input--good": value && !error }
  );

export const classNameCheckbox = (error, value) =>
  classNames(
    "UserForm__checkboxWrapper",
    { "UserForm__checkboxWrapper--alert": value && error },
    { "UserForm__checkboxWrapper--good": value && !error }
  );
