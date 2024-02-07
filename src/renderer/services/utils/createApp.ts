import "@renderer/assets/style/index.scss";
import { DefineComponent, createApp, Plugin } from "vue";

const initApp = (App: DefineComponent<any, any, any>, plugins: Plugin<[]>[] = []) => {
  const app = createApp(App);
  plugins.forEach((plugin) => app.use(plugin));

  return app.mount("#app");
};

export default initApp;
