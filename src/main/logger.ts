import log from "electron-log/main";
import { app } from "electron";
import { wrapLogFn } from "../share/logger";

const wrappedLog = {
  ...log,
  error: wrapLogFn(log.error.bind(log)),
  warn: wrapLogFn(log.warn.bind(log)),
  info: wrapLogFn(log.info.bind(log)),
  verbose: wrapLogFn(log.verbose.bind(log)),
  debug: wrapLogFn(log.debug.bind(log)),
  silly: wrapLogFn(log.silly.bind(log))
} as typeof log;

export const initLogger = () => {
  log.initialize({ preload: true });

  log.transports.file.level = "info";
  log.transports.file.maxSize = 10485760;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  log.transports.file.fileName = `${y}-${m}-${d}.log`;
  log.transports.console.level = "debug";
  log.transports.ipc.level = "info";

  log.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName, processType }) {
      wrappedLog.error(`[${processType}] ${errorName}:`, error);
    }
  });

  log.eventLogger.startLogging({
    level: "warn",
    scope: "electron"
  });

  wrappedLog.info("========== Application started ==========");
  wrappedLog.info(`App: ${app.getName()} v${app.getVersion()}`);
  wrappedLog.info(`Electron: ${process.versions.electron}`);
  wrappedLog.info(`Chrome: ${process.versions.chrome}`);
  wrappedLog.info(`Node: ${process.versions.node}`);
  wrappedLog.info(`OS: ${process.platform} ${process.getSystemVersion()}`);
  wrappedLog.info("==========================================");
};

export default wrappedLog;
