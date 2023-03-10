import "./index.scss";

import React, { useEffect, createRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Div100vh from "react-div-100vh";
import { useLazyQuery } from "@apollo/client";

import moment from "Common/services/moment";
import { useStore } from "Common/hooks/store";
import { handlerMenu } from "Common/services/functions";

import { GET_NEAREST_TOURNAMENTS } from "Common/graphql/Tournaments";

const { REACT_APP_AUTH_WEB } = process.env;

function SidePanel() {
  const { store, setStore } = useStore();

  // ? player
  const { user, lockScroll, bells, gameId, userId, isAdmin, team } = store;

  const blockFieldRef = createRef();

  const [getNearestTournaments, { data: dataNearestTournaments }] =
    useLazyQuery(GET_NEAREST_TOURNAMENTS);

  const tournametsPlayers = useMemo(
    () => dataNearestTournaments?.allTournamentsPlayers?.nodes || [],
    [dataNearestTournaments]
  );
  const tournametsTeamsPlayers = useMemo(
    () => dataNearestTournaments?.allTournamentsTeamsPlayers?.nodes || [],
    [dataNearestTournaments]
  );

  const nearestTournaments = useMemo(
    () => [...tournametsPlayers, ...tournametsTeamsPlayers],
    [tournametsPlayers, tournametsTeamsPlayers]
  );

  useEffect(() => {
    if (userId && gameId) {
      getNearestTournaments({
        variables: { userId, gameId, status: ["REGISTRATION"] },
      });
    }
  }, [userId, gameId, getNearestTournaments]);

  const onBlockFieldRef = (e) => {
    if (e.target.closest("a")) {
      blockFieldRef.current.click();
    }
  };

  return createPortal(
    <>
      <div
        className="BlockField"
        onClick={() => {
          handlerMenu();
          setStore((prev) => ({ ...prev, lockScroll: !lockScroll }));
        }}
        ref={blockFieldRef}
      />
      <Div100vh style={{ position: "absolute", right: "100vw" }}>
        <div className="SidePanel" onClick={onBlockFieldRef}>
          <div>
            <div className="SidePanel__nearestTournament">
              <div className="SidePanel__option">
                {/* <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Profile.svg").default
                      }
                      alt="Перейти в профиль"
                    />
                  </div> */}
                <p className="SidePanel__comonText TextOverflow SidePanel__comonText_bigFont ">
                  {user ? user?.username : <>Мой профиль</>}
                </p>
              </div>

              <Link to={`/profile/${user?.username}`}>
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Profile.svg")
                          .default
                      }
                      alt="Игрок"
                    />
                  </div>
                  <p className="SidePanel__comonText TextOverflow">
                    {/* {player ? player?.username : <>Мой игрок</>} */}
                    Мой игрок
                  </p>
                </div>
              </Link>

              <Link
                to={team ? `/team/profile/${team?.name}` : `/team/settings`}
              >
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Team.svg").default
                      }
                      alt="Команда"
                    />
                  </div>
                  <p className="SidePanel__comonText TextOverflow">
                    {/* {team ? team?.name : <>Моя команда</>} */}
                    Моя команда
                  </p>
                </div>
              </Link>
            </div>

            <div className="SidePanel__nearestTournament">
              {user && (
                <p className="SidePanel__comonText">
                  {nearestTournaments?.length > 1
                    ? "Ближайшие турниры"
                    : "Ближайший турнир"}
                </p>
              )}
              <div className="SidePanel__nearestTournament_list">
                {user &&
                  nearestTournaments?.map((nearestTournament, index) => {
                    let tr = nearestTournament.tournamentByTournamentId;

                    return (
                      <Link to={`/tournament/${tr.id}`} key={index}>
                        <p className="SidePanel__date">
                          <small style={{ display: "block" }}>{tr.name}</small>
                          {moment(new Date(tr.liveStartAt)).format(
                            "D MMMM HH:mm"
                          )}
                        </p>
                      </Link>
                    );
                  })}
              </div>
            </div>

            <div className="SidePanel__options">
              <Link to="/notifications">
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Notice.svg")
                          .default
                      }
                      alt="Уведомления"
                    />
                    {bells?.notify && (
                      <span className="SidePanel__option__imgContainer__indicator">
                        &nbsp;
                      </span>
                    )}
                  </div>
                  <p className="SidePanel__comonText">Уведомления</p>
                </div>
              </Link>

              <Link to="/chat/rooms">
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Messages.svg")
                          .default
                      }
                      alt="Сообщения"
                    />
                    {bells?.messages && (
                      <span className="SidePanel__option__imgContainer__indicator">
                        &nbsp;
                      </span>
                    )}
                  </div>
                  <p className="SidePanel__comonText">Сообщения</p>
                </div>
              </Link>

              <Link to={`/wallets`}>
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Wallet.svg")
                          .default
                      }
                      alt="Кошелёк"
                    />
                    {bells?.balance && (
                      <span className="SidePanel__option__imgContainer__indicator">
                        &nbsp;
                      </span>
                    )}
                  </div>
                  <p className="SidePanel__comonText">Кошелёк</p>
                </div>
              </Link>

              <Link to="/FAQ">
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/FAQ.svg").default
                      }
                      alt="FAQ"
                    />
                  </div>
                  <p className="SidePanel__comonText">FAQ</p>
                </div>
              </Link>

              <a href={`${REACT_APP_AUTH_WEB}/user`}>
                <div className="SidePanel__option">
                  <div className="SidePanel__option__imgContainer">
                    <img
                      className="SidePanel__oprion__optionImg"
                      src={
                        require("Common/assets/svg/Side_panel/Settings.svg")
                          .default
                      }
                      alt="Настройки"
                    />
                  </div>
                  <p className="SidePanel__comonText">Настройки</p>
                </div>
              </a>
            </div>

            {isAdmin && (
              <div className="SidePanel__admin">
                {/* <Link to="/admin">
                  <div className="SidePanel__option">
                    <p className="SidePanel__comonText">Админка</p>
                  </div>
                </Link> */}
              </div>
            )}

            <div className="SidePanel__footer">
              {/* <a
                href={`${REACT_APP_AUTH_WEB}/user/logout`}
                className="SidePanel__comonText"
                id="Logout"
              >
                Выйти
              </a> */}
            </div>
          </div>
        </div>
      </Div100vh>
    </>,
    document.getElementById("portal")
  );
}

export default SidePanel;
