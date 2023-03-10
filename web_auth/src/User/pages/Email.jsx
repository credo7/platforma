import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import Countdown from "react-countdown";

import { classNameInput } from "Common/services/functions";

import { toast } from "Common/components/Toastify";

import { useStore } from "Common/hooks/store";
import { useUserEmailCode } from "User/apollo/user/useUserEmailCode";
import { useUserEmailVerify } from "User/apollo/user/useUserEmailVerify";

const CODE_COUNTDOWN = 60; // сек
const EMAIL_SEND_TEST = false;

const useUserForm = ({ user, isAuth, onSubmit, setCredential }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required(""),
      code: Yup.string(),
    }),
    onSubmit,
  });

  const { values, setValues } = formik;

  useEffect(() => {
    if (user) {
      isAuth && user.emailVerified && navigate("/");
      isAuth && setValues((prev) => ({ ...prev, email: user.email }));
    }
  }, [user, isAuth, setValues, navigate]);

  useEffect(() => {
    setCredential(values);
  }, [values, setCredential]);

  return { ...formik };
};

const EmailCountdown = () => {
  const { setStore } = useStore();

  return (
    <Countdown
      date={new Date(Date.now() + CODE_COUNTDOWN * 1000)}
      renderer={({ seconds }) =>
        seconds ? <span>Повторно через {seconds} сек.</span> : <></>
      }
      onComplete={() => {
        setStore((prev) => ({ ...prev, emailSended: false }));
      }}
    />
  );
};

const Email = () => {
  const { store } = useStore();
  const { user, isAuth } = store;

  const navigate = useNavigate();
  const [credential, setCredential] = useState();

  // useUserEmailCode
  const { loading, emailVerify, emailSended, handleEmailCode } =
    useUserEmailCode();

  // useUserEmailVerify
  const { handleEmailVerify, emailVerified } = useUserEmailVerify();

  const onSubmit = (data) => {
    !emailSended && handleEmailCode({ ...data, test: EMAIL_SEND_TEST });
    emailSended && handleEmailVerify({ isAuth, user, data });
  };

  // useUserForm
  const { handleSubmit, handleChange, values, errors } = useUserForm({
    isAuth,
    user,
    onSubmit,
    setCredential,
  });

  // effects
  useEffect(() => {
    emailVerify === null && toast("Почта не существует");
  }, [emailVerify]);

  useEffect(() => {
    emailVerified === false && toast("Код не подходит");
    emailVerified &&
      !isAuth &&
      navigate(`/user/recover`, { state: { ...credential } });
  }, [emailVerified, isAuth, navigate, credential]);

  return (
    <center className="UserForm">
      <h3>Подтверждение почты</h3>

      <form className="UserForm" onSubmit={handleSubmit}>
        <div>
          <input
            name="email"
            className={classNames(classNameInput(errors?.email, values.email), {
              "UserForm__input--disable": emailSended,
            })}
            autoComplete="on"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Почта"
            type="email"
            disabled={isAuth || emailSended}
            onChange={handleChange}
            value={values.email}
          />
        </div>

        <div>{emailVerify?.emailCode}</div>

        <div>
          <input
            name="code"
            className={classNames(classNameInput(errors?.code, values.code), {
              "UserForm__input--disable": !emailSended,
            })}
            autoComplete="on"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Код"
            type="text"
            disabled={!emailVerify}
            onChange={handleChange}
            value={values.code}
          />
        </div>

        <div>
          {!loading && emailVerify?.success && <>Код отправлен</>}
          {!loading && emailVerify && !emailVerify?.success && (
            <>Ошибка отправки</>
          )}
          {loading && <>Идет отправка...</>}
        </div>

        <div>{!isAuth && emailSended && <EmailCountdown />}</div>

        <div>
          {!emailSended && (
            <button className="UserForm__button" type="submit">
              Отправить
            </button>
          )}
        </div>

        <div>
          {emailSended && (
            <button className="UserForm__button" type="submit">
              Подтвердить
            </button>
          )}
        </div>

        {!isAuth && (
          <>
            <div className="UserForm__forLogin">
              <p>У вас уже есть аккаунт?</p>
              <Link to={`/user/login`}>Войти</Link>
            </div>

            <div className="UserForm__forLogin--widerX2">
              <p>У вас еще нет аккаунта?</p>
              <Link to={`/user/register`}>Зарегистрироваться</Link>
            </div>
          </>
        )}

        {isAuth && (
          <Link className="BtnToMain" to={`/user`}>
            Вернуться
          </Link>
        )}
      </form>
    </center>
  );
};

export default Email;
