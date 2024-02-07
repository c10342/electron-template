import { GlobalEventEnum } from "@share/enum";
import { onBeforeUnmount } from "vue";

export const useEventHook = (name: GlobalEventEnum, action: (...args: any) => any) => {
  window.api.on(name, action);
  onBeforeUnmount(() => {
    window.api.off(name, action);
  });
};
