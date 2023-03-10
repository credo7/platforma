import "./index.scss";

import React, { useEffect, useMemo, useState } from "react";

import ProfileIconImg from "Common/assets/png/ProfileIcon.png";
import ChatHistoryCard from "Common/components/ChatHistoryCard";
import Search from "Common/components/Search";
import {
  GET_CHAT_ROOMS_BY_USER,
  SUB_CHAT_ROOMS_BY_USER,
} from "Common/graphql/ChatRooms";
import { useStore } from "Common/hooks/store";
import { Link } from "react-router-dom";

import { useLazyQuery } from "@apollo/client";

import { storage } from "Common/services/functions";

const ChatRoomsPage = () => {
  /* заглушка  */
  // return <div className="Chats__MainMessage">Чат находится в разработке</div>;

  const { store } = useStore();

  const { userId } = store;

  const [search, setSearch] = useState("");

  const [getChatRooms, { data: dataChatRooms, subscribeToMore: subChatRooms }] =
    useLazyQuery(GET_CHAT_ROOMS_BY_USER);
  const chatRooms = useMemo(
    () =>
      dataChatRooms?.chatRooms?.nodes?.map((item) => ({
        ...item,
        usernames: item?.chatRoomsUsers?.nodes
          ?.map((roomUser) => roomUser?.user?.username)
          ?.join(" | "),
        roomUser: item?.chatRoomsUsers?.nodes?.find(
          (roomUser) => roomUser?.userId === userId
        ),
      })),
    [dataChatRooms, userId]
  );
  const chatRoomsFilter = useMemo(
    () =>
      search
        ? chatRooms?.filter(({ usernames }) => usernames.indexOf(search) !== -1)
        : chatRooms,
    [search, chatRooms]
  );

  useEffect(() => {
    if (userId) {
      getChatRooms({ variables: { userId } });
    }
  }, [userId, getChatRooms]);

  useEffect(() => {
    if (chatRooms && userId) {
      subChatRooms({
        document: SUB_CHAT_ROOMS_BY_USER,
        variables: { userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return Object.assign({}, prev, subscriptionData.data);
        },
      });
    }
  }, [chatRooms, userId, subChatRooms]);

  return (
    <div className="Chats">
      <div className="Chats__container">
        <div className="Chats__search">
          <Search
            className="Chats__search__input"
            placeholder=""
            updateSearch={(value) => setSearch(value)}
          />
          <div className="Chats__search__imgWrapper">
            <img
              className="img-width100"
              src={
                require("Common/assets/svg/General/Search_big_icon.svg").default
              }
              alt="Поиск"
            />
          </div>
        </div>

        <div className="Chats__cardsWrapper">
          {chatRoomsFilter?.map(
            ({ name, usernames, roomUser, chatRosters }, index) => {
              return (
                <div key={index}>
                  <Link to={`/chat/room/${name}`}>
                    <ChatHistoryCard
                      isOnline={roomUser?.user?.online}
                      img={
                        roomUser?.user?.image
                          ? storage(roomUser?.user?.image, "s")
                          : ProfileIconImg
                      }
                      rotate={roomUser?.user?.rotate}
                      username={usernames}
                      newMesCount={chatRosters?.totalCount}
                    />
                  </Link>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomsPage;
