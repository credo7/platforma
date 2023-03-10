import "./index.scss";

import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";

import ProfileIcon from "Common/components/ProfileIcon";
import { useStore } from "Common/hooks/store";

import ProfileIconImg from "Common/assets/png/ProfileIcon.png";

const UserCard = ({
  userId,
  teamId,
  teamCaptain_TeamProfile,
  teamCaptain_TeamCard,
  img,
  username,
  usernameMain,
  playerName,
  players = [],
  rating,
  victories,
  defeats,
  isChatBlocked,
  isLogin,
  isFriend,
  iconRemoveFriend,
  isInGame,
  isOnline,
  isTeamMember,
  isHasTeam,
  isRatingList,
  isOwner,
  showStats = true,
  rotate,
  specialStyleCSS__figure__text,
  specialStyleCSS__UserCard,
  children,
}) => {
  const { store } = useStore();

  const { gameId, isAdmin } = store;

  const widthClientScreen = document.body.clientWidth;
  const history = useHistory();

  const player = useMemo(
    () => players?.find((player) => player.gameId === gameId),
    [players, gameId]
  );

  const checkTargetEvent = (e) => {
    const target = e.target.closest(".UserCard__actions");
    if (target?.className !== "UserCard__actions") {
      history.push(`/profile/${usernameMain}`);
    }
  };

  return (
    <div
      key={userId}
      className={`UserCard ${specialStyleCSS__UserCard}`}
      /*  style={isRatingList ? { minWidth: '324px' } : {}} */
      onClick={(e) => checkTargetEvent(e)}
    >
      <figure className="UserCard__figure">
        <div className="UserCard__imgWrapper">
          {/* <img
            className="avatarImg avatar"
            src={img || ProfileIconImg}
            alt="Картинка игрока"
          /> */}
          <div
            className="ramca"
            style={isOnline ? { border: "3px solid #BDFF52" } : {}}
          />
          {widthClientScreen < 1281 ? (
            <ProfileIcon
              src={img || ProfileIconImg}
              rotate={rotate}
              height={40}
              width={40}
            />
          ) : (
            <ProfileIcon
              src={img || ProfileIconImg}
              rotate={rotate}
              height={55}
              width={55}
            />
          )}
        </div>
        <div
          className={`UserCard__figure__text ${specialStyleCSS__figure__text}`}
        >
          <p className="UserCard__nik">
            {username} {usernameMain}
          </p>
          {isAdmin && <div className="UserCard__playerName">{playerName}</div>}
          {teamCaptain_TeamCard && (
            <div className="TeamPlayerCard__captain">CAP</div>
          )}
          {player && <p className="Text-18px-700 UserCard__rating">{rating}</p>}
        </div>
        {teamCaptain_TeamProfile && (
          <div className="TeamPlayerCard__captain">CAP</div>
        )}
        {/* <div
          className="UserCard__history"
          onClick={() => history.push(`/profile/${usernameMain}`)}
        >
          {player && showStats && (
            <p className="Profile__defeats">{defeats}</p>
          )}
          {player && showStats && (
            <div className="Profile__victories">{victories}</div>
          )}
        </div> */}
      </figure>

      {isLogin && <div className="UserCard__actions">{children}</div>}
    </div>
  );
};

export default UserCard;
