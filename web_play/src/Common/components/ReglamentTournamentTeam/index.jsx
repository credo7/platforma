import React from "react";

import "./index.scss";

const ReglamentTournamentTeam = ({ history }) => {
  return (
    <div className="ReglamentTournament">
      <div className="ReglamentTournament__wrapTitle">
        <span className="ReglamentTournament__title">РЕГЛАМЕНТ</span>
        <span className="ReglamentTournament__title_small">командная игра</span>
      </div>
      <div className="ReglamentTournament__wrapItem">
        <span className="ReglamentTournament__item">
          1. Все участники турнира, обязуются ознакомиться, согласиться и
          выполнять все правила турнира.
        </span>
        <span className="ReglamentTournament__item">
          1.1 Организаторы имеют право изменять, дополнять правила и расписание
          турнира.
        </span>
        <span className="ReglamentTournament__item">
          1.2 Организаторы имеют решающий голос в любых спорных ситуациях и
          конфликтах.
        </span>
        <span className="ReglamentTournament__item">
          1.3 ID и PASSWORD игровых лобби, любого из этапов турнира, запрещается
          передавать третьим лицам.
        </span>
        <span className="ReglamentTournament__item">
          1.4 Для участия в турнире хозяин команды должен нажать кнопку
          «Участвовать».
        </span>
        <span className="ReglamentTournament__item">
          1.5 Участие в турнире могут принимать только те игроки, которые
          находятся в составе команды.
        </span>
        <span className="ReglamentTournament__item">
          1.6 ID и PASSWORD игрового лобби публикуются на странице турнира во
          вкладке «Лобби», которая появляется после окончания регистрации на
          турнир.
        </span>
        <span className="ReglamentTournament__item">
          1.7 Каждый игрок обязан вести видеофиксацию всех игр, проходящих в
          рамках турнира. Команда обязана фиксировать на аудиодорожке все
          переговоры между игроками.
        </span>
        <span className="ReglamentTournament__item">
          1.8 Все спорные моменты в игре решаются организаторами на их личное
          усмотрение , также они в праве попросить запись игры для принятия
          максимально правильного решения.
        </span>
        <span className="ReglamentTournament__item">
          1.9 После окончания турнира, призовое вознаграждение получает хозяин
          команды и самостоятельно распределяет сумму выигрыша между игроками
          команды по своему усмотрению в зависимости от уровня игры того или
          иного игрока.
        </span>
        <div className="ReglamentTournament__wrapTitle">
          <span className="ReglamentTournament__title">ЗАПРЕЩЕНО:</span>
        </div>
        <span className="ReglamentTournament__item">
          2.1 Использование: любых эмуляторов, планшетов.
        </span>
        <span className="ReglamentTournament__item">
          2.2 Занимать чужой слот в игровом лобби, а также слоты наблюдателей.
        </span>
        <span className="ReglamentTournament__item">
          2.3 Приглашать в игровое лобби незарегистрированного игрока.
        </span>
        <span className="ReglamentTournament__item">
          2.4 Использовать баги или ошибки игры.
        </span>
        <span className="ReglamentTournament__item">
          2.5 Договариваться между командами о совместной игре на турнире.
        </span>
        <span className="ReglamentTournament__item">
          2.6 Оскорблять или унижать, участников и организаторов турнира в любой
          форме.
        </span>
        <span className="ReglamentTournament__item">
          2.7 Бездействовать во время игры на протяжении двух минут.
        </span>
        <span className="ReglamentTournament__item">
          2.8 Выставлять в рамках, игровых аватарках, в описании которых
          перечислены следующие посылы: порнография, расизм, призыв к насилию,
          нецензурные слова, оскорбление любой религии.
        </span>
        <span
          className="ReglamentTournament__item"
          style={{ fontWeight: "bold" }}
        >
          За однократное нарушение любого из пунктов 2.1 - 2.8, снятие с
          турнира!
        </span>
        <span
          className="ReglamentTournament__item"
          style={{ fontWeight: "bold" }}
        >
          За повторное нарушение любого из пунктов в настоящем или последующих
          турнирах - бан на платформе!
        </span>
      </div>
      <div
        className="ReglamentTournament__GoBack"
        onClick={() => history.goBack()}
      >
        Ознакомлен
      </div>
    </div>
  );
};

export default ReglamentTournamentTeam;
