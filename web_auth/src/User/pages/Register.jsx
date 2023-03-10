import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "Common/components/Toastify";
import { classNameInput, classNameCheckbox } from "Common/services/functions";
import { useUserRegister } from "User/apollo/user/useUserRegister";

// ! ПЕРЕДЕЛАТЬ ФУНКЦИОНАЛ ФОРМЫ
// Register
const Register = () => {
  const navigate = useNavigate();

  const { handleRegister, isRegister, isRegisterError } = useUserRegister();

  // formik
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgree: false,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Обязательно"),
      email: Yup.string().required("Обязательно").email("Впишите верный адрес"),
      password: Yup.string()
        .required("Обязательно")
        .min(7, "Введите не менее 8 символов"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")])
        .required("Подтвердите пароль"),
      isAgree: Yup.boolean().oneOf(
        [true],
        "Подтвердите пользователькое соглашение"
      ),
    }),
    onSubmit: handleRegister,
  });

  // after userRegister
  useEffect(() => {
    isRegister === null && toast("Ошибка регистрации");

    isRegisterError("users_username") && toast(`Имя пользователя занят`);
    isRegisterError("users_email") && toast(`Почта занята`);

    isRegister && navigate("/user/login");
  }, [isRegister, navigate, isRegisterError]);

  // return
  return (
    <>
      <h3 style={{ textAlign: "center" }}>Регистрация</h3>
      <form className="UserForm" onSubmit={handleSubmit}>
        <div>
          <input
            name="username"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={classNameInput(errors?.username, values.username)}
            placeholder="Имя"
            onChange={handleChange}
            value={values.username}
          />
          {errors?.username && (
            <div className="UserForm-helper-text">{errors.username}</div>
          )}
        </div>

        <div>
          <input
            name="email"
            type="email"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={classNameInput(errors?.email, values.email)}
            placeholder="Почта"
            onChange={handleChange}
            value={values.email}
          />
          {errors?.email && (
            <div className="UserForm-helper-text">{errors?.email}</div>
          )}
        </div>

        <div>
          <input
            name="password"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={classNameInput(errors?.password, values.password)}
            type="password"
            placeholder="Пароль"
            onChange={handleChange}
            value={values.password}
          />
          {errors?.password && (
            <div className="UserForm-helper-text">{errors.password}</div>
          )}
        </div>

        <div>
          <input
            name="confirmPassword"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={classNameInput(
              errors?.confirmPassword,
              values.confirmPassword
            )}
            type="password"
            placeholder="Подтверждение пароля"
            onChange={handleChange}
            value={values.confirmPassword}
          />
          {errors?.password && (
            <div className="UserForm-helper-text">{errors.password}</div>
          )}
        </div>

        <label className={classNameCheckbox(errors?.isAgree, values.isAgree)}>
          <input
            name="isAgree"
            className="UserForm__checkbox"
            type="checkbox"
            onChange={handleChange}
            value={values.isAgree}
            checked={values.isAgree}
          />
          <p className="Settings__label--chackbox">
            <span id="termChackbox" className="Text-12px-400">
              Я прочитал и согласен с условиями
              <br />
              <Link to="/user/terms" className="UserForm__terms">
                пользовательского соглашения
              </Link>
            </span>
          </p>
        </label>

        <button className="UserForm__button" type="submit">
          Регистрация
        </button>

        <div className="UserForm__forLogin">
          <p>У вас уже есть аккаунт?</p>
          <Link to="/user/login">Войти</Link>
        </div>
      </form>
    </>
  );
};

export default Register;
