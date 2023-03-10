import "./index.scss";

import React from "react";

import GameHistoryCard from "Common/components/GameHistoryCard";

function GamesHistory({ tournaments }) {
  return (
    <div className="GamesHistory">
      <div className="GamesHistory__history">
        <div className="GamesHistory__history__cards">
          {tournaments?.map((tournament, index) => {
            let tr = tournament?.tournamentByTournamentId;
            if (tr) {
              return (
                <GameHistoryCard
                  key={index + Math.random()}
                  id={tr?.id}
                  name={tr?.name}
                  prize={tr?.prize}
                  participants={
                    tr?.tournamentsPlayersByTournamentId?.totalCount
                  }
                  slots={tr?.slots}
                  liveStartAt={tr?.liveStartAt}
                  game={tr?.game}
                  format={tr?.format}
                  teamSize={tr?.teamSize}
                />
              );
            }
            return {};
          })}
        </div>
      </div>
    </div>
  );
}

export default GamesHistory;
