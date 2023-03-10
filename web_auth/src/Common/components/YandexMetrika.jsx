import React from "react";
import { YMInitializer } from "react-yandex-metrika";

const { REACT_APP_YANDEX_METRIKA, NODE_ENV } = process?.env;

const DEV = NODE_ENV !== "production";

const YandexMetrika = () => {
  return (
    !DEV &&
    REACT_APP_YANDEX_METRIKA && (
      <YMInitializer
        accounts={[REACT_APP_YANDEX_METRIKA]}
        options={{ webvisor: true }}
      />
    )
  );
};

export default YandexMetrika;
