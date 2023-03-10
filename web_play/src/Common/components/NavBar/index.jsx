import "./index.scss";

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { handlerMenu, setActiveToClass } from "Common/services/functions";
import { useStore } from "Common/hooks/store";
import ProfileIcon from "Common/components/ProfileIcon";
import { storage } from "Common/services/functions";

const { REACT_APP_AUTH_WEB } = process.env;

const NavBarBar = () => {
  const { store, setStore } = useStore();

  const location = useLocation();

  const { isAuth, user, lockScroll, gameId, bells, game } = store;

  // each change active page
  useEffect(() => {
    setActiveToClass(location, ".NavBar__icon--inDiv");
  }, [location]);

  return (
    <div className="NavBar__wrapper">
      <nav className="NavBar">
        {isAuth && (
          <>
            <div className="NavBar__iconDiv">
              {[
                { imgName: "Profile", to: "/profile", info: "Профиль" },
                { imgName: "Profile", to: "/profile", info: "Профиль" },
              ].map(({ imgName, to, info }, index) => (
                <Link key={index} className="NavBar__icon--inDiv" to={to}>
                  <figure className="NavBar__figure">
                    <img
                      className="navSvg"
                      src={require(`Common/assets/svg/Side_panel/${imgName}.svg`)}
                      alt={info}
                    />
                    <div className="NavBar__iconText">{info}</div>
                  </figure>
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavBarBar;
