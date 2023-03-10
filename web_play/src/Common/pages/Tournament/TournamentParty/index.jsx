import "./index.scss";

import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "Common/components/Toastify";

import {
  UPDATE_PLAYER,
  GET_TOURNAMENTS_PLAYERS,
} from "Common/graphql/TournamentsPlayers";

import {
  UPDATE_TEAM,
  GET_TOURNAMENTS_TEAMS,
} from "Common/graphql/TournamentsTeams";

import Place from "Common/components/Place";
import Kill from "Common/components/Kill";
import UserCard from "Common/components/UserCard";
import TeamCard from "Common/components/TeamCard";
import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

import TournamentSearch from "Common/pages/Tournament/TournamentSearch";

const TournamentParty = ({ tournament, tournamentParty }) => {
  const { store } = useStore();

  const [tournamentSearch, setTournamentSearch] = useState();

  const { isAdmin, gameId } = store;

  const tournamentId = tournament.id;

  const [updatePlayer, { error: errorPlayer }] = useMutation(UPDATE_PLAYER);
  const [updateTeam, { error: errorTeam }] = useMutation(UPDATE_TEAM);

  const handlerPlace = (e) => {
    if (e.target.value === "" || e.target.value < 0) return;

    const id = e.target.id;
    const tookPlace = e.target.value > 0 ? e.target.value : null;

    if (tournament.format === "SOLO") {
      updatePlayer({
        variables: {
          id,
          tournamentsPlayerPatch: { tookPlace },
        },
        refetchQueries: [
          {
            query: GET_TOURNAMENTS_PLAYERS,
            variables: { tournamentId, isAdmin, gameId },
          },
        ],
      });
    }

    if (tournament.format === "TEAM") {
      updateTeam({
        variables: {
          id,
          tournamentsTeamPatch: { tookPlace },
        },
        refetchQueries: [
          {
            query: GET_TOURNAMENTS_TEAMS,
            variables: { tournamentId, isAdmin, gameId },
          },
        ],
      });
    }
    e.target.value = null;
  };

  const handlerKill = (e) => {
    if (e.target.value === "" || e.target.value < 0) return;

    const id = e.target.id;
    const tookKill = e.target.value;

    if (tournament.format === "SOLO") {
      updatePlayer({
        variables: {
          id,
          tournamentsPlayerPatch: { tookKill },
        },
        refetchQueries: [
          {
            query: GET_TOURNAMENTS_PLAYERS,
            variables: { tournamentId, isAdmin, gameId },
          },
        ],
      });
    }

    if (tournament.format === "TEAM") {
      updateTeam({
        variables: {
          id,
          tournamentsTeamPatch: { tookKill },
        },
        refetchQueries: [
          {
            query: GET_TOURNAMENTS_TEAMS,
            variables: { tournamentId, isAdmin, gameId },
          },
        ],
      });
    }

    e.target.value = null;
  };

  useEffect(() => {
    if (errorPlayer) {
      if (errorPlayer.message?.indexOf("tournamentPlayers_tookPlace") !== 1) {
        toast("Нельзя указывать одно и тоже место дважды");
      }
    }
  }, [errorPlayer]);

  useEffect(() => {
    if (errorTeam) {
      if (errorTeam.message?.indexOf("tournamentTeams_tookPlace") !== 1) {
        toast("Нельзя указывать одно и тоже место дважды");
      }
    }
  }, [errorTeam]);

  const partyCard = (item, index) => (
    <div className="TournamentPlayers__card" key={index}>
      {isAdmin && tournament.status === "LIVE" && (
        <input
          name={`tookPlace${item.id}`}
          id={item.id}
          type="number"
          placeholder="место"
          style={{
            width: "20px",
            height: "30px",
            font: "Text-10px-400",
          }}
          onBlur={(e) => handlerPlace(e)}
        />
      )}

      {(tournament.status === "FINISHED" ||
        (isAdmin && tournament.status === "LIVE")) &&
        item.tookPlace && (
          <Place
            placeNumber={item.tookPlace}
            forStyle={{
              width: "54px",
              height: "54px",
            }}
            font="Text-10px-400"
          />
        )}

      {tournament?.format === "SOLO" && (
        <UserCard
          userId={item.playerId}
          username={item.name}
          usernameMain={item.user.username}
          players={[{ gameId: gameId }]}
          rating={item.user.player.nodes[0]?.rating?.nodes[0]?.elo}
          isOnline={false}
          showStats={false}
          img={
            item.user.image
              ? storage(item.user.image, "s")
              : require("Common/assets/png/ProfileIcon.png").default
          }
          rotate={item.user.rotate}
          specialStyleCSS__UserCard={"UserCard__tournamentFinish"}
        />
      )}

      {tournament?.format === "TEAM" && (
        <TeamCard
          teamName={item.teamName}
          teamImg={item.team?.image}
          teamPlayers={item.team?.players?.nodes}
          teamRating={item.team?.rating?.nodes[0]?.elo}
          teamCaptainId={item.team?.captainId}
          specialStyleCSS__TeamCard={"TeamCard__tournamentFinish"}
        />
      )}

      {isAdmin && tournament.status === "LIVE" && (
        <input
          name={`tookKill${item.id}`}
          id={item.id}
          type="number"
          placeholder="kill"
          style={{
            width: "20px",
            height: "30px",
            font: "Text-10px-400",
          }}
          onBlur={(e) => handlerKill(e)}
        />
      )}

      {(tournament.status === "FINISHED" ||
        (isAdmin && tournament.status === "LIVE")) &&
        item.tookPlace && (
          <Kill
            placeNumber={item.tookKill}
            forStyle={{
              width: "54px",
              height: "54px",
            }}
            font="Text-10px-400"
          />
        )}
    </div>
  );

  return (
    <div className="TournamentPlayers__cardsWrapper">
      {isAdmin && (
        <TournamentSearch
          {...{
            tournament,
            tournamentParty,
            tournamentSearch,
            setTournamentSearch,
          }}
        />
      )}

      {(tournamentSearch || tournamentParty)
        ?.filter((item) => item.tookPlace)
        .sort((a, b) => parseInt(a.tookPlace) - parseInt(b.tookPlace))
        .map((item, index) => partyCard(item, index))}

      <br />

      {(tournamentSearch || tournamentParty)
        ?.filter((item) => !item.tookPlace)
        .map((item, index) => partyCard(item, index))}
    </div>
  );
};

export default TournamentParty;
