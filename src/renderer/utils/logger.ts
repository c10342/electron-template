import log from "electron-log/renderer";
import { wrapLogFn } from "../../share/logger";

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
  log.transports.console.level = "info";
  log.transports.ipc.level = "info";

  log.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName }) {
      wrappedLog.error(`[renderer] ${errorName}:`, error);
    }
  });
};

export default wrappedLog;
