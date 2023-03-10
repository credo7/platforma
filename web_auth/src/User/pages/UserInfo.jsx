import React from "react";
import { Link } from "react-router-dom";

import { useStore } from "Common/hooks/store";

const { REACT_APP_PLAY_URL } = process.env;

const UserInfo = () => {
  const { store } = useStore();

  const { user } = store;

  return (
    <center className="UserForm">
      <h3>Профиль</h3>

      <div className="UserInfo">
        <div className="UserInfo__username">Имя: {user?.username}</div>
        <div className="UserInfo__email">Почта: {user?.email}</div>
      </div>

      {!user?.emailVerified && (
        <Link to="/user/email">
          <button className="UserForm__button--warning">
            Подтвердить почту
          </button>
        </Link>
      )}

      <Link to="/user/terms">
        <button className="UserForm__button--error">Правила сайта</button>
      </Link>

      <Link to="/user/update/username">
        <button className="UserForm__button">Изменить имя</button>
      </Link>

      <Link to="/user/update/email">
        <button className="UserForm__button">Сменить почту</button>
      </Link>

      <Link to="/user/update/password">
        <button className="UserForm__button">Поменять пароль</button>
      </Link>

      <a href={REACT_APP_PLAY_URL}>
        <button className="UserForm__button--warning">Назад</button>
      </a>
    </center>
  );
};

export default UserInfo;
