import "./index.scss";

import React, { useEffect, useMemo, useState } from "react";

import ClientOnly from "Common/components/ClientOnly";
import AES from "crypto-js/aes";
import ENC from "crypto-js/enc-utf8";
import { GET_CHAT_ROOM_BY_NAME } from "Common/graphql/ChatRooms";
import {
  CHAT_ROSTER_READ,
  GET_CHAT_ROSTER,
  GET_CHAT_ROSTER_NEW,
} from "Common/graphql/ChatRosters";
import { useFocus } from "Common/hooks/focus";
import { useStore } from "Common/hooks/store";
import Message from "Common/pages/Chat/Message";
import { osName } from "react-device-detect";
import { useParams } from "react-router-dom";
import ScrollLock, { TouchScrollable } from "react-scrolllock";
import moment from "Common/services/moment";
import { crud } from "Common/services/postgraphile";

import { useLazyQuery, useMutation } from "@apollo/client";

import { storage } from "Common/services/functions";

const { CREATE: CREATE_CHAT_MESSAGE } = crud("chatMessage");
const { CREATE: CREATE_CHAT_ROSTER } = crud("chatRoster", "");

const ChatRoomPage = () => {
  /* заглушка  */
  // return <div className="Chats__MainMessage">Чат находится в разработке</div>;

  const { store } = useStore();

  const { name } = useParams();

  const { userId } = store;

  const [inputRef, setInputFocus] = useFocus();

  const dayTooday = moment(new Date()).format("DD.MM.YY");

  const [lockScroll, setLockScroll] = useState(false);

  const [reply, setReply] = useState("");
  const isReply = useMemo(() => reply && reply.length > 0, [reply]);

  const [isSend, setIsSend] = useState(false);

  const [getChatRoom, { data: dataChatRoom }] = useLazyQuery(
    GET_CHAT_ROOM_BY_NAME
  );
  const chatRoom = useMemo(
    () => dataChatRoom?.chatRooms?.nodes[0],
    [dataChatRoom]
  );
  const chatUsers = useMemo(
    () => chatRoom?.chatRoomsUsers?.nodes?.map(({ user }) => user),
    [chatRoom]
  );
  const chatUsersIds = useMemo(
    () => chatUsers?.flatMap(({ id }) => id),
    [chatUsers]
  );

  const [getChatRoster, { data: dataChatRoster }] =
    useLazyQuery(GET_CHAT_ROSTER);
  const chatRosters = useMemo(
    () => dataChatRoster && [...dataChatRoster?.roster?.nodes].reverse(),
    [dataChatRoster]
  );

  const [getChatRosterNew, { data: dataChatRosterNew }] = useLazyQuery(
    GET_CHAT_ROSTER_NEW,
    { pollInterval: 3000 }
  );
  const chatRostersNew = useMemo(
    () => dataChatRosterNew && [...dataChatRosterNew?.roster?.nodes].reverse(),
    [dataChatRosterNew]
  );

  const chatRostersAll = useMemo(
    () => chatRosters && chatRostersNew && [...chatRosters, ...chatRostersNew],
    [chatRosters, chatRostersNew]
  );

  const [createChatMessage, { data: dataCreateChatMessage }] =
    useMutation(CREATE_CHAT_MESSAGE);
  const message = useMemo(
    () => dataCreateChatMessage?.create?.node,
    [dataCreateChatMessage]
  );

  const [createChatRoster] = useMutation(CREATE_CHAT_ROSTER);
  const [chatRosterRead] = useMutation(CHAT_ROSTER_READ);

  const scrollToLastDOM = () => {
    const chatWindow = document.querySelector(".Chat__conversation__wrapper");
    chatWindow && chatWindow.scrollTo(0, chatWindow.scrollHeight);
  };

  const setInputFocusDOM = () => {
    setTimeout(() => {
      const input = document.querySelector(".Chat__desk__textarea");
      input && input.focus();
    }, 1000);
  };

  const isPadOrientation =
    window.orientation === 90 || window.orientation === -90;

  const handleReply = () => {
    if (isReply && !isSend && chatRoom) {
      createChatMessage({
        variables: {
          input: {
            chatMessage: { text: AES.encrypt(reply, chatRoom.enc).toString() },
          },
        },
      });

      setIsSend(true);
    }
  };

  useEffect(() => {
    if (window.orientation !== 90) {
      scrollToLastDOM();
    }
    setLockScroll(osName === "IOS");
  }, []);

  useEffect(() => {
    if (name && userId) {
      getChatRoom({ variables: { name, userId } });
    }
  }, [name, userId, getChatRoom]);

  useEffect(() => {
    if (chatRoom && userId) {
      getChatRoster({ variables: { roomId: chatRoom.id, userId } });
      getChatRosterNew({
        variables: { roomId: chatRoom.id, userId, read: false },
      });

      chatRosterRead({ variables: { userId, roomId: chatRoom.id } });
    }
  }, [chatRoom, userId, getChatRoster, getChatRosterNew, chatRosterRead]);

  useEffect(() => {
    if (isSend && message && userId && chatRoom) {
      chatUsersIds?.forEach((id) => {
        createChatRoster({
          variables: {
            input: {
              chatRoster: {
                roomId: chatRoom.id,
                toUserId: id,
                fromUserId: userId,
                messageId: message.id,
                read: false,
              },
            },
          },
        });
      });
    }
  }, [isSend, message, userId, chatRoom, chatUsersIds, createChatRoster]);

  useEffect(() => {
    if (chatRostersAll) {
      setReply("");
      setIsSend(false);
      scrollToLastDOM();
      setInputFocus();
      setInputFocusDOM();
    }
  }, [chatRostersAll, setInputFocus]);

  if (isPadOrientation) {
    return (
      <>
        <div className="imgOrientationWrap">
          <div className="imgOrientation"></div>
        </div>
      </>
    );
  }

  return (
    <ClientOnly>
      <div className="Chat">
        {osName === "IOS" && <ScrollLock isActive={lockScroll} />}
        <div className="Chat__container">
          <header className="Chat__header">
            <div className="Chat__headerWrapper">
              <span className="Chat__nikCompanion Text-14px-700">
                {chatUsers?.map(({ username }) => username)?.join(" | ")}
              </span>
            </div>

            {/* 
              BURGER НЕ РАБОТАЛ. 
              ПЕРЕДЕЛАТЬ СЛОЖНО. 
              ЛУЧШЕ ДОБАВИТЬ КОМПОНЕНТ 
              СОЗДАННЫЙ ИЗ NavBarBurger
            */}
          </header>

          <div id="conversation" className="Chat__conversation">
            <TouchScrollable>
              <div className="Chat__conversation__wrapper">
                {chatRostersAll?.map(({ message, user, createdAt }, index) => (
                  <Message
                    date={moment(new Date(createdAt), "DD.MM.YY")}
                    key={index}
                    id={message?.id}
                    isMy={user.id === userId}
                    time={
                      dayTooday ===
                      moment(new Date(createdAt)).format("DD.MM.YY")
                        ? moment(new Date(createdAt)).format("HH:mm")
                        : moment(new Date(createdAt)).format("DD.MM.YY") +
                          " " +
                          moment(new Date(createdAt)).format("HH:mm")
                    }
                    text={AES.decrypt(message?.text, chatRoom?.enc).toString(
                      ENC
                    )}
                    img={
                      user?.image
                        ? storage(user?.image, "s")
                        : require("Common/assets/png/ProfileIcon.png").default
                    }
                    rotate={user?.rotate}
                  />
                ))}
              </div>
            </TouchScrollable>
          </div>
          <div className="Chat__arrowWrapper">
            <div className="Chat__arrows">
              <div className="Chat__arrowUp"></div>
              <div className="Chat__arrowDown"></div>
            </div>
          </div>
        </div>

        <div className="Chat__desk">
          <div className="Chat__desk__inputContainer">
            <textarea
              ref={inputRef}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="Chat__desk__textarea"
              type="text"
              onKeyDown={(e) => (e.key === "Enter" ? handleReply() : null)}
              autoFocus
              disabled={isSend}
            />

            {isReply && (
              <div className="Chat__desk__send">
                <img
                  onClick={() => handleReply()}
                  className={`img-width100 ${isSend && "grayscale"}`}
                  src={
                    require("Common/assets/svg/General/Send_message.svg")
                      .default
                  }
                  alt="Отправить сообщение"
                />
              </div>
            )}
          </div>
        </div>

        {/* <div className="Cgat__backgroundStrip--bottom" /> */}
      </div>
    </ClientOnly>
  );
};

export default ChatRoomPage;
