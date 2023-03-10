import "./index.scss";

import React from "react";
import { Link } from "react-router-dom";
import copy from "copy-to-clipboard";

import { toast } from "Common/components/Toastify";

import { useStore } from "Common/hooks/store";
import { useGetSocials } from "Common/apollo/Socials";
import { useGetUsersSocial } from "Common/apollo/UsersSocials";

const Social = ({ playerId }) => {
  const { store } = useStore();

  const { userId } = store;

  const { socials } = useGetSocials();
  const { usersSocial } = useGetUsersSocial({ userId: playerId });

  const handleCopy = (e) => {
    copy(window.location.href);

    e.target.className = "Location__copy--copyed";

    toast("Ссылка скопирована");
  };

  return (
    <div className="Social__content">
      <div className="Location__copy" onClick={handleCopy}>
        Скопировать ссылку профиля
      </div>

      <div className="Social_Link_wrapper">
        <div className="Social_Link_text">Социальные сети:</div>
        {usersSocial ? (
          <div className="Social_Link_sing">
            {socials
              ?.filter((item) => usersSocial[item.field])
              .map((soc, index) => (
                <div className="Social_Link_icon_wrapper" key={index}>
                  <div className="Social__imgWrapper">
                    <img
                      className="img-width100 socialImg"
                      src={
                        require(`Common/assets/svg/Social_media_icon/${soc.field}.svg`)
                          .default
                      }
                      alt=""
                      onClick={() =>
                        window.open(
                          `${soc.url}${usersSocial[soc.field]}`,
                          "_blank"
                        )
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="Social__text">
            В профиле пока не указана ни одна социальная сеть
          </div>
        )}
        {userId === playerId && (
          <div className="Social_Link_settingsLink">
            <Link to={`/settings/social`}>Настроить сети</Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
