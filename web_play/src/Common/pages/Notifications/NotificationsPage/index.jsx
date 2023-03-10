import "./index.scss";

import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { GET_NOTIFICATIONS } from "Common/graphql/Notifications";
import { useStore } from "Common/hooks/store";
import FriendsInvites from "Common/pages/Notifications/FriendsInvites";
import Notification from "Common/pages/Notifications/Notifications";
import NotificationsTournaments from "Common/pages/Notifications/NotificationsTournaments";
import TeamsInvites from "Common/pages/Notifications/TeamsInvites";

const NotificationPage = () => {
  const { store } = useStore();

  const { userId, isAdmin } = store;

  const [getNotifications, { data: dataNotifications }] =
    useLazyQuery(GET_NOTIFICATIONS);

  useEffect(() => {
    if (userId) {
      getNotifications({ variables: { userId } });
    }
  }, [userId, getNotifications]);

  const notifications = dataNotifications?.allNotifications.nodes;
  const notificationsTournaments =
    dataNotifications?.allNotificationsTournaments.nodes;

  return (
    <div className="Notifi">
      {isAdmin && (
        <h4>
          <Link
            to="/admin/notifications"
            className="Settings__button btnAdminNotification"
          >
            Отправить всем уведомление
          </Link>
        </h4>
      )}

      <div className="Notifi__container onlyNotification_Chat__container">
        <br />
        <div className="Notifi__conversation onlyNotification_Chat__conversation">
          <FriendsInvites />

          <TeamsInvites />

          <Notification notifications={notifications} />

          <NotificationsTournaments
            notificationsTournaments={notificationsTournaments}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
