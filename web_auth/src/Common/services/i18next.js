import localeEN from "Common/locales/en.json";
import localeRU from "Common/locales/ru.json";

import i18next from "i18next";

i18next.init({
  debug: false,
  interpolation: { escapeValue: false },
  lng: "ru",
  resources: {
    en: localeEN,
    ru: localeRU,
  },
});

export default i18next;
