import { app, BrowserWindow } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { createWindow } from "./services/window";
import { initLog } from "./services/log";
import { initStore } from "./services/store";
import { initBridge } from "./services/bridge";
import { initMonitor } from "./services/monitor";
import { initTray } from "./services/tray";
import { setLang } from "./locale";
import { LangEnum } from "@share/enum";
import { initUpdate } from "./services/update";

//   取消警告
//   Render process output: 2-%cElectron Security Warning (Insecure Content-Security-Policy) font-weight: bold; This renderer process has either no Content Security
//   Policy set or a policy with "unsafe-eval" enabled. This exposes users of
//   this app to unnecessary security risks.
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const closeApp = () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
};

// 初始化应用
function init() {
  // 开机自动启动
  // app.setLoginItemSettings({
  //   openAtLogin: true
  // });
  // 日志
  initLog();
  // 全局状态
  const store = initStore({ name: "test" });
  // JsBridge，渲染进程和主进程的通信桥梁
  initBridge();
  // 错误监控
  initMonitor();
  // 托盘
  initTray();
  // 设置语言
  setLang(store.get("lang") as LangEnum);
  // 主窗口
  const mainWin = createWindow({
    minWidth: 1000,
    minHeight: 700,
    winName: "index"
  });
  mainWin.on("closed", closeApp);
  initUpdate();
  // checkUpdate().catch(logError);
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  init();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) init();
  });
});

app.on("window-all-closed", closeApp);
