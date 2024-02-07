import initApp from "@renderer/services/utils/createApp";
import App from "./App.vue";

const render = async () => {
  initApp(App);
};

render();
