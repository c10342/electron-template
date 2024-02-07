import { logError } from "@share/log";
import { app, crashReporter } from "electron";

// 错误监控
const initMonitor = () => {
  app.on("render-process-gone", (event, webContents, details) => {
    logError("render-process-gone", event, webContents, details);
  });
  app.on("child-process-gone", (event, details) => {
    logError("render-process-gone", event, details);
  });
  process.on("unhandledRejection", (reason) => {
    logError("unhandledRejection", reason);
  });
  process.on("uncaughtException", (error, origin) => {
    logError("uncaughtException", error, origin);
  });
  crashReporter.start({
    uploadToServer: false
  });
};

export default initMonitor;
