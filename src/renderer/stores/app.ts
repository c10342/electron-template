import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const appVersion = ref<string>("");
  const platform = ref<string>("");

  const initAppInfo = async () => {
    appVersion.value = await window.electronAPI.getAppVersion();
    platform.value = await window.electronAPI.getPlatform();
  };

  return {
    appVersion,
    platform,
    initAppInfo
  };
});
