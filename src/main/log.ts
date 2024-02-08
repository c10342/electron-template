import { app } from "electron";
import log from "electron-log";
import moment from "moment";

// 日志等级：error->warn->info->verbose->debug->silly
export const initLog = () => {
  log.initialize({ preload: true });
  //   输出到文件的内容
  log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}]{scope} {text}";
  //   只输出大于等于warn等级的日志到文件
  log.transports.file.level = "warn";
  // 设置日志文件路径及名称
  log.transports.file.fileName = `main-${moment().format("yyyy-MM-DD")}.log`;
  // 设置最大日志文件大小为5MB
  log.transports.file.maxSize = 5 * 1024 * 1024; // bytes
  //   打印到控制台的内容
  log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}]{scope} {text}";
  //   默认安装地址
  // appa.getPath("userData")//C:\Users\xx\AppData\Roaming\项目名称\logs
  console.log = log.info;
  console.info = log.info;
  console.error = log.error;
  console.debug = log.debug;
  console.warn = log.warn;
  console.log(`日志存放位置:${app.getPath("userData")}`);
};
