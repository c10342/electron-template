import { onBeforeUnmount } from "vue";
import { GlobalEventEnum } from "@share/enum";
import { useI18n } from "vue-i18n";
import { messages } from "@renderer/locale";

/**
 * 拖拽窗口
 * @returns
 */
export const useDragWin = () => {
  let moveIng = false;
  let startX = 0;
  let startY = 0;

  const onMousemove = (event: MouseEvent) => {
    if (!moveIng) return;
    const x = window.screenX + event.clientX - startX;
    const y = window.screenY + event.clientY - startY;
    window.api.setWinPosition({ x, y });
  };

  const onMouseup = () => {
    if (!moveIng) return;
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("mouseup", onMouseup);
    moveIng = false;
  };

  const onMousedown = (event: MouseEvent) => {
    moveIng = true;
    startX = event.clientX;
    startY = event.clientY;
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
  };

  onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onMousemove);
    document.removeEventListener("mouseup", onMouseup);
  });

  return { onMousedown };
};

/**
 * vue文件中使用，用于监听全局的事件
 * @param name 事件名
 * @param action 回调函数
 */
export const useEventHook = (name: GlobalEventEnum, action: (...args: any) => any) => {
  window.api.on(name, action);
  onBeforeUnmount(() => {
    window.api.off(name, action);
  });
};

export const useLocale = () => {
  return useI18n<{ messages: typeof messages }>();
};
