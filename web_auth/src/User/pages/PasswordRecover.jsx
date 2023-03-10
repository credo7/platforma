import React, { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { classNameInput } from "Common/services/functions";

import { toast } from "Common/components/Toastify";
import { useUserPasswordRecover } from "User/apollo/user/useUserPasswordRecover";

const PasswordRecover = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const credential = location.state;

  const { isPasswordRecover, handlePasswordRecover } = useUserPasswordRecover({
    credential,
  });

  const { handleChange, handleSubmit, values, errors } = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string()
        .required("")
        .min(7, "Введите не менее 7 символов"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")])
        .required(""),
    }),
    onSubmit: handlePasswordRecover,
  });

  useEffect(() => {
    isPasswordRecover && toast("Пароль сохранён") && navigate("/");
  }, [isPasswordRecover, navigate]);

  useEffect(() => {
    !credential && navigate("/");
  }, [credential, navigate]);

  return (
    <center className="UserForm">
      <h2>Поменять пароль</h2>

      <h3>{credential?.email}</h3>

      <form className="UserForm" onSubmit={handleSubmit} autoComplete="off">
        <input
          className={classNameInput(errors?.newPassword, values.newPassword)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          name="newPassword"
          type="password"
          placeholder="Новый пароль"
          onChange={handleChange}
          value={values.newPassword}
        />
        <input
          className={classNameInput(
            errors?.confirmPassword,
            values.confirmPassword
          )}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          name="confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          onChange={handleChange}
          value={values.confirmPassword}
        />

        <button className="UserForm__button" type="submit">
          Сохранить пароль
        </button>
      </form>

      <Link className="BtnToMain" to={`/user`}>
        Вернуться
      </Link>
    </center>
  );
};

export default PasswordRecover;
