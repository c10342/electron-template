import i18next from "i18next";
import { LangEnum } from "@share/enum";
import zhCN from "./modules/zh-CN";
import zhTW from "./modules/zh-TW";
import enUS from "./modules/en-US";
import { getStore, setStore } from "../store";
import { defaultLang } from "@share/config";

export const initI18n = () => {
  const lang = getStore("lang");
  i18next.init({
    lng: lang,
    fallbackLng: defaultLang as LangEnum,
    resources: {
      [LangEnum.ZhCN]: { translation: zhCN },
      [LangEnum.ZhTW]: { translation: zhTW },
      [LangEnum.EnUS]: { translation: enUS }
    }
  });
};

export const setLang = (lang: string): void => {
  i18next.changeLanguage(lang);
  setStore("lang", lang as LangEnum);
};

export const getLang = (): string => {
  return i18next.language;
};

export const t = (key: string): string => {
  return i18next.t(key);
};

export default i18next;
