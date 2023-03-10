import "./index.scss";

import React from "react";
import ProfileIcon from "Common/components/ProfileIcon";

const ChatHistoryCard = ({
  isOnline,
  img,
  rotate,
  username,
  lastMessage,
  time,
  newMesCount,
}) => {
  return (
    <div className="ChatHistoryCard">
      <div className="ChatHistoryCard__imgWrapper">
        <div className="avatarImg avatar">
          <ProfileIcon src={img} rotate={rotate} height={40} width={40} />
        </div>
        <div
          className="ramca"
          style={isOnline ? { border: "3px solid #BDFF52" } : {}}
        ></div>
      </div>

      <div className="ChatHistoryCard__info">
        <div className="ChatHistoryCard__info__nikAndMes">
          <p className="ChatHistoryCard__info__nikAndMes__nik">
            <span className="Text-10px-700">{username}</span>
          </p>

          <div className="ChatHistoryCard__info__nikAndMes__mes">
            <span className="Text-10px-400">{lastMessage}</span>
          </div>
        </div>

        <div className="ChatHistoryCard__info__timeAndCount">
          <p className="ChatHistoryCard__info__timeAndCoun__time">
            <span className="Text-10px-400">{time}</span>
          </p>
          {newMesCount > 0 && (
            <p className="ChatHistoryCard__info__timeAndCoun__count">
              <span className="Text-14px-500 ">{newMesCount}</span>{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryCard;
