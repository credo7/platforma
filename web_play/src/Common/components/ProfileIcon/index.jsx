import "./index.scss";

import React from "react";
import AvatarEditor from "react-avatar-editor";

function ProfileIcon({ src, rotate, width, height }) {
  return (
    <div className="ProfileIcon">
      {/* <img
        className="ProfileIcon__img"
        // src={require("Common/assets/png/ProfileIcon.png")}
        src={src}
        alt="Фото профиля"
      /> */}
      <AvatarEditor
        className="ProfileIcon__img"
        image={src}
        width={width}
        height={height}
        border={0}
        color={[255, 255, 255, 0.6]} // RGBA
        scale={1.2}
        rotate={rotate}
      />
    </div>
  );
}

export default ProfileIcon;
