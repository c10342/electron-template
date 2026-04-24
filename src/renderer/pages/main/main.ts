import App from "./App.vue";
import { createApp } from "@renderer/utils";

createApp(App).then((app) => {
  app.mount("#app");
});
