import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { join } from "path";

import { app } from "electron";
import { store } from "../services/store";
import { LangEnum } from "@share/enum";

export const initI18n = async () => {
  const systemLanguage = app.getLocale();
  const language = store.get("lang", systemLanguage);
  await i18n.use(Backend).init({
    lng: language,
    fallbackLng: LangEnum.ZhCN,
    backend: {
      loadPath: join(__dirname, `/resources/{{lng}}.js`)
    }
  });
};

export const setLang = i18n.changeLanguage;

export const getLang = () => {
  return i18n.language;
};

export const getLangText = i18n.t;
