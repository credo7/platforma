import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { classNameInput } from "Common/services/functions";
import history from "Common/services/history";
import { useUserLogin } from "User/apollo/user/useUserLogin";
import { useUserLoginAttemts } from "User/apollo/user/useUserLoginAttemts";
import classNames from "classnames";

const { REACT_APP_PLAY_URL } = process.env;

const useUserForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(""),
      password: Yup.string().required("").min(3, "Введите не менее 3 символов"),
    }),
    onSubmit,
  });

  return { ...formik };
};

const LOGIN_ATTEMTS = 5;

const Login = () => {
  const { handleLogin, userToken } = useUserLogin();
  const { handleLoginAttemts, loginAttemt } = useUserLoginAttemts();

  const loginAttemted = useMemo(
    () => loginAttemt && loginAttemt?.attemts > LOGIN_ATTEMTS,
    [loginAttemt]
  );

  const onSubmit = (data) => {
    handleLoginAttemts({ email: values.email });

    !loginAttemted && handleLogin(data);
  };

  const { handleSubmit, handleChange, values, errors } = useUserForm({
    onSubmit,
  });

  useEffect(() => {
    userToken && history.push(REACT_APP_PLAY_URL);
  }, [userToken]);

  return (
    <>
      <h3 style={{ textAlign: "center" }}>Вход в аккаунт</h3>

      <form className="UserForm" onSubmit={handleSubmit}>
        <input
          name="email"
          className={classNameInput(errors?.email, values.email)}
          autoComplete="on"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          placeholder="Почта или Имя"
          type="text"
          onChange={handleChange}
          value={values.email}
        />

        <input
          name="password"
          className={classNameInput(errors?.password, values.password)}
          autoComplete="on"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          type="password"
          placeholder="Пароль"
          onChange={handleChange}
          value={values.password}
        />

        <div className="UserForm__forLogin--wider">
          <Link to="/user/email">Забыли пароль?</Link>
        </div>

        <div>
          {userToken === null && <>Пользователь ненайден</>}
          <br />
          {!userToken && loginAttemted && <>Слишком много попыток</>}
        </div>

        {!userToken && (
          <button
            className={classNames("UserForm__button", {
              "UserForm__button--disable": loginAttemted,
            })}
            type="submit"
          >
            Войти
          </button>
        )}

        <div className="UserForm__forLogin--widerX2">
          <p>У вас еще нет аккаунта?</p>
          <Link to="/user/register">Зарегистрироваться</Link>
        </div>
      </form>
    </>
  );
};

export default Login;
