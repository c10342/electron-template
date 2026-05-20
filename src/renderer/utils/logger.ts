import electronLog from "electron-log/renderer";
import { wrapLogFn } from "@share/logger";

const logger = {
  ...electronLog,
  error: wrapLogFn(electronLog.error.bind(electronLog)),
  warn: wrapLogFn(electronLog.warn.bind(electronLog)),
  info: wrapLogFn(electronLog.info.bind(electronLog)),
  verbose: wrapLogFn(electronLog.verbose.bind(electronLog)),
  debug: wrapLogFn(electronLog.debug.bind(electronLog)),
  silly: wrapLogFn(electronLog.silly.bind(electronLog))
} as typeof electronLog;

export const initLogger = () => {
  // debug 及以上级别的日志 都会打印到终端控制台
  electronLog.transports.console.level = "debug";
  electronLog.transports.console.format = "{h}:{i}:{s} {text}";
  // 把渲染进程的info及以上的消息发送到主进程。调试时不用来回切换终端和 DevTools
  // 把渲染进程的日志发给主进程，主进程再写入日志文件
  electronLog.transports.ipc.level = "info";

  // 内部就是 监听了 window.error 和 window.unhandledrejection 这两个事件
  electronLog.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName }) {
      logger.error(`[renderer] ${errorName}:`, error);
    }
  });
};

export default logger;
