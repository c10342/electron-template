import { shell, BrowserWindow, dialog } from "electron";
import { join } from "path";
import icon from "../../resources/icon.png?asset";
import { GlobalEventEnum } from "@share/enum";
import log from "./logger";
import { is } from "@electron-toolkit/utils";

export function createWindow(
  name: string,
  options?: Electron.BrowserWindowConstructorOptions | undefined,
  params?: { disabledReadyToShow?: boolean }
) {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    ...(options || {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      ...(options?.webPreferences || {})
    }
  });
  if (!params?.disabledReadyToShow && !options?.show) {
    win.on("ready-to-show", () => {
      win.show();
    });
  }

  win.on("maximize", () => {
    win.webContents.send(GlobalEventEnum.MaximizeWindow);
  });
  win.on("unmaximize", () => {
    win.webContents.send(GlobalEventEnum.RestoreWindow);
  });
  win.on("minimize", () => {
    win.webContents.send(GlobalEventEnum.MinimizeWindow);
  });

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  win.webContents.on("render-process-gone", (_event, details) => {
    log.error("[Window] render-process-gone", details);

    if (details.reason === "crashed") {
      dialog
        .showMessageBox(win, {
          type: "error",
          title: "Renderer Crashed",
          message: "The renderer process has crashed.",
          detail: `Reason: ${details.reason}\nExit Code: ${details.exitCode}`,
          buttons: ["Reload", "Close"],
          noLink: true
        })
        .then(({ response }) => {
          if (response === 0) {
            win.reload();
          } else {
            win.close();
          }
        });
    }
  });

  win.webContents.on("unresponsive", () => {
    log.warn("[Window] Unresponsive:", name);
  });

  win.webContents.on("responsive", () => {
    log.info("[Window] Responsive again:", name);
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(`${process.env["ELECTRON_RENDERER_URL"]}/pages/${name}/index.html`);
  } else {
    win.loadFile(join(__dirname, `../renderer/pages/${name}/index.html`));
  }
  return win;
}

export const broadcastAllWindow = (name: string, ...args: any[]) => {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(name, ...args);
  }
};
