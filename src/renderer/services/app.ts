import "@renderer/assets/style/index.scss";
import { DefineComponent, createApp, Plugin } from "vue";

// 初始化vue实例
const initApp = (App: DefineComponent<any, any, any>, plugins: Plugin<[]>[] = []) => {
  const app = createApp(App);
  plugins.forEach((plugin) => app.use(plugin));

  return app.mount("#app");
};

export default initApp;
