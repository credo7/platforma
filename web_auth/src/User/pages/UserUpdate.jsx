import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { classNameInput } from "Common/services/functions";

import { useStore } from "Common/hooks/store";

import { toast } from "Common/components/Toastify";
import { useUserUpdate } from "User/apollo/user/useUserUpdate";

const useUserUpdateForm = ({ field, handleUserUpdate, user }) => {
  const validationFields = useMemo(
    () =>
      field === "password"
        ? {
            value: Yup.string()
              .required("")
              .notOneOf([Yup.ref("password")], `Старый ${field}`)
              .min(7, "Введите не менее 7 символов."),
            confirm: Yup.string()
              .required("")
              .oneOf([Yup.ref("value")], `Повторите`),
          }
        : field === "email"
        ? {
            value: Yup.string().required("").email("Впишите правильную почту "),
          }
        : user && {
            value: Yup.string()
              .required("")
              .notOneOf([user[field]], `Введите новый ${field}`),
          },
    [field, user]
  );

  const formik = useFormik({
    initialValues: {
      field,
      value: "",
      password: "",
      confirm: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("")
        .min(7, "Введите не менее 7 символов."),
      ...validationFields,
    }),
    onSubmit: handleUserUpdate,
  });

  return { ...formik };
};

const UserUpdate = () => {
  const { store } = useStore();
  const { field } = useParams();
  const navigate = useNavigate();

  const { user } = store;

  const { handleUserUpdate, isUserUpdateError, isUserUpdate } = useUserUpdate({
    user,
    field,
  });

  const { handleSubmit, handleChange, values, errors } = useUserUpdateForm({
    user,
    field,
    handleUserUpdate,
  });

  useEffect(() => {
    isUserUpdate === null && toast("Текущий пароль не верный");

    isUserUpdateError("users_email") && toast(`Такой email существует`);
    isUserUpdateError("users_username") && toast(`Такой username существует`);

    isUserUpdate && toast("Данные сохранены") && navigate("/");
  }, [isUserUpdate, navigate, isUserUpdateError]);

  if (!["password", "email", "username"].includes(field)) {
    return <></>;
  }

  return (
    <form className="UserForm" onSubmit={handleSubmit} autoComplete="off">
      <h3>Поменять {field}</h3>
      <div className="UserForm__userInfo">{user && user[field]}</div>

      {/* <input onfocus="this.setAttribute('type', 'password');" type="text"> */}
      <>
        {errors?.value && <div className="Email__error">{errors.value}</div>}
        <input
          type={field === "username" ? "text" : field}
          placeholder={`Новый ${field}`}
          name="value"
          autoComplete="new-field"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={classNameInput(errors?.value, values.value)}
          onChange={handleChange}
        />
      </>

      {errors?.confirm && <div className="Email__error">{errors.confirm}</div>}
      {field === "password" && (
        <input
          type="password"
          placeholder="Повторите password"
          name="confirm"
          autoComplete="confirm-field"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={classNameInput(errors?.confirm, values.confirm)}
          onChange={handleChange}
        />
      )}

      {errors?.password && (
        <div className="Email__error">{errors.password}</div>
      )}
      <input
        type="password"
        placeholder="Текущий пароль"
        name="password"
        autoComplete="current-password"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className={classNameInput(errors?.password, values.password)}
        onChange={handleChange}
      />

      <button className="UserForm__button" type="submit">
        Сохранить
      </button>
      <Link className="BtnToMain" to={`/user`}>
        Вернуться
      </Link>
    </form>
  );
};

export default UserUpdate;
