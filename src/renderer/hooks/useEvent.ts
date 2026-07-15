import { onBeforeUnmount } from "vue";

export const useIpcEvent = (action: () => any) => {
  const remove = action();
  onBeforeUnmount(() => {
    remove();
  });
};

export const useWindowEvent = (event: keyof WindowEventMap, listener: (...args: any[]) => any) => {
  window.addEventListener(event, listener);
  onBeforeUnmount(() => {
    window.removeEventListener(event, listener);
  });
};
