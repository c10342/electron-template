import i18n from "@renderer/locales";
import log, { initLogger } from "./logger";
import { GlobalEventEnum, LangEnum } from "@share/enum";
import { DefineComponent, createApp as createVueApp } from "vue";
import { createPinia } from "pinia";
import "../assets/styles/index.scss";
import { useAppStore } from "@renderer/stores";

const updateLocale = (lang: string) => {
  if (lang && lang !== i18n.global.locale.value) {
    i18n.global.locale.value = lang as LangEnum;
  }
};

export const createApp = async (App: DefineComponent<any, any, any>) => {
  initLogger();
  const app = createVueApp(App);

  const pinia = createPinia();
  app.use(pinia);
  await useAppStore().initAppInfo();

  const savedLocale = await window.electronAPI.getStore("locale");
  updateLocale(savedLocale);
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
    updateLocale(locale);
  });

  return app;
};
