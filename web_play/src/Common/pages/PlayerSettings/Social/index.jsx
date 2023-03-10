import "./index.scss";

import React, { useEffect } from "react";
import { useFormik } from "formik";

import { useStore } from "Common/hooks/store";

import { toast } from "Common/components/Toastify";

import {
  useGetUsersSocial,
  useMergeUsersSocial,
} from "Common/apollo/UsersSocials";
import { useGetSocials } from "Common/apollo/Socials";

const initialValues = {
  vk: "",
  twitch: "",
  facebook: "",
  instagram: "",
  discord: "",
  youtube: "",
};

const Social = () => {
  const { store } = useStore();

  const { userId } = store;

  const { socials } = useGetSocials();
  const { usersSocial } = useGetUsersSocial({ userId });
  const { mergeUsersSocial, mergedUsersSocial } = useMergeUsersSocial();

  let linkSocials = {};
  socials?.forEach(({ field, url }) => {
    linkSocials = { ...linkSocials, [field]: url };
  });

  const onSubmit = (data) => {
    mergeUsersSocial({ userId, usersSocial, newUsersSocial: data });
  };

  const { handleSubmit, handleChange, values, setValues } = useFormik({
    initialValues,
    onSubmit,
  });

  useEffect(() => {
    usersSocial && setValues((prev) => ({ ...prev, ...usersSocial }));
  }, [usersSocial, setValues]);

  useEffect(() => {
    mergedUsersSocial && toast("Сохранено");
  }, [mergedUsersSocial]);

  return (
    <div className="Settings__content--smollerMarginTop">
      <form id="socialForm" onSubmit={handleSubmit}>
        <h2 align="center">Социальные сети</h2>
        <p className="Settings__sign">
          <a
            href={`${linkSocials["vk"]}${values.vk}`}
            target="_blank"
            rel="noreferrer"
          >
            VK:
          </a>
        </p>
        <input
          name="vk"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="id00"
          onChange={handleChange}
          value={values.vk}
        />

        <p className="Settings__sign">
          <a
            href={`${linkSocials["twitch"]}${values.twitch}`}
            target="_blank"
            rel="noreferrer"
          >
            Twitch:
          </a>
        </p>
        <input
          name="twitch"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="chanel"
          onChange={handleChange}
          value={values.twitch}
        />

        <p className="Settings__sign">
          <a
            href={`${linkSocials["facebook"]}${values.facebook}`}
            target="_blank"
            rel="noreferrer"
          >
            Facebook:
          </a>
        </p>
        <input
          name="facebook"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="name"
          onChange={handleChange}
          value={values.facebook}
        />

        <p className="Settings__sign">
          <a
            href={`${linkSocials["discord"]}${values.discord}`}
            target="_blank"
            rel="noreferrer"
          >
            Discord:
          </a>
        </p>
        <input
          name="discord"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="nick#0000"
          onChange={handleChange}
          value={values.discord}
        />

        <p className="Settings__sign">
          <a
            href={`${linkSocials["instagram"]}${values.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram:
          </a>
        </p>
        <input
          name="instagram"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="chanel"
          onChange={handleChange}
          value={values.instagram}
        />

        {/* --- нет иконки youtube - добавить ---*/}
        {/* <p className="Settings__sign">
          <a
            href={`${linkSocials["youtube"]}${values.youtube}`}
            target="_blank"
            rel="noreferrer"
          >
            Youtube:
          </a>
        </p>
        <input
          name="youtube"
          type="text"
          className="Settings__input--higherMarginBottom"
          placeholder="chanel"
          onChange={handleChange}
          value={values.youtube}
        /> */}

        {userId && (
          <button className="Settings__button--withMargenTop" type="submit">
            Сохранить изменения
          </button>
        )}
      </form>
    </div>
  );
};

export default Social;
