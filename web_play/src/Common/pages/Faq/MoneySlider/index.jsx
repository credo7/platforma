import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel"; /* https://www.npmjs.com/package/react-responsive-carousel */
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "./index.scss";

import imgMoney_1 from "Common/assets/png/FAQ/Money/money_01.png";
import imgMoney_2 from "Common/assets/png/FAQ/Money/money_02.png";
import imgMoney_3 from "Common/assets/png/FAQ/Money/money_03.png";
import imgMoney_4 from "Common/assets/png/FAQ/Money/money_04.png";
import imgMoney_5 from "Common/assets/png/FAQ/Money/money_05.png";
import imgMoney_6 from "Common/assets/png/FAQ/Money/money_06.png";
import imgMoney_7 from "Common/assets/png/FAQ/Money/money_07.png";
import imgMoney_8 from "Common/assets/png/FAQ/Money/money_08.png";

const MoneySlider = () => {
  return (
    <div id="faqMoney" className="faqQuestion">
      <div className="faqQuestion__title">Как вывести денежный выигрыш?</div>

      <div className="wrapCarousel">
        <Carousel showThumbs={false}>
          <div>
            <img src={imgMoney_1} alt="imgMoney_1" />
            <p className="legend">В главном меню выбрать "Кошелек"</p>
          </div>

          <div>
            <img src={imgMoney_2} alt="imgMoney_2" />
            <p className="legend">Подтвердить доступ своим паролем</p>
          </div>

          <div>
            <img src={imgMoney_3} alt="imgMoney_3" />
            <p className="legend">Нажать кнопку "Способ вывода"</p>
          </div>

          <div>
            <img src={imgMoney_4} alt="imgMoney_4" />
            <p className="legend">
              Указать способ вывода денег, нажать кнопку "Сохранить" и вернуться
              назад
            </p>
          </div>

          <div>
            <img src={imgMoney_5} alt="imgMoney_5" />
            <p className="legend">Нажать кнопку "Снять средства"</p>
          </div>

          <div>
            <img src={imgMoney_6} alt="imgMoney_6" />
            <p className="legend">
              Нажать кнопку "Снять все". После этого запрос поступит модераторам
              и в течение суток средства будут переведены указанным способом
              вывода.
            </p>
          </div>

          <div>
            <img src={imgMoney_7} alt="imgMoney_7" />
            <p className="legend">Нажать кнопку "Назад"</p>
          </div>

          <div>
            <img src={imgMoney_8} alt="imgMoney_8" />
            <p className="legend">
              Все поступления и снятия будут отображены на странице транзакций.
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

export default MoneySlider;
