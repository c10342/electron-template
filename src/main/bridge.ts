import { BridgeEnum, GlobalEventEnum, LangEnum } from "@share/enum";
import {
  OpenDialogParams,
  SaveDialogParams,
  StoreSchema,
  NotificationParams,
  ScreenInfo
} from "@share/type";
import {
  BrowserWindow,
  clipboard,
  dialog,
  ipcMain,
  Notification,
  shell,
  screen,
  app
} from "electron";
import { setLang } from "./i18n";
import { broadcastAllWindow } from "./window";
import { getStore as getStoreValue, setStore as setStoreValue } from "./store";
import { resizeTrayMenu } from "./tray";

export const initBridge = () => {
  ipcMain.on(BridgeEnum.MaximizeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.maximize();
  });
  ipcMain.on(BridgeEnum.MinimizeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });
  ipcMain.on(BridgeEnum.RestoreWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.unmaximize();
  });
  ipcMain.handle(BridgeEnum.IsMaximized, (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
  });
  ipcMain.on(BridgeEnum.CloseWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
  ipcMain.handle(BridgeEnum.OpenDialog, (event, params: OpenDialogParams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (params.modal && win) {
      return dialog.showOpenDialog(win, params);
    }
    return dialog.showOpenDialog(params);
  });
  ipcMain.handle(BridgeEnum.SaveDialog, (event, params: SaveDialogParams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (params.modal && win) {
      return dialog.showSaveDialog(win, params);
    }
    return dialog.showSaveDialog(params);
  });
  ipcMain.on(BridgeEnum.SetLang, (_event, lang: string) => {
    if (Object.values(LangEnum).includes(lang as LangEnum)) {
      setLang(lang);
      broadcastAllWindow(GlobalEventEnum.LangChanged, lang);
    }
  });
  ipcMain.handle(
    BridgeEnum.GetStore,
    <T extends keyof StoreSchema>(_event: Electron.IpcMainInvokeEvent, key: T): StoreSchema[T] => {
      return getStoreValue(key);
    }
  );
  ipcMain.handle(
    BridgeEnum.SetStore,
    <T extends keyof StoreSchema>(
      _event: Electron.IpcMainInvokeEvent,
      key: T,
      value: StoreSchema[T]
    ): void => {
      setStoreValue(key, value);
    }
  );
  ipcMain.handle(BridgeEnum.ReadClipboardText, (): string => {
    return clipboard.readText();
  });
  ipcMain.handle(BridgeEnum.WriteClipboardText, (_event, text: string): void => {
    clipboard.writeText(text);
  });
  ipcMain.handle(BridgeEnum.ShowNotification, (_event, params: NotificationParams): boolean => {
    if (!Notification.isSupported()) return false;
    const notification = new Notification({
      title: params.title,
      body: params.body || "",
      subtitle: params.subtitle,
      silent: params.silent,
      ...(params.icon ? { icon: params.icon } : {})
    });
    notification.show();
    return true;
  });
  ipcMain.handle(BridgeEnum.OpenExternal, (_event, url: string): Promise<void> => {
    return shell.openExternal(url);
  });
  ipcMain.handle(BridgeEnum.OpenPath, (_event, path: string): Promise<void> => {
    return shell.openPath(path).then(() => undefined);
  });
  ipcMain.handle(BridgeEnum.GetScreenInfo, (): ScreenInfo => {
    const primary = screen.getPrimaryDisplay();
    return {
      width: primary.size.width,
      height: primary.size.height,
      scaleFactor: primary.scaleFactor,
      primaryDisplay: {
        id: primary.id,
        bounds: primary.bounds,
        workArea: primary.workArea,
        scaleFactor: primary.scaleFactor
      }
    };
  });
  ipcMain.handle(BridgeEnum.GetAppVersion, (): string => {
    return app.getVersion();
  });
  ipcMain.handle(BridgeEnum.GetPlatform, (): string => {
    return process.platform;
  });

  ipcMain.on(BridgeEnum.TrayMenuResize, (_event, width: number, height: number) => {
    resizeTrayMenu(width, height);
  });
};
