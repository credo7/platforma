import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  const years = year === 2021 ? year : `2021-${year}`;
  return (
    <footer className="Footer">
      <div className="Footer__rightdAndMedia">
        <p className="Footer__rights">
          POWER GAMES © {years}. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
