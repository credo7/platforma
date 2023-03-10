import React from "react";

import "./index.scss";

function BigLogo({ size }) {
  return (
    <div className="BigLogo">
      <figure className="BigLogo__figure">
        <div className="BigLogo__imgWraper" style={size ? { size } : {}}>
          <img
            className="BigLogo__img"
            src={require("Common/assets/svg/General/EZ_Big_Logo.svg").default}
            alt="Логотип"
          />
        </div>
      </figure>
    </div>
  );
}

export default BigLogo;
