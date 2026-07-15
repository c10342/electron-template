import { BridgeEnum, GlobalEventEnum } from "@share/enum";
import {
  OpenDialogParams,
  SaveDialogParams,
  StoreSchema,
  NotificationParams,
  ScreenInfo
} from "@share/type";
import { ipcRenderer } from "electron";

const ipcOn = (name: string, action: (...args: any[]) => any) => {
  const cb = (_: Electron.IpcRendererEvent, ...args: any[]) => {
    action(...args);
  };
  ipcRenderer.on(name, cb);
  return () => {
    ipcRenderer.off(name, cb);
  };
};

const api = {
  onLangChange(action: (lang: string) => any) {
    return ipcOn(GlobalEventEnum.LangChanged, action);
  },
  onWindowMaximize(action: () => any) {
    return ipcOn(GlobalEventEnum.MaximizeWindow, action);
  },
  onWindowMinimize(action: () => any) {
    return ipcOn(GlobalEventEnum.MinimizeWindow, action);
  },
  onWindowRestore(action: () => any) {
    return ipcOn(GlobalEventEnum.RestoreWindow, action);
  },
  [BridgeEnum.MaximizeWindow]() {
    ipcRenderer.send(BridgeEnum.MaximizeWindow);
  },
  [BridgeEnum.MinimizeWindow]() {
    ipcRenderer.send(BridgeEnum.MinimizeWindow);
  },
  [BridgeEnum.RestoreWindow]() {
    ipcRenderer.send(BridgeEnum.RestoreWindow);
  },
  [BridgeEnum.CloseWindow]() {
    ipcRenderer.send(BridgeEnum.CloseWindow);
  },
  [BridgeEnum.IsMaximized](): Promise<boolean> {
    return ipcRenderer.invoke(BridgeEnum.IsMaximized);
  },
  [BridgeEnum.OpenDialog](params: OpenDialogParams): Promise<Electron.OpenDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.OpenDialog, params);
  },
  [BridgeEnum.SaveDialog](params: SaveDialogParams): Promise<Electron.SaveDialogReturnValue> {
    return ipcRenderer.invoke(BridgeEnum.SaveDialog, params);
  },
  [BridgeEnum.SetLang](lang: string): void {
    ipcRenderer.send(BridgeEnum.SetLang, lang);
  },
  [BridgeEnum.GetLang](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetLang);
  },
  [BridgeEnum.GetStore]<T extends keyof StoreSchema>(key: T): Promise<StoreSchema[T]> {
    return ipcRenderer.invoke(BridgeEnum.GetStore, key);
  },
  [BridgeEnum.SetStore]<T extends keyof StoreSchema>(key: T, value: StoreSchema[T]): Promise<void> {
    return ipcRenderer.invoke(BridgeEnum.SetStore, key, value);
  },
  [BridgeEnum.ReadClipboardText](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.ReadClipboardText);
  },
  [BridgeEnum.WriteClipboardText](text: string): Promise<void> {
    return ipcRenderer.invoke(BridgeEnum.WriteClipboardText, text);
  },
  [BridgeEnum.ShowNotification](params: NotificationParams): Promise<boolean> {
    return ipcRenderer.invoke(BridgeEnum.ShowNotification, params);
  },
  [BridgeEnum.OpenExternal](url: string): Promise<void> {
    return ipcRenderer.invoke(BridgeEnum.OpenExternal, url);
  },
  [BridgeEnum.OpenPath](path: string): Promise<void> {
    return ipcRenderer.invoke(BridgeEnum.OpenPath, path);
  },
  [BridgeEnum.GetScreenInfo](): Promise<ScreenInfo> {
    return ipcRenderer.invoke(BridgeEnum.GetScreenInfo);
  },
  [BridgeEnum.GetAppVersion](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetAppVersion);
  },
  [BridgeEnum.GetPlatform](): Promise<string> {
    return ipcRenderer.invoke(BridgeEnum.GetPlatform);
  },
  [BridgeEnum.TrayMenuResize](width: number, height: number): void {
    ipcRenderer.send(BridgeEnum.TrayMenuResize, width, height);
  }
};

export default api;
