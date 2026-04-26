import { initI18n } from "@renderer/locales";
import log, { initLogger } from "./logger";
import { DefineComponent, createApp as createVueApp } from "vue";
import { createPinia } from "pinia";
import "../assets/styles/index.scss";
import { useAppStore } from "@renderer/stores";

export const createApp = async (App: DefineComponent<any, any, any>) => {
  initLogger();
  const app = createVueApp(App);

  const pinia = createPinia();
  app.use(pinia);
  await useAppStore().initAppInfo();

  const i18n = await initI18n();
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

  return app;
};
