import "./index.scss";

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import UserCard from "Common/components/UserCard";

import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

import ProfileIcon from "Common/assets/png/ProfileIcon.png";

const TeamCard = ({
  teamImg,
  teamName,
  teamRating,
  teamCaptainId,
  teamPlayers,
  specialStyleCSS__TeamCard,
  specialStyleCSS__figure__text,
  cssTeamCard__inNotification,
  children,
}) => {
  const { store } = useStore();

  const { gameId } = store;
  const history = useHistory();

  const [btnTitle, setBtnTitle] = useState("arrowDown");

  const addActiveClass = (e) => {
    // проверка specialStyleCSS__TeamCard для того, чтобы в итогах
    // турнира карточка команды не раскрывалась
    if (!specialStyleCSS__TeamCard) {
      const elem = e.currentTarget;
      if (!elem.classList.contains("active")) {
        elem.classList.toggle("active");
        elem.style.height = elem.scrollHeight + "px";
        setBtnTitle("arrowUp");
      } else {
        elem.classList.toggle("active");
        elem.style.height = "54px";
        setBtnTitle("arrowDown");
      }
    }
  };

  const goToTeamProfile = () => {
    history.push(`/team/profile/${teamName}`);
  };

  return (
    <div
      className={`TeamCard ${specialStyleCSS__TeamCard} ${cssTeamCard__inNotification}`}
      onClick={addActiveClass}
    >
      <div className="TeamCard__visibleBlock">
        <figure className="UserCard__figure">
          <div className="UserCard__imgWrapper">
            <img
              className="avatarImg avatar"
              src={teamImg ? storage(teamImg, "l") : ProfileIcon}
              alt="Картинка команды"
            />
          </div>
          <div
            className="UserCard__figure__text TeamCard__figure__text "
            onClick={goToTeamProfile}
          >
            <p className="UserCard__nik">{teamName}</p>
            <p className="Text-18px-700 UserCard__rating">{teamRating}</p>
          </div>
          {teamPlayers && <div className={`teamCard_btn ${btnTitle}`}></div>}
          <div className="UserCard__figure">{children}</div>
        </figure>
      </div>
      {teamPlayers?.map((item) => {
        return (
          <UserCard
            key={item.user.id}
            userId={item.user.id}
            usernameMain={item.user.username}
            // playerName={item.user.players.nodes[0].username} --- ЛОМАЕТ ВЕРСТКУ в карточке команды в рейтинге
            img={
              item.user.image
                ? storage(item.user.image, "l")
                : require("Common/assets/png/ProfileIcon.png").default
            }
            rating={item.user.players?.nodes[0]?.playerRating?.nodes[0]?.elo}
            players={[{ gameId: gameId }]}
            // victories="12"
            // defeats="2"
            // isLogin={} --- не передавать --- (скрываем кнопки добавления в друзья, можно добавить зайдя в профиль)
            isFriend={true}
            isOnline={item.user.online}
            specialStyleCSS__figure__text={"UserCardInTeamCard"}
            teamCaptain_TeamCard={item.isCaptain}
          />
        );
      })}
    </div>
  );
};

export default TeamCard;
