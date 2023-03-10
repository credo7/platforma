import React from "react";

import "./index.scss";

function SearchInput({ placeholder }) {
  return (
    <div className="SearchInput">
      <figure className="SearchInput__figure">
        <div className="SearchInput__imgWrapper">
          <img
            className="img-width100"
            src={require("Common/assets/svg/General/Search.svg").default}
            alt="Поиск"
          />
        </div>
        <p className="SearchInput__imgWrapper__text">Поиск</p>
      </figure>
      <input className="SearchInput__input" placeholder={placeholder} />
    </div>
  );
}

export default SearchInput;
