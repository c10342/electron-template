import { autoUpdater } from "electron-updater";
import log from "./logger";

export const initUpdater = () => {
  autoUpdater.autoDownload = true;
  autoUpdater.autoRunAppAfterInstall = true;
  autoUpdater.logger = log;
  autoUpdater.forceDevUpdateConfig = true;
  autoUpdater.on("checking-for-update", () => {
    log.info("[Updater] Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    log.info("[Updater] Update available:", info.version);
    downloadUpdate();
  });

  autoUpdater.on("update-not-available", (info) => {
    log.info("[Updater] Update not available. Current version:", info.version);
  });

  autoUpdater.on("download-progress", (progressInfo) => {
    log.info(`[Updater] Download progress: ${progressInfo.percent.toFixed(1)}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    log.info("[Updater] Update downloaded:", info.version);
    installUpdate();
  });

  autoUpdater.on("error", (error) => {
    log.error("[Updater] Error:", error?.message);
  });
};

export const checkForUpdate = () => {
  autoUpdater.checkForUpdates().catch((err) => {
    log.error("[Updater] checkForUpdates failed:", err);
  });
};

export const downloadUpdate = () => {
  autoUpdater.downloadUpdate().catch((err) => {
    log.error("[Updater] downloadUpdate failed:", err);
  });
};

export const installUpdate = () => {
  autoUpdater.quitAndInstall(false, true);
};
