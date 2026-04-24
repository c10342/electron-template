import { app, BrowserWindow } from "electron";

export const initSingleInstance = (mainWindow: BrowserWindow) => {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", () => {
      mainWindow.show();
      mainWindow.focus();
    });
    // ... 正常启动逻辑
  }
};
