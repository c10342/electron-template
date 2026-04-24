import { createI18n } from "vue-i18n";
import { LangEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";
import { defaultLang } from "@share/config";

const i18n = createI18n({
  legacy: false,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages: {
    [LangEnum.ZhCN]: zhCN,
    [LangEnum.ZhTW]: zhTW,
    [LangEnum.En]: en
  }
});

export const changeLang = (lang: string) => {
  // 先通知主进程，主进程广播给所有窗口
  // src\renderer\utils\createApp.ts 已经做了监听了
  window.electronAPI.setLocale(lang);
};

export default i18n;
