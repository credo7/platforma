import "./index.scss";

import React from "react";

import { GET_NOTIFICATIONS } from "Common/graphql/Notifications";
import { READ_NOTIFICATION_TOURNAMENT } from "Common/graphql/NotificationsTournament";
import { GET_USER } from "Common/graphql/Users";
import { useStore } from "Common/hooks/store";
import { useHistory } from "react-router-dom";

import { useMutation } from "@apollo/client";

const NotificationsTournaments = ({ notificationsTournaments }) => {
  const { store } = useStore();

  const history = useHistory();

  const { userId } = store;

  const [readNotificationTournament] = useMutation(
    READ_NOTIFICATION_TOURNAMENT,
    {
      refetchQueries: [
        { query: GET_NOTIFICATIONS, variables: { userId } },
        { query: GET_USER, variables: { userId: userId } },
      ],
    }
  );

  const pushNotification = (tournament) => {
    if (tournament.id) {
      const tabName = tournament.status === "LIVE" ? "lobby" : "about";
      history.push(`/tournament/${tournament.id}/${tabName}`);
    }
  };

  const handlerReadNotification = (id) => {
    readNotificationTournament({ variables: { id } });
  };

  return (
    <>
      <h4>Уведомления турниров</h4>
      <div className="wrapNotifiTournament">
        {notificationsTournaments?.map((notification, index) => {
          return (
            <div className="notifiTournament" key={index}>
              <div
                className="wrapNotifiNameText"
                onClick={() => {
                  pushNotification(notification.tournament);
                }}
              >
                <div className="notifiNameTournament">
                  {notification.tournament.name}
                </div>
                <div className="notifiTextTournament">
                  {notification.tournament.status === "REGISTRATION" &&
                    "Регистрация открыта"}
                  {notification.tournament.status === "CONFIRMATION" &&
                    "Открыт вход в лобби"}
                  {notification.tournament.status === "LIVE" &&
                    "Турнир начался"}
                  {notification.tournament.status === "FINISHED" &&
                    "Турнир завершился"}
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

export default NotificationsTournaments;
