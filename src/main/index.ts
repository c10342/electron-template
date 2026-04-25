import { app, BrowserWindow } from "electron";

import { electronApp, optimizer } from "@electron-toolkit/utils";

import log, { initLogger } from "./logger";
import { initI18n } from "./i18n";
import { initBridge } from "./bridge";
import { initUpdater } from "./updater";
import { createWindow } from "./window";
import { initSingleInstance } from "./singleInstance";
import { initStore } from "./store";
import { createTray } from "./tray";

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = createWindow("main");
}
initSingleInstance(() => {
  mainWindow?.show();
  mainWindow?.focus();
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  initLogger();
  initStore();
  initI18n();
  initBridge();
  initUpdater();
  createMainWindow();
  createTray(mainWindow);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("render-process-gone", (_event, _webContents, details) => {
  log.error("[App] render-process-gone", details);
});

app.on("child-process-gone", (_event, details) => {
  log.error("[App] child-process-gone", details);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
