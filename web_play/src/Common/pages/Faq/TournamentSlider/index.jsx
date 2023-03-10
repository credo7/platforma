import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; /* https://www.npmjs.com/package/react-responsive-carousel */
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./index.scss";

import imgGameTournament_0 from "Common/assets/png/FAQ/Tournament/Tournament_0.png";
import imgGameTournament_1 from "Common/assets/png/FAQ/Tournament/Tournament_1.png";
import imgGameTournament_2 from "Common/assets/png/FAQ/Tournament/Tournament_2.png";
import imgGameTournament_4 from "Common/assets/png/FAQ/Tournament/Tournament_3.png";
import imgGameTournament_7 from "Common/assets/png/FAQ/Tournament/Tournament_4.png";
import imgGameTournament_8 from "Common/assets/png/FAQ/Tournament/Tournament_5.png";

const TournamentSlider = () => {
  return (
    <div id="faqTournament" className="faqQuestion">
      <div className="faqQuestion__title">Как участвовать в турнире?</div>

      <div className="wrapCarousel">
        <Carousel showThumbs={false}>
          <div>
            <img src={imgGameTournament_0} alt="imgGameTournament_0" />
            <p className="legend">
              На главной странице в карточке турнира нажать кнопку "Подробнее"
            </p>
          </div>
          <div>
            <img src={imgGameTournament_1} alt="imgGameTournament_1" />
            <p className="legend">
              ИЛИ <br />
              Находясь во вкладке "Турниры", в карточке турнира нажать кнопку
              "Подробнее"
            </p>
          </div>
          <div>
            <img src={imgGameTournament_2} alt="imgGameTournament_2" />
            <p className="legend">
              Если регистрация на турнир открыта, в правом верхнем углу
              появляется кнопка УЧАСТВОВАТЬ{" "}
            </p>
          </div>

          <div>
            <img src={imgGameTournament_4} alt="imgGameTournament_3" />
            <p className="legend">
              После нажатия кнопки УЧАСТВОВАТЬ твоя карточка игрока отобразится
              в списке участников турнира.
            </p>
          </div>
          <div>
            <img src={imgGameTournament_7} alt="imgGameTournament_4" />
            <p className="legend">
              В момент начала турнира появится вкладка ЛОББИ, на которой будет
              информация о имени или id, а также о пароле игрового лобби. В игре
              необходимо найти указанное лобби по имени или id и ввести пароль.
            </p>
          </div>
          <div>
            <img src={imgGameTournament_8} alt="imgGameTournament_5" />
            <p className="legend">
              {" "}
              После окончания турнира вкладка Участники изменится на ИТОГИ.{" "}
              <br />В ней будет отображена информация о результатах турнира.{" "}
            </p>
          </div>
        </Carousel>
      </div>
      <Link className="faqQuestion__linkGoBack" to="/faq">
        Вернуться
      </Link>
    </div>
  );
};

export default TournamentSlider;
