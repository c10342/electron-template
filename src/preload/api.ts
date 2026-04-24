import { BridgeEnum } from "@share/enum";
import { OpenDialogParams, StoreSchema } from "@share/type";
import { ipcRenderer } from "electron";

const api = {
  ipcOn(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.on(name, action);
  },
  ipcOff(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.off(name, action);
  },
  ipcOnce(name: string, action: (event: Electron.IpcRendererEvent, ...args: any[]) => any) {
    ipcRenderer.once(name, action);
  },
  ipcSend(name: string, ...args: any[]) {
    ipcRenderer.send(name, ...args);
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
  [BridgeEnum.SetLocale](locale: string): void {
    ipcRenderer.send(BridgeEnum.SetLocale, locale);
  },
  [BridgeEnum.GetStore]<T extends keyof StoreSchema>(key: T): Promise<StoreSchema[T]> {
    return ipcRenderer.invoke(BridgeEnum.GetStore, key);
  },
  [BridgeEnum.SetStore]<T extends keyof StoreSchema>(key: T, value: StoreSchema[T]): Promise<void> {
    return ipcRenderer.invoke(BridgeEnum.SetStore, key, value);
  }
};

export default api;
