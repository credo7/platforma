import React, { useState, useMemo, useEffect } from "react";
import moment from "Common/services/moment";

import { toast } from "Common/components/Toastify";
import Pagination, { usePagination } from "Common/components/Pagination";

import {
  useDeleteWalletsTransaction,
  useGetWalletsTransactions,
  useGetWalletsTransactionsStatuses,
  useUpdateWalletsTransaction,
} from "Wallets/apollo/WalletsTransactions";

import { useStore } from "Common/hooks/store";
import { useParams } from "react-router-dom";

const Transactions = () => {
  const { type } = useParams();

  const { store } = useStore();

  const { isAdmin, gameId, walletId, walletInfo } = store;

  const [status, setStatus] = useState("STARTED");

  const { pagination, setPagination } = usePagination();

  const { walletsTransactionsStatuses } = useGetWalletsTransactionsStatuses();

  // isAllTransactions
  const isAllTransactions = useMemo(
    () => isAdmin && type === "admin",
    [isAdmin, type]
  );

  // useGetWalletsTransactions
  const condition = useMemo(
    () => (isAllTransactions ? { status } : { status, walletId }),
    [isAllTransactions, status, walletId]
  );

  const { walletsTransactions, walletsTransactionsPageInfo } =
    useGetWalletsTransactions({
      gameId,
      condition,
      pagination,
    });

  // useUpdateWalletsTransaction
  const { updateWalletsTransaction, updatedWalletsTransaction } =
    useUpdateWalletsTransaction();

  const handleUpdate = (id, walletId) => {
    window.confirm("Вы уверены?") &&
      updateWalletsTransaction({
        walletsTransaction: { walletId, id, status: "COMPLETED" },
      });
  };

  useEffect(() => {
    updatedWalletsTransaction && toast("Оплачено");
  }, [updatedWalletsTransaction]);

  // useDeleteWalletsTransaction
  const { deleteWalletsTransaction, deletedWalletsTransaction } =
    useDeleteWalletsTransaction();

  const handleDelete = (id, walletId) => {
    window.confirm("Вы уверены?") &&
      deleteWalletsTransaction({
        walletsTransaction: { walletId, id, status },
      });
  };

  useEffect(() => {
    deletedWalletsTransaction && toast("Удалено");
  }, [deletedWalletsTransaction]);

  return (
    <div className="Wallets__wrapper">
      {isAllTransactions ? (
        <div className="Wallets__header">Все транзакции</div>
      ) : (
        <div className="Wallets__header">Транзакции</div>
      )}
      <div className="WalletsTransactions__statuses">
        {walletsTransactionsStatuses?.map((item, index) => (
          <span
            key={index}
            style={{ padding: "0 5px", color: item === status && "red" }}
            onClick={() => setStatus(item)}
          >
            {walletInfo?.trans.statuses[item]}
          </span>
        ))}
      </div>

      {!walletsTransactions?.length && <p>транзакций нет</p>}

      <div className="WalletsTransactions__content">
        <Pagination
          {...{
            pagination,
            setPagination,
            pageInfo: walletsTransactionsPageInfo,
          }}
        />

        {walletsTransactions?.map((item, index) => {
          const walletsCard = item.wallet.walletsCard?.nodes[0];

          return (
            <div
              key={index}
              id={item.id}
              className={`WalletsTransactions__transaction`}
            >
              {isAllTransactions && (
                <>
                  <div className="WalletsTransactions__username">
                    {item.wallet.user.username}
                  </div>
                  <div className="WalletsTransactions__playername">
                    {item.wallet.user.players.nodes[0]?.username}
                  </div>
                </>
              )}
              <div className="WalletsTransactions__date">
                {moment(new Date(item.createdAt)).format("DD.MM.YY HH:MM:SS")}
              </div>
              <div className="WalletsTransactions__comment">{item.comment}</div>
              <div className="WalletsTransactions__amount">
                <span>
                  {item.amount < 0 ? <>Снятие: </> : <>Пополнение: </>}
                </span>
                <span>{Math.abs(item.amount)} руб.</span>
              </div>

              {isAllTransactions && (
                <>
                  {item.amount < 0 && item.status === "STARTED" && (
                    <>
                      <div className="WalletsTransactions__card">
                        <div>
                          {
                            walletInfo?.trans?.bank[
                              walletsCard.walletBank?.name
                            ]
                          }
                          {"  "}
                          {walletInfo?.trans?.where[walletsCard.where]}
                        </div>

                        <div>{walletsCard.number}</div>
                        <div>{walletsCard.name}</div>
                      </div>

                      <div className="WalletsTransactions__comment">
                        {item.wallet.comment}
                      </div>

                      <button
                        className="Wallets__button__small"
                        onClick={() => handleUpdate(item.id, item.walletId)}
                      >
                        Подтвердить
                      </button>
                    </>
                  )}

                  <button
                    className="Wallets__button__small--error"
                    onClick={() => handleDelete(item.id, item.walletId)}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transactions;
