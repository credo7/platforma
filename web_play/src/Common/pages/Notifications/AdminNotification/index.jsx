import "./index.scss";

import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { CREATE_ADMIN_NOTIFICATION } from "Common/graphql/Notifications";
import { useMutation } from "@apollo/client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "Common/components/Toastify";

const AdminNotification = () => {
  const [createAdminNotification, { data: dataCreateAdminNotification }] =
    useMutation(CREATE_ADMIN_NOTIFICATION);
  const isSuccess = useMemo(
    () => dataCreateAdminNotification?.adminNotifications?.success,
    [dataCreateAdminNotification]
  );

  useEffect(() => {
    if (dataCreateAdminNotification && isSuccess) {
      toast("Уведомление отправлено");
    }
  }, [dataCreateAdminNotification, isSuccess]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Заполните поле - Заголовок"),
    message: Yup.string().required("Заполните поле - Текст сообщения"),
  });

  const initialValues = {
    title: "",
    message: "",
  };

  const onSubmit = (data) => {
    createAdminNotification({
      variables: { title: data.title, message: data.message },
    });
    resetForm();
  };

  const { handleSubmit, handleChange, values, errors, touched, resetForm } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <div className="AdminNotification">
      <form className="FormCreateAdminNotification" onSubmit={handleSubmit}>
        <input
          className="Settings__input FormCreateAdminNotification__input"
          type="text"
          name="title"
          onChange={handleChange}
          value={values.title}
          placeholder="Заголовок"
        />
        {touched.title && errors.title ? (
          <div style={{ color: "red", paddingBottom: "10px" }}>
            {errors.title}
          </div>
        ) : null}

        <textarea
          className="FormCreateAdminNotification__textarea"
          type="text"
          name="message"
          onChange={handleChange}
          value={values.message}
          placeholder="Текст сообщения"
        />
        {touched.message && errors.message ? (
          <div style={{ color: "red", paddingBottom: "10px" }}>
            {errors.message}
          </div>
        ) : null}

        <button
          className="Settings__button FormCreateAdminNotification__btnSubmit"
          type="submit"
        >
          Отправить всем уведомление
        </button>
      </form>
      <div className="AdminNotification__wrapBtnGoBack">
        <Link className="Settings__buttonGoBack commonBtn " to="/notifications">
          назад
        </Link>
      </div>
    </div>
  );
};

export default AdminNotification;
