import "./index.scss";

import React, { createRef } from "react";
import { useMutation } from "@apollo/client";

import {
  UPDATE_USER_IMAGE,
  UPDATE_USER_ROTATE,
  GET_USER,
} from "Common/graphql/Users";

import ProfileIcon from "Common/components/ProfileIcon";
import { useStore } from "Common/hooks/store";

import { BsArrowClockwise, BsCloudUpload } from "react-icons/bs";

import { storage } from "Common/services/functions";

const Image = () => {
  const { store } = useStore();

  const { user, userId } = store;

  const refetchQueriesUser = [{ query: GET_USER, variables: { userId } }];

  const [updateUserImage, { loading: loadingUserImage }] = useMutation(
    UPDATE_USER_IMAGE,
    {
      refetchQueries: refetchQueriesUser,
    }
  );

  const [updateUserRotate] = useMutation(UPDATE_USER_ROTATE, {
    refetchQueries: refetchQueriesUser,
  });

  const inputProfileAvatarRef = createRef();

  const onProfileAvatarChange = (e) => {
    inputProfileAvatarRef.current.click();
  };

  const onFileInputChange = (event) => {
    let file = event.target.files[0];

    if (file) {
      updateUserImage({
        variables: { userId, image: file, rotate: 0 },
        context: { hasUpload: true },
      });
    }
  };

  const onRotateAvatar = () => {
    let rotate = user?.rotate + 90;
    rotate >= 360 && (rotate = 0);

    updateUserRotate({ variables: { userId, rotate } });
  };

  return (
    <div className="IconEdit">
      <h2 align="center">Аватар</h2>
      <div className="IconEdit__icon">
        {loadingUserImage ? (
          <img
            className="loader"
            src={require("Common/assets/gif/Loader-spiner.gif").default}
            alt="Loading..."
          ></img>
        ) : (
          <ProfileIcon
            src={
              user?.image
                ? storage(user.image, "m")
                : require("Common/assets/png/ProfileIcon.png").default
            }
            rotate={user?.rotate}
            height={200}
            width={200}
          />
        )}
      </div>
      <div className="IconEdit__buttons">
        <BsCloudUpload size="2em" onClick={onProfileAvatarChange} />
        <BsArrowClockwise size="2em" onClick={onRotateAvatar} />

        <input
          className="IconEdit__input"
          type="file"
          ref={inputProfileAvatarRef}
          accept="image/*"
          onInput={onFileInputChange}
        />
      </div>
      <div>Размер меньше 1 Мб.</div>
    </div>
  );
};

export default Image;
