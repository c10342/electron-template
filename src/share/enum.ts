// JsBridge方法调用
export enum BridgeEnum {
  MaximizeWindow = "maximizeWindow",
  MinimizeWindow = "minimizeWindow",
  RestoreWindow = "restoreWindow",
  CloseWindow = "closeWindow",
  OpenDialog = "openDialog",
  IsMaximized = "isMaximized",
  SetLocale = "setLocale"
}

// 全局事件广播
export enum GlobalEventEnum {
  MaximizeWindow = "window:maximize",
  MinimizeWindow = "window:minimize",
  RestoreWindow = "window:unmaximize",
  LocaleChanged = "window:localeChanged"
}

// 语言
export enum LocaleEnum {
  ZhCN = "zh-CN",
  ZhTW = "zh-TW",
  En = "en"
}
