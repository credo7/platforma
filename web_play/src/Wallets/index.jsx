import "Wallets/styles/index.scss";
import { Link, useLocation, useRouteMatch } from "react-router-dom";

import React, { useEffect } from "react";

import { useStore } from "Common/hooks/store";

import Pages from "Wallets/pages";
import { useWallet } from "Wallets/apollo/Wallets";

const useWalletInfo = () => {
  const { store, setStore } = useStore();

  const { userId } = store;

  const { wallet, walletInfo } = useWallet({ userId });

  useEffect(() => {
    wallet && setStore((prev) => ({ ...prev, wallet, walletId: wallet.id }));
  }, [wallet, setStore]);

  useEffect(() => {
    if (walletInfo) {
      let info = walletInfo;

      info = {
        ...info,
        balance: info?.walletsTransaction?.balance.sum.amount || 0,
      };

      info = {
        ...info,
        balance: info.balance,
        isBalance: info.balance > 0,
        isCard: info?.walletsCard.totalCount > 0,
        isTransaction: info?.walletsTransaction.totalCount > 0,
      };

      info = {
        ...info,
        isDeposit: info.isCard,
        isWithdraw: info.isCard && info.isBalance,
      };

      info = {
        ...info,
        trans: {
          statuses: {
            STARTED: "ОЖИДАЮЩИЕ",
            COMPLETED: "ВЫПОЛНЕНЫ",
          },
          bank: {
            Sber: "Сбербанк",
            Tinkoff: "Тинькофф",
            Qiwi: "Киви",
          },
          where: {
            PHONE: "Телефон",
            CARD: "Карта",
          },
        },
      };

      setStore((prev) => ({ ...prev, walletInfo: info }));
    }
  }, [walletInfo, setStore]);
};

const Index = () => {
  const { store } = useStore();

  const { walletInfo } = store;

  const { pathname } = useLocation();
  const { path } = useRouteMatch();

  useWalletInfo();

  return (
    <div className="Wallets__wrapper">
      {/* <div className="Wallets__header">КОШЕЛЁК</div> */}

      <div className="Wallets__content">
        <div className="Wallets__balance">
          <p className="Wallets__text">Баланс:</p>
          <p className="Wallets__text--red">{walletInfo?.balance}</p>
          <p className="Wallets__text">руб.</p>
        </div>
      </div>

      <div className="Wallets__content">
        <Pages />

        {pathname !== path && (
          <Link to="/wallets" className="Wallets__button__outline">
            Назад
          </Link>
        )}
      </div>
    </div>
  );
};

export default Index;
