import { createI18n, I18n } from "vue-i18n";
import { LangEnum } from "@share/enum";
import zhCN from "./modules/zh-CN";
import zhTW from "./modules/zh-TW";
import enUS from "./modules/en-US";
import { defaultLang } from "@share/config";

const messages = {
  [LangEnum.ZhCN]: zhCN,
  [LangEnum.ZhTW]: zhTW,
  [LangEnum.EnUS]: enUS
};
let i18n: I18n<
  typeof messages,
  Record<string, string>,
  Record<string, string>,
  string,
  false
> | null;

export const initI18n = async () => {
  const lang = await window.electronAPI.getLang();
  i18n = createI18n({
    legacy: false,
    locale: lang,
    fallbackLocale: defaultLang,
    messages: messages
  });

  window.electronAPI.onLangChange((lang: string) => {
    if (!i18n) return;
    i18n.global.locale.value = lang;
  });

  return i18n;
};

export const changeLang = (lang: string) => {
  // 先通知主进程，主进程广播给所有窗口
  if (lang !== i18n?.global.locale.value) {
    window.electronAPI.setLang(lang);
  }
};
