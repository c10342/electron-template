import log from "electron-log/main";
import { app, crashReporter } from "electron";
import { join } from "path";
import { appendFileSync, mkdirSync, existsSync, readdirSync, readFileSync, unlinkSync } from "fs";

let crashLogDir: string;

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

  crashLogDir = join(app.getPath("userData"), "crash_logs");
  if (!existsSync(crashLogDir)) {
    mkdirSync(crashLogDir, { recursive: true });
  }

  log.errorHandler.startCatching({
    showDialog: false,
    onError({ error, errorName, processType }) {
      log.error(`[${processType}] ${errorName}:`, error);
      logCrash(errorName, error, processType);
    }
  });

  log.eventLogger.startLogging({
    level: "warn",
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

export const initCrashReporter = () => {
  crashReporter.start({
    submitURL: "",
    uploadToServer: false,
    compress: true
  });

  log.info("[CrashReporter] Initialized (local mode)");
};

export const logCrash = (
  errorName: string,
  error: Error | unknown,
  processType: string = "browser"
) => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const crashFile = join(crashLogDir, `crash-${timestamp}.log`);

  const content = [
    `=== Crash Report ===`,
    `Time: ${now.toISOString()}`,
    `Process: ${processType}`,
    `Type: ${errorName}`,
    `App: ${app.getName()} v${app.getVersion()}`,
    `Electron: ${process.versions.electron}`,
    `OS: ${process.platform} ${process.getSystemVersion()}`,
    `--- Error ---`,
    error instanceof Error ? error.stack || error.message : String(error),
    `=== End ===`,
    ""
  ].join("\n");

  try {
    appendFileSync(crashFile, content, "utf8");
    log.error(`[CrashReport] Saved to ${crashFile}`);
  } catch (e) {
    log.error("[CrashReport] Failed to write crash log:", e);
  }
};

export const getCrashLogs = (): string[] => {
  if (!existsSync(crashLogDir)) return [];
  return readdirSync(crashLogDir)
    .filter((f) => f.startsWith("crash-") && f.endsWith(".log"))
    .sort()
    .reverse()
    .map((f) => readFileSync(join(crashLogDir, f), "utf8"));
};

export const clearCrashLogs = () => {
  if (!existsSync(crashLogDir)) return;
  readdirSync(crashLogDir)
    .filter((f) => f.startsWith("crash-") && f.endsWith(".log"))
    .forEach((f) => unlinkSync(join(crashLogDir, f)));
  log.info("[CrashReport] All crash logs cleared");
};

export default log;
