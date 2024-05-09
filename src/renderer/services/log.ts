// 日志
import { consoleFormat } from "@share/constant";
import log from "electron-log";
// 日志等级：error->warn->info->verbose->debug->silly
/**
 * 初始化日志
 */
export const initLog = () => {
  log.transports.console.format = consoleFormat;
  // 重写函数，拦截输出日志
  console.log = log.info;
  console.info = log.info;
  console.error = log.error;
  console.debug = log.debug;
  console.warn = log.warn;
};
