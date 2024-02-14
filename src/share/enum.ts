// JsBridge方法调用
export enum bridgeEnum {
  // 设置窗口位置
  SetWinPosition = "setWinPosition",
  // 获取窗口位置
  GetWinPosition = "getWinPosition",
  // 关闭窗口
  CloseWin = "closeWin",
  // 最大化窗口
  MaximizeWin = "maximizeWin",
  // 最小化窗口
  MinimizeWin = "minimizeWin",
  // 还原窗口
  UnmaximizeWin = "unmaximizeWin",
  // 显示窗口
  ShowWin = "showWin",
  // 隐藏窗口
  HideWin = "hideWin",
  // 根据传入的路径选择对应的软件打开
  OpenUrl = "openUrl",
  // 获取软件信息
  GetEnvInfo = "getEnvInfo",
  // 显示一个消息框
  ShowMessageBox = "showMessageBox",
  // 获取相关路径
  GetPath = "getPath",
  // 获取数据
  GetStore = "getStore",
  // 设置数据
  SetStore = "setStore",
  // 显示文件弹框
  ShowOpenDialog = "showOpenDialog",
  // 设置窗口是否点击穿透
  SetIgnoreMouseEvents = "setIgnoreMouseEvents"
}

// 全局事件广播
export enum GlobalEventEnum {
  Maximize = "maximize",
  Minimize = "minimize",
  Unmaximize = "unmaximize"
}
