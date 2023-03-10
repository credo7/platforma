import "./index.scss";

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { handlerMenu, setActiveToClass } from "Common/services/functions";
import { useStore } from "Common/hooks/store";
import ProfileIcon from "Common/components/ProfileIcon";
import { storage } from "Common/services/functions";

const { REACT_APP_AUTH_WEB } = process.env;

const Nav = () => {
  const { store, setStore } = useStore();

  const location = useLocation();

  const { isAuth, user, lockScroll, gameId, bells, game } = store;

  // each change active page
  useEffect(() => {
    setActiveToClass(location, ".Nav__icon--inDiv");
  }, [location]);

  return (
    <div className="Nav__wrapper">
      <nav className="Nav">
        <Link className="Nav__icon" id="Nav__logo" to="/">
          <figure className="Nav__figure">
            <img
              src={require("Common/assets/svg/Nav_icon/PG_logo.svg").default}
              alt="Home"
            />
          </figure>
        </Link>

        {isAuth && (
          <>
            <div className="Nav__iconDiv">
              <Link className="Nav__icon--inDiv" to={`/tournaments`}>
                <figure className="Nav__figure">
                  <img
                    className="navSvg"
                    src={
                      require("Common/assets/svg/Nav_icon/Tournaments_icon.svg")
                        .default
                    }
                    alt="Tournaments"
                  />
                  <div className="Nav__iconText">Турниры</div>
                </figure>
              </Link>
              <Link className="Nav__icon--inDiv" to={`/rating`}>
                <figure className="Nav__figure">
                  <img
                    className="navSvg"
                    src={
                      require("Common/assets/svg/Nav_icon/Rating_icon.svg")
                        .default
                    }
                    alt="Rating"
                  />
                  <div className="Nav__iconText">Рейтинг</div>
                </figure>
              </Link>
              <Link className="Nav__icon--inDiv" to="/games">
                <figure className="Nav__figure">
                  {game?.image ? (
                    <img
                      className="navImage"
                      src={storage(game?.image)}
                      alt={gameId}
                      title={gameId}
                    />
                  ) : (
                    <img
                      className="navSvg"
                      src={
                        require("Common/assets/svg/Nav_icon/Games_icon.svg")
                          .default
                      }
                      alt="Games"
                    />
                  )}
                </figure>
              </Link>

              <Link className="Nav__icon--inDiv FaqHide" to="/FAQ">
                <figure className="Nav__figure">
                  <img
                    className="navSvg"
                    src={
                      require("Common/assets/svg/Nav_icon/Faq_icon.svg").default
                    }
                    alt="Faq"
                  />
                  <div className="Nav__iconText">FAQ</div>
                </figure>
              </Link>
            </div>

            <div className="Nav__userInfoWrap">
              <ProfileIcon
                src={
                  user?.image
                    ? storage(user.image, "m")
                    : require("Common/assets/png/ProfileIcon.png").default
                }
                rotate={user?.rotate}
                height={40}
                width={40}
              />

              <Link to={`/profile/${user?.username}`} className="">
                <div className="Nav__username">{user?.username}</div>
              </Link>

              <Link to="/notifications" className="Nav__notifiWrap">
                <img
                  className="Nav__notifiImg"
                  src={
                    require("Common/assets/svg/Side_panel/Notice.svg").default
                  }
                  alt="Уведомления"
                />
                {bells?.notify && (
                  <span className="SidePanel__option__imgContainer__indicator">
                    &nbsp;
                  </span>
                )}
              </Link>

              <Link to="/chat/rooms" className="Nav__messageWrap">
                <img
                  className="Nav__massageImg"
                  src={
                    require("Common/assets/svg/Side_panel/Messages.svg").default
                  }
                  alt="Сообщения"
                />
                {bells?.messages && (
                  <span className="SidePanel__option__imgContainer__indicator">
                    &nbsp;
                  </span>
                )}
              </Link>
            </div>
          </>
        )}

        {!isAuth && (
          <div className="Nav__RegisterAndLoginWrap">
            <a
              href={`${REACT_APP_AUTH_WEB}/user/register`}
              className="Nav__RegisterWrap"
            >
              <div className="Nav__RegisterImg">
                <img
                  src={
                    require("Common/assets/svg/Nav_icon/Register_icon.svg")
                      .default
                  }
                  alt="Register"
                />
              </div>
              <div className="Nav__RegisterText">РЕГИСТРАЦИЯ</div>
            </a>
            <a
              href={`${REACT_APP_AUTH_WEB}/user/login`}
              className="Nav__LoginWrap"
            >
              <div className="Nav__LoginImg">
                <img
                  src={
                    require("Common/assets/svg/Nav_icon/Login_icon.svg").default
                  }
                  alt="Login"
                />
              </div>
              <div className="Nav__LoginText">ВОЙТИ</div>
            </a>
          </div>
        )}

        {isAuth && (
          <div
            id="Nav__menu"
            className="Nav__icon"
            onClick={() => {
              handlerMenu();
              setStore((prev) => ({ ...prev, lockScroll: !lockScroll }));
            }}
          >
            <figure className="Nav__figure">
              <img
                src={
                  require("Common/assets/svg/Nav_icon/Menu_icon.svg").default
                }
                alt="Меню"
              />
              {bells?.all && (
                <span className="Nav__figure__indicator">&nbsp;</span>
              )}
            </figure>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Nav;
