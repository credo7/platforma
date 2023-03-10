import "./index.scss";

import React from "react";

import {
  GET_NOTIFICATIONS,
  READ_NOTIFICATION,
} from "Common/graphql/Notifications";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";

import { useMutation } from "@apollo/client";

const Notification = ({ notifications }) => {
  const { store } = useStore();

  const { userId } = store;

  const [readNotification] = useMutation(READ_NOTIFICATION, {
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { userId } },
      { query: GET_USER, variables: { userId: userId } },
    ],
  });

  const handlerReadNotification = (id) => {
    readNotification({ variables: { id } });
  };

  return (
    <>
      <h4>Уведомления</h4>
      <div className="wrapNotifiTournament">
        {notifications?.map((notification, index) => {
          return (
            <div className="notifiTournament" key={index}>
              <div className="wrapNotifiNameText">
                <div className="notifiNameTournament">{notification.title}</div>
                <div className="notifiTextTournament">
                  {notification.message}
                </div>
              </div>
              <div
                className="notifiImg"
                onClick={() => {
                  handlerReadNotification(notification.id);
                }}
              >
                <img
                  className="img-width100"
                  src={require("Common/assets/svg/Friends/Decline.svg").default}
                  alt="Прочитано"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Notification;
