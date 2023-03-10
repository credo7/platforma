import React from "react";
// import { Link } from "react-router-dom";

import "./index.scss";

const Footer = () => {
  const year = new Date().getFullYear();
  const years = year === 2021 ? year : `2021-${year}`;
  return (
    <footer className="Footer">
      {/* <div className="Footer__info">
        <Link to="/about" className="Footer__link">
          О нас
        </Link>
        <Link to="/support" className="Footer__link">
          Поддержка
        </Link>
        <Link className="Footer__link" id="privacyPolicy" to="/auth/tearms">
          Политика конфиденциальности
        </Link>
        <Link className="Footer__link" to="/FAQ">
          FAQ
        </Link>
      </div> */}
      <div className="Footer__rightdAndMedia">
        <p className="Footer__rights">
          POWER GAMES © {years}. All rights reserved
        </p>
        {/*  <div className="Footer__mediaWraper">
          <div className="Footer__mediaIcon">
            <a href="https://vk.com/egplbrawlstars" target="_blank" rel="noopener noreferrer">
              <img src={require('Common/assets/svg/Social_media_icon/vk.svg')} alt="VK" />
            </a>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
