import React from "react";
import { YMInitializer } from "react-yandex-metrika";

const DEV = process.env.NODE_ENV !== "production";

const YandexMetrika = () => {
  return (
    <>
      {!DEV && (
        <YMInitializer
          accounts={[process.env.REACT_APP_YANDEX_METRIKA]}
          options={{ webvisor: true }}
        />
      )}
    </>
  );
};

export default YandexMetrika;
