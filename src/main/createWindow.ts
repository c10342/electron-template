// 创建窗口
import { shell, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";
import { is } from "@electron-toolkit/utils";
import { GlobalEventEnum } from "@share/enum";
import icon from "../../resources/icon.png?asset";
import { logError, logWarn } from "@share/log";

interface WindowOptions extends BrowserWindowConstructorOptions {
  showReady?: boolean;
  httpUrl?: string;
  fileUrl?: string;
  winName?: string;
}

export const winNameMap: Record<string, number> = {};

const defaultOptions: WindowOptions = {
  width: 1000,
  height: 700,
  show: false,
  autoHideMenuBar: true,
  ...(process.platform === "linux" ? { icon } : {}),
  showReady: true
};

const createWindow = (options?: WindowOptions) => {
  const config = {
    ...defaultOptions,
    ...(options ?? {})
  };
  const win = new BrowserWindow({
    ...config,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  if (!config.show && config.showReady) {
    win.on("ready-to-show", () => {
      win.show();
    });
  }
  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    //  {} 1 log 23 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 1 info 24 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 3 error 25 http://localhost:5173/window/index/components/folderItem.vue
    //  {} 2 warn 26 http://localhost:5173/window/index/components/folderItem.vue
    // 监听异常错误
    // 在浏览器中，如果遇见未知错误或者异常错误，都会在控制台中有输出
    if (level === 3) {
      logError("render-error", message, line, sourceId);
    } else if (level === 2) {
      logWarn("render-warn", message, line, sourceId);
    }
  });
  win.on("maximize", () => {
    win.webContents.send(GlobalEventEnum.Maximize);
  });
  win.on("minimize", () => {
    win.webContents.send(GlobalEventEnum.Minimize);
  });
  win.on("unmaximize", () => {
    win.webContents.send(GlobalEventEnum.Unmaximize);
  });
  if (options?.httpUrl) {
    win.loadURL(options.httpUrl);
  } else if (options?.fileUrl) {
    win.loadFile(options.fileUrl);
  } else if (options?.winName) {
    const devIp = process.env["ELECTRON_RENDERER_URL"];
    if (is.dev && devIp) {
      win.loadURL(`${devIp}/window/${options.winName}/index.html`);
    } else {
      win.loadFile(join(__dirname, `../renderer/window/${options.winName}/index.html`));
    }
  }
  return win;
};

export default createWindow;
