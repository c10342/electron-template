import i18next from "i18next";
import { LangEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";
import { getStore, setStore } from "./store";
import { defaultLang } from "@share/config";

export const initI18n = () => {
  const savedLocale = getStore("locale");
  i18next.init({
    lng: savedLocale,
    fallbackLng: defaultLang as LangEnum,
    resources: {
      [LangEnum.ZhCN]: { translation: zhCN },
      [LangEnum.ZhTW]: { translation: zhTW },
      [LangEnum.En]: { translation: en }
    }
  });
};

export const setLocale = (locale: string): void => {
  i18next.changeLanguage(locale);
  setStore("locale", locale as LangEnum);
};

export const getLocale = (): string => {
  return i18next.language;
};

export const t = (key: string): string => {
  return i18next.t(key);
};

export default i18next;
