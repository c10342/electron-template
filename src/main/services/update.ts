import { GlobalEventEnum } from "@share/enum";
import { BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";

const broadcastEvent = (eventName: GlobalEventEnum, ...args: any[]) => {
  const wins = BrowserWindow.getAllWindows();
  wins.forEach((win) => {
    win.webContents.send(eventName, ...args);
  });
};

export const initUpdate = () => {
  // 自动下载
  autoUpdater.autoDownload = true;
  // 应用退出后自动安装
  autoUpdater.autoInstallOnAppQuit = true;
  //   有版本需要更新
  autoUpdater.on("update-available", (info) => {
    console.log("有版本需要更新", info);
    broadcastEvent(GlobalEventEnum.UpdateAvailable, info);
  });
  //   无需更新
  autoUpdater.on("update-not-available", (info) => {
    console.log("无需更新", info);
    broadcastEvent(GlobalEventEnum.UpdateNotAvailable, info);
  });
  //   下载进度
  autoUpdater.on("download-progress", (prog) => {
    console.log("下载进度", prog);
    broadcastEvent(GlobalEventEnum.DownloadProgress, prog);
  });
  //   下载完成
  autoUpdater.on("update-downloaded", (info) => {
    console.log("下载完成", info);
    broadcastEvent(GlobalEventEnum.UpdateDownloaded, info);
  });
};

export const checkUpdate = () => {
  // 检测是否有更新包并通知
  return autoUpdater.checkForUpdatesAndNotify({
    body: "有更新",
    title: "提示"
  });
};
