import i18n from "@renderer/locales";
import log from "./logger";
import { GlobalEventEnum, LangEnum } from "@share/enum";
import { DefineComponent, createApp as createVueApp } from "vue";
import "../assets/styles/index.scss";

export const createApp = async (App: DefineComponent<any, any, any>) => {
  const app = createVueApp(App);

  const savedLocale = await window.electronAPI.getStore("locale");
  if (savedLocale && savedLocale !== i18n.global.locale.value) {
    i18n.global.locale.value = savedLocale;
  }
  app.use(i18n);

  app.config.errorHandler = (err, _instance, info) => {
    log.error("[Vue ErrorHandler]", err, info);
  };
  window.addEventListener("error", (event) => {
    log.error("[Uncaught Error]", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    log.error("[Unhandled Rejection]", event.reason);
  });
  window.electronAPI.ipcOn(GlobalEventEnum.LocaleChanged, (_, locale: string) => {
    i18n.global.locale.value = locale as LangEnum;
  });

  return app;
};
