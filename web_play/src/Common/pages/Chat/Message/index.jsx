import "./index.scss";

import React from "react";
import classNames from "classnames";

import ProfileIcon from "Common/components/ProfileIcon";

const Message = ({ date, style, isMy, time, text, img, rotate }) => {
  const classForMessage = classNames({
    Chat__MyMessage: isMy,
    Chat__NotMyMessage: !isMy,
  });

  return (
    <div className={classForMessage} style={style}>
      <div className="Chat__MyMessage__message">
        {text}
        <p className="Chat__MyMessage__time">{time}</p>
      </div>

      <div className="Chat__MyMessage__imgWrapper">
        <ProfileIcon src={img} rotate={rotate} height={25} width={25} />
      </div>
    </div>
  );
};

export default Message;
