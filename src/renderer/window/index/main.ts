import initApp from "@renderer/services/app";
import App from "./App.vue";

const render = async () => {
  initApp(App);
};

render();
