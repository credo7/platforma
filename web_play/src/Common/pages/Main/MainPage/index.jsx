import "./index.scss";

import React from "react";
import { Link } from "react-router-dom";

import BigLogo from "Common/components/BigLogo";
import { BsTelegram } from "react-icons/bs";
import { useStore } from "Common/hooks/store";

const { REACT_APP_AUTH_WEB } = process.env;

const MainPage = () => {
  const { store } = useStore();
  const { isAuth } = store;

  return (
    <>
      <div className="Main">
        <BigLogo size={{ width: "194px", height: "80px" }} />

        <div className="Main__Wrapper">
          <div className="Main__Text">
            <div>Платформа</div>
            <div>для проведения</div>
            <div>киберспортивных</div>
            <div>турниров</div>
          </div>

          {isAuth && (
            <div className="Main__Btns">
              <Link className="commonBtn Main__Btn--red" to="/tournaments">
                АНОНС
              </Link>
              <Link className="commonBtn " to="/faq">
                FAQ
              </Link>
            </div>
          )}

          {!isAuth && (
            <div className="Main__Btns">
              <a
                className="commonBtn"
                href={`${REACT_APP_AUTH_WEB}/user/login`}
              >
                ВОЙТИ
              </a>

              <a
                className="commonBtn Main__Btn--red"
                href={`${REACT_APP_AUTH_WEB}/user/register`}
              >
                РЕГИСТРАЦИЯ
              </a>
            </div>
          )}

          <div className="Main__Social__Wrapper">
            {/* Иконка телеграма */}
            <div className="Main__Social__Text">
              Подписывайтесь на наш канал
            </div>
            <div className="Main__Social__Btns">
              <a href="https://t.me/pwgames" target={"_blank"} rel="noreferrer">
                <BsTelegram
                  style={{ width: 50, height: 50, color: "#5483c9" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
