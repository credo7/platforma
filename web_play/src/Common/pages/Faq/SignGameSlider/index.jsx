import "./index.scss";

import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; /* https://www.npmjs.com/package/react-responsive-carousel */
import "react-responsive-carousel/lib/styles/carousel.min.css";

import imgGameSign_0 from "Common/assets/png/FAQ/gameSign/gameSign_0.png";
import imgGameSign_1 from "Common/assets/png/FAQ/gameSign/gameSign_1.png";
import imgGameSign_2 from "Common/assets/png/FAQ/gameSign/gameSign_2.png";
import imgGameSign_3 from "Common/assets/png/FAQ/gameSign/gameSign_3.png";

const SignGameSlider = () => {
  return (
    <div id="faqTournament" className="faqQuestion">
      <div className="faqQuestion__title">Как привязать игру PUBG Mobile?</div>

      <div className="wrapCarousel">
        <Carousel showThumbs={false}>
          <div className="element">
            {/* <div className="indicator menu" />
            <div className="window">
              <iframe
                title="signGame"
                src={`${window.location.origin}`}
                // width="100px"
                height="400px"
                style={{
                  pointerEvents: "none",
                }}
              ></iframe>
            </div> */}
            <img src={imgGameSign_0} alt="imgGameSign_0" />
            <div className="legenda">
              Чтобы подключить игру необходимо зайти в главное меню
            </div>
          </div>
          <div>
            <img src={imgGameSign_1} alt="imgGameSign_1" />
            <p className="legend"> Перейти в настройки</p>
          </div>
          <div>
            <img src={imgGameSign_2} alt="imgGameSign_2" />
            <p className="legend"> Перейти на вкладку "Привязка игр"</p>
          </div>
          <div>
            <img src={imgGameSign_3} alt="imgGameSign_3" />
            <p className="legend">
              {/* Вписать в поле свой действующий НИК в игре PUBG Mobile <br /> */}
              ВАЖНО! <br />
              Нужно указывать именно тот ник, который используется в игре PUBG
              Mobile. Если Ник указан отличный от Ника игры, результат
              проведенного турнира не отобразится."
            </p>
          </div>
        </Carousel>
      </div>
      <Link className="faqQuestion__linkGoBack" to="/FAQ">
        Вернуться
      </Link>
    </div>
  );
};

export default SignGameSlider;
