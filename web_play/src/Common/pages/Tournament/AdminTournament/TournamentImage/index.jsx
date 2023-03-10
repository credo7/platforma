import "./index.scss";

import React, { createRef } from "react";
import { useMutation } from "@apollo/client";
import { BsCloudUpload } from "react-icons/bs";

import {
  UPDATE_TOURNAMENT_IMAGE,
  GET_TOURNAMENT,
} from "Common/graphql/Tournaments";

import ProfileIcon from "Common/components/ProfileIcon";

import { useStore } from "Common/hooks/store";

import { storage } from "Common/services/functions";

const TournamentImage = ({ tournament }) => {
  const { store } = useStore();

  // const { user, userId } = store;
  const tournamentId = tournament.id;

  const [updateTournamentImage] = useMutation(UPDATE_TOURNAMENT_IMAGE, {
    refetchQueries: [{ query: GET_TOURNAMENT, variables: { tournamentId } }],
  });

  const inputImage = createRef();

  const onImageChange = (e) => {
    inputImage.current.click();
  };

  const onFileInputChange = (event) => {
    let file = event.target.files[0];

    if (file && tournament) {
      updateTournamentImage({
        variables: { tournamentId, image: file },
      });
    }
  };

  return !tournament ? (
    <>Постер можно загрузить после создания...</>
  ) : (
    <>
      <hr />
      <div className="IconEdit">
        <div className="IconEdit__icon1">
          <ProfileIcon
            src={tournament.image ? storage(tournament.image, "m") : ""}
            width={200}
            height={100}
          />
          <div className="IconEdit__buttons">
            <BsCloudUpload size="2em" onClick={onImageChange} />
          </div>
        </div>
      </div>

      <input
        className="IconEdit__input"
        type="file"
        ref={inputImage}
        accept="image/*"
        onInput={onFileInputChange}
      />
      <div>Размер меньше 1 Мб.</div>
    </>
  );
};

export default TournamentImage;
