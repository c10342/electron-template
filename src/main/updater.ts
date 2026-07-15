import { autoUpdater } from "electron-updater";
import logger from "./logger";
import { is } from "@electron-toolkit/utils";

export const initUpdater = () => {
  autoUpdater.autoDownload = true;
  autoUpdater.autoRunAppAfterInstall = true;
  autoUpdater.logger = logger;
  autoUpdater.forceDevUpdateConfig = is.dev;
  autoUpdater.on("checking-for-update", () => {
    logger.info("[Updater] Checking for update...");
  });

  autoUpdater.on("update-available", (info) => {
    logger.info("[Updater] Update available:", info.version);
    downloadUpdate();
  });

  autoUpdater.on("update-not-available", (info) => {
    logger.info("[Updater] Update not available. Current version:", info.version);
  });

  autoUpdater.on("download-progress", (progressInfo) => {
    logger.info(`[Updater] Download progress: ${progressInfo.percent.toFixed(1)}%`);
  });

  autoUpdater.on("update-downloaded", (info) => {
    logger.info("[Updater] Update downloaded:", info.version);
    installUpdate();
  });

  autoUpdater.on("error", (error) => {
    logger.error("[Updater] Error:", error?.message);
  });
};

export const checkForUpdate = () => {
  autoUpdater.checkForUpdates().catch((err) => {
    logger.error("[Updater] checkForUpdates failed:", err);
  });
};

export const downloadUpdate = () => {
  autoUpdater.downloadUpdate().catch((err) => {
    logger.error("[Updater] downloadUpdate failed:", err);
  });
};

export const installUpdate = () => {
  autoUpdater.quitAndInstall(false, true);
};
