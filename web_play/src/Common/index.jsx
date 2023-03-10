import "Common/styles/index.scss";

import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ScrollLock from "react-scrolllock";
import { useQuery } from "@apollo/client";

import { useStore } from "Common/hooks/store";

import Faq from "Common/components/Faq";
import Footer from "Common/components/Footer";
import Nav from "Common/components/Nav";
import SidePanel from "Common/components/SidePanel";
import Toastify from "Common/components/Toastify";
import { toast } from "Common/components/Toastify";
import EmailVerify from "Common/components/EmailVerify";
import YandexMetrika from "Common/components/YandexMetrika";

import { GET_SETTINGS } from "Common/graphql/Settings";

import { useGetAuthId, useGetAuth } from "Common/apollo/Auth";

import {
  useGetUser,
  useCreateUserFromAuth,
  useUpdateUserFromAuth,
  useUpdateUserOnline,
} from "Common/apollo/Users";

import { useWallet } from "Wallets/apollo/Wallets";

import Pages from "Common/pages";
import NavBar from "Common/components/NavBar";

// перемещение на страницу с первоначальными настройками
const useListenPath = () => {
  const { store } = useStore();
  const history = useHistory();

  const { userId, gameId, player } = store;

  const rules = useMemo(
    () => [
      { condition: userId && !gameId, path: "/games" },
      { condition: userId && gameId && !player, path: "/settings/player" },
    ],
    [userId, gameId, player]
  );

  useEffect(() => {
    let listen;

    const rule = rules.find(({ condition }) => condition);

    if (rule) {
      const changePath = () => {
        const pathname = history.location.pathname;

        rule.path !== pathname && history.push(rule.path);
      };

      changePath();
      listen = history.listen(changePath);
    }

    if (listen) {
      history.goBack();
    }

    return () => {
      listen && listen();
    };
  }, [history, rules]);
};

const useLanguage = () => {
  const { store } = useStore();
  const { user } = store;

  const [, i18n] = useTranslation();

  useEffect(() => {
    user && i18n.changeLanguage(user.language);
  }, [user, i18n]);
};

const useSettings = () => {
  const { setStore } = useStore();
  const { data } = useQuery(GET_SETTINGS);
  const settingsArray = useMemo(() => data?.node?.nodes, [data]);
  const settings = useMemo(
    () =>
      settingsArray?.reduce(
        (prev, { key, value }) => ({ ...prev, [key]: value }),
        {}
      ),
    [settingsArray]
  );

  useEffect(() => {
    settings && setStore((prev) => ({ ...prev, settings }));
  }, [settings, setStore]);
};

const useEmailVerify = () => {
  const { store } = useStore();
  const { auth } = store;

  useEffect(() => {
    auth && !auth?.emailVerified && toast(<EmailVerify />, "hand");
  }, [auth]);
};

// ! ОБЪЕДИНИТЬ получение и запись данных
// ! в обобщенные хуки apollo, пример useWallet

const Index = () => {
  const { store } = useStore();

  const { userId } = store;

  useSettings();
  useGetAuthId();
  useGetAuth();
  useGetUser();
  useCreateUserFromAuth();
  useUpdateUserFromAuth();
  useUpdateUserOnline();
  useLanguage();
  useEmailVerify();
  useListenPath();

  // modules
  useWallet({ userId });

  return (
    <div className="App-Container">
      <YandexMetrika />
      <Faq />
      <Toastify />
      <Nav />
      {/* <NavBar /> */}
      <SidePanel />
      <ScrollLock isActive={store?.lockScroll} />
      <div className="Content-wrapper">
        <Pages />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
