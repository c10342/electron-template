import electronLog from "electron-log/main";
import { app } from "electron";
import { wrapLogFn } from "@share/logger";

// electron-log 的日志级别从低到高为：silly → debug → verbose → info → warn → error
const log = {
  ...electronLog,
  error: wrapLogFn(electronLog.error.bind(electronLog)),
  warn: wrapLogFn(electronLog.warn.bind(electronLog)),
  info: wrapLogFn(electronLog.info.bind(electronLog)),
  verbose: wrapLogFn(electronLog.verbose.bind(electronLog)),
  debug: wrapLogFn(electronLog.debug.bind(electronLog)),
  silly: wrapLogFn(electronLog.silly.bind(electronLog))
} as typeof electronLog;

export const initLogger = () => {
  electronLog.initialize({ preload: true });
  // info 及以上级别的日志 都会写入日志文件
  electronLog.transports.file.level = "info";
  electronLog.transports.file.maxSize = 10485760;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  electronLog.transports.file.fileName = `${y}-${m}-${d}.log`;
  // debug 及以上级别的日志 都会打印到终端控制台
  electronLog.transports.console.level = "debug";
  // 把主进程的info及以上的消息发送到渲染进程。调试时不用来回切换终端和 DevTools
  electronLog.transports.ipc.level = "info";

  // electron-log 提供的一个 全局错误捕获机制 ，它的作用是自动拦截应用中未被处理的异常和 Promise rejection，防止应用因未捕获的错误而崩溃。
  electronLog.errorHandler.startCatching({
    // 捕获到错误时 不弹出 系统原生的错误对话框（默认 Electron 遇到未捕获异常会弹出一个弹窗），这在生产环境中更友好
    showDialog: false,
    // 每当捕获到未处理的错误时，会调用这个回调
    onError({ error, errorName, processType }) {
      log.error(`[${processType}] ${errorName}:`, error);
    }
  });

  // 自动将 Electron 的内置事件记录到日志中
  electronLog.eventLogger.startLogging({
    // 以 warn 级别输出这些事件日志
    level: "warn",
    // 所有事件日志都会带上 [electron] 作用域标签，方便在日志中区分哪些是系统事件、哪些是你自己的业务日志
    scope: "electron"
  });

  log.info("========== Application started ==========");
  log.info(`App: ${app.getName()} v${app.getVersion()}`);
  log.info(`Electron: ${process.versions.electron}`);
  log.info(`Chrome: ${process.versions.chrome}`);
  log.info(`Node: ${process.versions.node}`);
  log.info(`OS: ${process.platform} ${process.getSystemVersion()}`);
  log.info("==========================================");
};

export default log;
