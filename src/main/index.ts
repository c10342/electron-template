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

function init(): void {
  initLog();
  initStore({ name: "test" });
  initJsBridge();
  initMonitor();
  initTray();
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
