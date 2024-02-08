import { app, BrowserWindow } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { createWindow } from "./window";
import { initLog } from "./log";
import { initStore } from "./store";
import { initJsBridge } from "./jsBridge";
import { initMonitor } from "./monitor";
import { initTray } from "./tray";

//   取消警告
//   Render process output: 2-%cElectron Security Warning (Insecure Content-Security-Policy) font-weight: bold; This renderer process has either no Content Security
//   Policy set or a policy with "unsafe-eval" enabled. This exposes users of
//   this app to unnecessary security risks.
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// 初始化应用
function init() {
  // 日志
  initLog();
  // 全局状态
  initStore({ name: "test" });
  // JsBridge，渲染进程和主进程的通信桥梁
  initJsBridge();
  // 错误监控
  initMonitor();
  // 托盘
  initTray();
  // 主窗口
  createWindow({
    minWidth: 1000,
    minHeight: 700,
    winName: "index"
  });
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
