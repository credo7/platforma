import "./index.scss";

import React from "react";
import { useHistory } from "react-router-dom";

import { storage } from "Common/services/functions";

import ProfileIcon from "Common/components/ProfileIcon";

import ProfileIconImg from "Common/assets/png/ProfileIcon.png";

const TeamPlayerCard = ({ team, player, children, isCaptain }) => {
  const widthClientScreen = document.body.clientWidth;

  const history = useHistory();
  const checkTargetEvent = (e) => {
    const target = e.target.closest(".TeamPlayerCard__actions");
    if (target?.className !== "TeamPlayerCard__actions") {
      history.push(`/profile/${player.username}`);
    }
  };

  const img = player.image ? storage(player.image, "s") : ProfileIconImg;

  const ratingInPlayers = player?.players?.nodes[0]?.rating?.nodes[0]?.elo;

  return (
    <div className="TeamPlayerCard" onClick={(e) => checkTargetEvent(e)}>
      <figure className="TeamPlayerCard__figure">
        <div className="TeamPlayerCard__imgWrapper">
          <div
            className="ramca"
            style={player?.online ? { border: "3px solid #BDFF52" } : {}}
          />
          {widthClientScreen < 1281 ? (
            <ProfileIcon
              src={img}
              rotate={player.rotate}
              height={40}
              width={40}
            />
          ) : (
            <ProfileIcon
              src={img}
              rotate={player.rotate}
              height={55}
              width={55}
            />
          )}
        </div>
        <div className="TeamPlayerCard__figure__text">
          <p className="TeamPlayerCard__nik">{player.username}</p>
          <div className="Text-18px-700">{ratingInPlayers}</div>
        </div>
      </figure>

      {isCaptain && <div className="TeamPlayerCard__captain">CAP</div>}

      <div className="TeamPlayerCard__actions">{children}</div>
    </div>
  );
};

export default TeamPlayerCard;
