import { BridgeEnum, GlobalEventEnum, LangEnum } from "@share/enum";
import { OpenDialogParams, StoreSchema } from "@share/type";
import { BrowserWindow, dialog, ipcMain } from "electron";
import { setLocale } from "./i18n";
import { broadcastAllWindow } from "./window";
import { getStore as getStoreValue, setStore as setStoreValue } from "./store";

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
  ipcMain.on(BridgeEnum.SetLocale, (_event, locale: string) => {
    if (Object.values(LangEnum).includes(locale as LangEnum)) {
      setLocale(locale);
      broadcastAllWindow(GlobalEventEnum.LocaleChanged, locale);
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
};
