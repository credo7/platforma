import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; /* https://www.npmjs.com/package/react-responsive-carousel */
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./index.scss";

import imgTeam_0 from "Common/assets/png/FAQ/Team/team_0.png";
import imgTeam_1 from "Common/assets/png/FAQ/Team/team_1.png";
import imgTeam_2 from "Common/assets/png/FAQ/Team/team_2.png";
import imgTeam_3 from "Common/assets/png/FAQ/Team/team_3.png";
import imgTeam_4 from "Common/assets/png/FAQ/Team/team_4.png";
import imgTeam_5 from "Common/assets/png/FAQ/Team/team_5.png";
import imgTeam_6 from "Common/assets/png/FAQ/Team/team_6.png";
import imgTeam_7 from "Common/assets/png/FAQ/Team/team_7.png";
import imgTeam_8 from "Common/assets/png/FAQ/Team/team_8.png";
import imgTeam_9 from "Common/assets/png/FAQ/Team/team_9.png";
import imgTeam_10 from "Common/assets/png/FAQ/Team/team_10.png";
import imgTeam_11 from "Common/assets/png/FAQ/Team/team_11.png";
import imgTeam_12 from "Common/assets/png/FAQ/Team/team_12.png";

const TournamentSlider = () => {
  return (
    <div id="faqTournament" className="faqQuestion">
      <div className="faqQuestion__title">Как создать свою команду?</div>

      <div className="wrapCarousel">
        <Carousel showThumbs={false}>
          <div>
            <img src={imgTeam_0} alt="imgTeam_0" />
            <p className="legend">Зайти в главное меню</p>
          </div>
          <div>
            <img src={imgTeam_1} alt="imgTeam_1" />
            <p className="legend">Нажать "Моя команда"</p>
          </div>
          <div>
            <img src={imgTeam_2} alt="imgTeam_2" />
            <p className="legend">Загрузить аватарку команды</p>
          </div>
          <div>
            <img src={imgTeam_3} alt="imgTeam_3" />
            <p className="legend">
              Заполнить поля и нажать кнопку "Создать команду"
            </p>
          </div>
          <div>
            <img src={imgTeam_4} alt="imgTeam_4" />
            <p className="legend">
              Чтобы добавить в команду игроков надо перейти на вкладку "Собрать
              команду". В свою команду можно вступить и самому, для этого надо
              нажать кнопку "Вступить команду".
            </p>
          </div>
          <div>
            <img src={imgTeam_5} alt="imgTeam_5" />
            <p className="legend">
              В команду можно пригласить друзей, которые не состоят ни в одной
              команде. Чтобы отправить приглашение надо нажать на кнопку в
              карточке друга.
            </p>
          </div>
          <div>
            <img src={imgTeam_6} alt="imgTeam_6" />
            <p className="legend">
              После отправки приглашения карточка друга переместится в раздел
              "Приглашенные". Теперь друг должен подтвердить, что он хочет быть
              в этой команде.
            </p>
          </div>
          <div>
            <img src={imgTeam_7} alt="imgTeam_7" />
            <p className="legend">
              Когда друг подтвердит приглашение он зачисляется в состав, и его
              карточка отобразится на квладке "Состав команды".
            </p>
          </div>
          <div>
            <img src={imgTeam_8} alt="imgTeam_8" />
            <p className="legend">
              Теперь на вкладке "Информация" можно выбрать капитана команды.
            </p>
          </div>
          <div>
            <img src={imgTeam_9} alt="imgTeam_9" />
            <p className="legend">
              Когда капитан выбран, у него на карточке отображается значок CAP.
            </p>
          </div>
          <div>
            <img src={imgTeam_10} alt="imgTeam_10" />
            <p className="legend">
              Чтобы удалить игрока из команды нужно нажать крестик в карточке
              этого игрока.
            </p>
          </div>
          <div>
            <img src={imgTeam_11} alt="imgTeam_11" />
            <p className="legend">
              Чтобы посмотреть профиль команды, в главном меню нужно нажать на
              название своей команды.
            </p>
          </div>
          <div>
            <img src={imgTeam_12} alt="imgTeam_12" />
            <p className="legend">
              При необходимости данные команды и ее состав можно редактировать.
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
