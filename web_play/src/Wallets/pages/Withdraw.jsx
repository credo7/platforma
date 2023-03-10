import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useStore } from "Common/hooks/store";
import { toast } from "Common/components/Toastify";

import { useCreateWalletsTransaction } from "Wallets/apollo/WalletsTransactions";

const Withdraw = () => {
  const { store } = useStore();

  const history = useHistory();

  const { walletInfo } = store;

  const { createWalletsTransaction, createdWalletsTransactions } =
    useCreateWalletsTransaction();

  useEffect(() => {
    !walletInfo?.isWithdraw && history.push("/wallets");
  }, [walletInfo, history]);

  const handleWithdrawAll = () => {
    walletInfo?.isBalance &&
      createWalletsTransaction({
        walletsTransaction: {
          walletId: walletInfo.id,
          amount: -walletInfo?.balance,
          comment: `User withdraw all`,
          status: "STARTED",
        },
      });
  };

  useEffect(() => {
    createdWalletsTransactions && toast("Перевод добавлен в очередь");
  }, [createdWalletsTransactions]);

  return (
    <div className="Wallets__wrapper">
      <div className="Wallets__header">Снять средства</div>

      {walletInfo?.isBalance ? (
        <button
          className="Wallets__button"
          onClick={handleWithdrawAll}
          type="button"
        >
          Снять всё
        </button>
      ) : (
        <button className="Wallets__button--disabled" type="button">
          Снять всё
        </button>
      )}
    </div>
  );
};

export default Withdraw;
