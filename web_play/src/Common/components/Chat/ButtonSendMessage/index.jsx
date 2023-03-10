import "./index.scss";

import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { nanoid } from "nanoid";

import { crud } from "Common/services/postgraphile";

import { getRandomEmojis } from "Common/services/emojis";
import { useStore } from "Common/hooks/store";

const { CREATE: CREATE_CHAT_ROOMS_USER } = crud("chatRoomsUser");
const { CREATE: CREATE_CHAT_ROOM } = crud("chatRoom", "name");

const ButtonSendMessage = ({ playerId, chatRoom, refetchQueries = [] }) => {
  const { store } = useStore();

  const history = useHistory();

  const [counter, setCounter] = useState(0);

  const { userId } = store;

  const userIds = useMemo(
    () => userId && playerId && [userId, playerId],
    [userId, playerId]
  );

  const [createChatRoom, { data: dataCreateChatRoom }] = useMutation(
    CREATE_CHAT_ROOM,
    { refetchQueries }
  );
  const chatRoomNew = useMemo(
    () => dataCreateChatRoom?.create.node,
    [dataCreateChatRoom]
  );

  const [createChatRoomsUser, { data: dataCreateChatRoomsUser }] = useMutation(
    CREATE_CHAT_ROOMS_USER,
    { refetchQueries }
  );

  const handlerSendMessage = () => {
    if (!chatRoom) {
      createChatRoom({
        variables: {
          input: {
            chatRoom: {
              name: nanoid(10),
              enc: getRandomEmojis(),
            },
          },
        },
      });
    } else {
      history.push(`/chat/room/${chatRoom.name}`);
    }
  };

  // create or push chatRoom
  useEffect(() => {
    if (chatRoomNew && userIds) {
      userIds.forEach((item) => {
        createChatRoomsUser({
          variables: {
            input: { chatRoomsUser: { roomId: chatRoomNew.id, userId: item } },
          },
        });
      });
    }
  }, [chatRoomNew, userIds, createChatRoomsUser, history]);

  useEffect(() => {
    if (dataCreateChatRoomsUser) {
      setCounter((prev) => prev + 1);
      if (counter === userIds?.length) {
        history.push(`/chat/room/${chatRoomNew.name}`);
      }
    }
  }, [dataCreateChatRoomsUser, counter, history, chatRoomNew, userIds]);

  return (
    <>
      {playerId !== userId && (
        <div className="FriendInvite__actions__write">
          <img
            className="img-width100"
            src={require("Common/assets/svg/Profile/Send_Message.svg").default}
            alt="Написать сообщение"
            onClick={handlerSendMessage}
          />
        </div>
      )}
    </>
  );
};

export default ButtonSendMessage;
