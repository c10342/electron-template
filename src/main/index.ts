import { app, BrowserWindow } from "electron";

import { electronApp, optimizer } from "@electron-toolkit/utils";

import { initLogger } from "./logger";
import { initI18n } from "./i18n";
import { initBridge } from "./bridge";
import { initUpdater } from "./updater";
import { createWindow } from "./window";
import { initSingleInstance } from "./singleInstance";

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = createWindow("main");
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  initLogger();
  initI18n();
  initBridge();
  initUpdater();
  createMainWindow();
  initSingleInstance(mainWindow!);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
