import React from "react";
import { Link } from "react-router-dom";

import { useStore } from "Common/hooks/store";

const Home = () => {
  const { store } = useStore();

  const { isAdmin, walletInfo } = store;

  return (
    <>
      {walletInfo?.isCard ? (
        <Link to="/wallets/profile" className="Wallets__button">
          Добавить карту
        </Link>
      ) : (
        <Link to="/wallets/profile" className="Wallets__button--error">
          Добавить карту
        </Link>
      )}

      {walletInfo?.isWithdraw ? (
        <Link to="/wallets/withdraw" className="Wallets__button">
          Снять
        </Link>
      ) : (
        <div className="Wallets__button--disabled">Снять</div>
      )}

      {walletInfo?.isDeposit ? (
        <Link to="/wallets/deposit" className="Wallets__button--disabled">
          Внести
        </Link>
      ) : (
        <div className="Wallets__button--disabled">Внести</div>
      )}

      {walletInfo?.isTransaction ? (
        <Link to="/wallets/transactions" className="Wallets__button">
          История
        </Link>
      ) : (
        <div className="Wallets__button--disabled">История</div>
      )}

      {isAdmin && (
        <Link
          to="/wallets/transactions/admin"
          className="Wallets__button--error"
        >
          Все транзакции
        </Link>
      )}
    </>
  );
};

export default Home;
