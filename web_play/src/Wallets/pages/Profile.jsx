import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import classNames from "classnames";

import { useStore } from "Common/hooks/store";

import {
  useGetWalletsCardsWhere,
  useWalletsCard,
} from "Wallets/apollo/WalletsCards";
import { toast } from "Common/components/Toastify";
import { useGetWalletsBanks } from "Wallets/apollo/WalletsBanks";

const Profile = () => {
  const { store, setStore } = useStore();

  const { wallet, walletInfo } = store;

  // useGetWalletsBanks
  const { walletsBanks } = useGetWalletsBanks();

  // useGetWalletsCardsWhere
  const { walletsCardsWhere } = useGetWalletsCardsWhere();

  // useWalletsCard
  const {
    walletsCard,
    mergeWalletsCard,
    mergedWalletsCard,
    removeWalletsCard,
    removedWalletsCard,
  } = useWalletsCard({
    walletId: wallet?.id,
  });

  // handleMerge
  const handleMerge = (newWalletsCard) => {
    wallet &&
      newWalletsCard !== walletsCard &&
      mergeWalletsCard({
        walletsCard: { walletId: wallet.id, ...newWalletsCard },
      });
  };

  useEffect(() => {
    mergedWalletsCard && toast("Карта сохранена");
  }, [mergedWalletsCard]);

  // useFormik
  const { handleSubmit, handleChange, values, setValues, errors, resetForm } =
    useFormik({
      initialValues: {
        bankId: "",
        where: "",
        number: "",
        name: "",
      },
      validationSchema: Yup.object().shape({
        bankId: Yup.string()
          .required("Выберите банк")
          .uuid("Ошибка данных банка"),
        where: Yup.string().required("Выберите куда"),
        number: Yup.string()
          .required("Введите номер")
          .matches(/^[0-9]+$/, "Только цифры")
          .min(10, "Минимально 10 цифр")
          .max(20, "Максимально 20 цифр"),
        name: Yup.string().required("Введите имя"),
      }),
      onSubmit: handleMerge,
    });

  useEffect(() => {
    walletsCard &&
      setValues(walletsCard) &&
      setStore((prev) => ({ ...prev, walletsCard }));
  }, [walletsCard, setValues, setStore]);

  // handleRemove
  const handleRemove = () => {
    window.confirm("Вы уверены?") &&
      removeWalletsCard({ walletsCard }) &&
      resetForm();
  };

  useEffect(() => {
    removedWalletsCard && toast("Карта удалена");
  }, [removedWalletsCard]);

  // isSubmit
  const isSubmit = !Object.keys(errors).length && values !== walletsCard;

  // return
  return (
    <div className="Wallets__wrapper">
      <div className="Wallets__header">Добавить карту</div>

      <form className="Wallets__form" onSubmit={handleSubmit}>
        <select
          className={classNames({
            Wallets__input: true,
            "Wallets__input--error": errors?.bankId,
          })}
          name="bankId"
          placeholder="Банк"
          value={values.bankId}
          onChange={handleChange}
        >
          <option value="">Банк</option>
          {walletsBanks?.map(({ id, name }, index) => (
            <option key={index} value={id}>
              {walletInfo?.trans.bank[name] || name}
            </option>
          ))}
        </select>

        <select
          className={classNames({
            Wallets__input: true,
            "Wallets__input--error": errors?.where,
          })}
          name="where"
          value={values.where}
          onChange={handleChange}
        >
          <option value="">Куда</option>
          {walletsCardsWhere?.map((name, index) => (
            <option key={index} value={name}>
              {walletInfo?.trans?.where[name] || name}
            </option>
          ))}
        </select>

        <input
          className={classNames({
            Wallets__input: true,
            "Wallets__input--error": errors?.number,
          })}
          name="number"
          type="number"
          placeholder="Номер"
          value={values.number}
          onChange={handleChange}
        />

        <input
          className={classNames({
            Wallets__input: true,
            "Wallets__input--error": errors?.name,
          })}
          name="name"
          type="text"
          placeholder="Имя"
          value={values.name}
          onChange={handleChange}
        />

        {isSubmit ? (
          <button className="Wallets__button" type="submit">
            Сохранить
          </button>
        ) : (
          <button className="Wallets__button--disabled" type="button">
            Сохранить
          </button>
        )}

        {walletsCard && (
          <button
            className="Wallets__button--error"
            type="button"
            onClick={handleRemove}
          >
            Удалить
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
