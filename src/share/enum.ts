export enum BridgeEnum {
  MaximizeWindow = "maximizeWindow",
  MinimizeWindow = "minimizeWindow",
  RestoreWindow = "restoreWindow",
  CloseWindow = "closeWindow",
  OpenDialog = "openDialog",
  SaveDialog = "saveDialog",
  IsMaximized = "isMaximized",
  SetLang = "setLang",
  GetLang = "getLang",
  GetStore = "getStore",
  SetStore = "setStore",
  ReadClipboardText = "readClipboardText",
  WriteClipboardText = "writeClipboardText",
  ShowNotification = "showNotification",
  OpenExternal = "openExternal",
  OpenPath = "openPath",
  GetScreenInfo = "getScreenInfo",
  GetAppVersion = "getAppVersion",
  GetPlatform = "getPlatform",
  TrayMenuResize = "trayMenuResize"
}

export enum GlobalEventEnum {
  MaximizeWindow = "window:maximize",
  MinimizeWindow = "window:minimize",
  RestoreWindow = "window:unmaximize",
  LangChanged = "window:langChanged"
}

export enum LangEnum {
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
  En = "en"
}
