import "./index.scss";

import React from "react";

const { REACT_APP_AUTH_WEB } = process.env;

const EmailVerify = () => {
  return (
    <div className="massageWrap">
      <div className="messageText">Почта не подтверждена</div>
      <a
        className="commonBtn EmailVerify__btn"
        href={`${REACT_APP_AUTH_WEB}/user/email`}
      >
        Подтвердить
      </a>
    </div>
  );
};

export default EmailVerify;
