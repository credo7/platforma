import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; /* https://www.npmjs.com/package/react-responsive-carousel */
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./index.scss";

import imgLeaveTeam_0 from "Common/assets/png/FAQ/leaveTeam/leave_team_0.png";
import imgLeaveTeam_1 from "Common/assets/png/FAQ/leaveTeam/leave_team_1.png";
import imgLeaveTeam_2 from "Common/assets/png/FAQ/leaveTeam/leave_team_2.png";
import imgLeaveTeam_3 from "Common/assets/png/FAQ/leaveTeam/leave_team_3.png";

const LeaveTeamSlider = () => {
  return (
    <div id="faqMoney" className="faqQuestion">
      <div className="faqQuestion__title">Как выйти из команды?</div>

      <div className="wrapCarousel">
        <Carousel showThumbs={false}>
          <div>
            <img src={imgLeaveTeam_0} alt="imgLeaveTeam_0" />
            <p className="legend">Зайти в главное меню</p>
          </div>
          <div>
            <img src={imgLeaveTeam_1} alt="imgLeaveTeam_1" />
            <p className="legend">Перейти в свой профиль</p>
          </div>
          <div>
            <img src={imgLeaveTeam_2} alt="imgLeaveTeam_2" />
            <p className="legend">
              Нажать на название команды, в которой играешь
            </p>
          </div>
          <div>
            <img src={imgLeaveTeam_3} alt="imgLeaveTeam_3" />
            <p className="legend">
              На карточке твоего игрока будет кнопка, после нажатия на которую
              откроется окно с просьбой подтвердить удаление из команды. После
              подтверждения ты удалишься из этой команды.
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

export default LeaveTeamSlider;
