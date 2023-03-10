import "./index.scss";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import TeamPlayerCard from "Common/components/TeamPlayerCard";
import ButtonAdd from "Common/components/TeamsInvites/ButtonAdd";
import { useStore } from "Common/hooks/store";

import { GET_FRIENDS_ON_TEAM } from "Common/graphql/Friends";

const TeamSettingsFriends = ({ team }) => {
  const { store } = useStore();

  const { gameId, userId } = store;

  const [getFriends, { data: dataFriendsPlayer }] =
    useLazyQuery(GET_FRIENDS_ON_TEAM);
  const friends = dataFriendsPlayer?.allFriends?.nodes;

  useEffect(() => {
    if (userId && gameId) {
      getFriends({ variables: { userId, gameId } });
    }
  }, [userId, gameId, getFriends]);

  return (
    <div className="TeamSettingsPage">
      <p className="TeamSettingsInfo__text">Пригласить:</p>
      {friends?.length <= 0 && (
        <Link to="/rating" className="TeamSettingsPlayers__discription">
          Здесь будут показаны только те друзья, которые не состоят ни в одной
          команде. <br />
          Нажимай на это сообщение, чтобы найти новых друзей.
        </Link>
      )}
      {friends?.map((item, index) => (
        <TeamPlayerCard
          key={index}
          team={team}
          player={item?.user}
          isPlayer={false}
        >
          <ButtonAdd teamId={team?.id} playerId={item.friendId} />
        </TeamPlayerCard>
      ))}
    </div>
  );
};

export default TeamSettingsFriends;
