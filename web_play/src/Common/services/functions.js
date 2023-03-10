export const classNameInput = (err, value) =>
  err && value
    ? "AuthForm__input--alert"
    : !err && value
    ? "AuthForm__input--good"
    : "AuthForm__input";

export const classNameCheckbox = (err, value) =>
  err || !value
    ? "AuthForm__checkboxWrapper--alert"
    : !err && value
    ? "AuthForm__checkboxWrapper--good"
    : "AuthForm__checkboxWrapper";

export const fieldCheckV2 = (Length, isError) =>
  Length > 0
    ? isError
      ? "AuthForm__input--alert"
      : "AuthForm__input--good"
    : "AuthForm__input";

export const handlerMenu = () => {
  const sidePanel = document.querySelector(".SidePanel");
  const blockField = document.querySelector(".BlockField");
  const body = document.querySelector("body");
  sidePanel.classList.toggle("active");
  blockField.classList.toggle("active");
  body.classList.toggle("blocked");
};

export const setActiveToClass = (location, className) => {
  let selectors = document.querySelectorAll(className);

  [...selectors]?.map((sel) => {
    let url = new URL(sel.href);
    if (location?.pathname.indexOf(url?.pathname) !== -1) {
      sel.classList.add("active");
    } else {
      sel.classList.remove("active");
    }
    return sel;
  });
};

export const storage = (path, size) =>
  `${process.env.REACT_APP_STORAGE}/${path}${size ? `/${size}` : ""}`;
