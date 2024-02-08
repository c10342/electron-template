import { GlobalEventEnum, JsBridgeEnum } from "@share/enum";
import {
  GetWinPositionRespond,
  SetWinPositionParams,
  OpenUrlParams,
  GetEnvInfoRespond,
  ShowMessageBoxParams,
  ShowMessageBoxRespond,
  GetPathType,
  SetStoreParams,
  ShowOpenDialogParrams,
  SetIgnoreMouseEventsParams,
  StoreState
} from "@share/type";
import { OpenDialogReturnValue, ipcRenderer } from "electron";

const api = {
  // 设置窗口位置
  [JsBridgeEnum.SetWinPosition](params: SetWinPositionParams) {
    ipcRenderer.send(JsBridgeEnum.SetWinPosition, params);
  },
  // 获取窗口位置
  [JsBridgeEnum.GetWinPosition](): Promise<GetWinPositionRespond> {
    return ipcRenderer.invoke(JsBridgeEnum.GetWinPosition);
  },
  // 最小化窗口
  [JsBridgeEnum.MinimizeWin]() {
    ipcRenderer.send(JsBridgeEnum.MinimizeWin);
  },
  //   关闭窗口
  [JsBridgeEnum.CloseWin]() {
    ipcRenderer.send(JsBridgeEnum.CloseWin);
  },
  // 最大化窗口
  [JsBridgeEnum.MaximizeWin]() {
    ipcRenderer.send(JsBridgeEnum.MaximizeWin);
  },
  // 还原窗口
  [JsBridgeEnum.UnmaximizeWin]() {
    ipcRenderer.send(JsBridgeEnum.UnmaximizeWin);
  },
  // 显示窗口
  [JsBridgeEnum.ShowWin]() {
    ipcRenderer.send(JsBridgeEnum.ShowWin);
  },
  // 隐藏窗口
  [JsBridgeEnum.HideWin]() {
    ipcRenderer.send(JsBridgeEnum.HideWin);
  },
  // 根据Url使用对应的软件打开
  [JsBridgeEnum.OpenUrl](params: OpenUrlParams) {
    ipcRenderer.send(JsBridgeEnum.OpenUrl, params);
  },
  // 监听事件
  on(name: GlobalEventEnum, action: (...args: any) => any) {
    ipcRenderer.on(name, action);
  },
  // 移除事件
  off(name: GlobalEventEnum, action: (...args: any) => any) {
    ipcRenderer.removeListener(name, action);
  },
  // 获取软件信息
  [JsBridgeEnum.GetEnvInfo](): Promise<GetEnvInfoRespond> {
    return ipcRenderer.invoke(JsBridgeEnum.GetEnvInfo);
  },
  // 显示消息弹框
  [JsBridgeEnum.ShowMessageBox](params: ShowMessageBoxParams): Promise<ShowMessageBoxRespond> {
    return ipcRenderer.invoke(JsBridgeEnum.ShowMessageBox, params);
  },
  // 获取相关路径
  [JsBridgeEnum.GetPath](type: GetPathType): Promise<string> {
    return ipcRenderer.invoke(JsBridgeEnum.GetPath, type);
  },
  // 获取数据
  [JsBridgeEnum.GetStore](key: keyof StoreState): Promise<any | null> {
    return ipcRenderer.invoke(JsBridgeEnum.GetStore, key);
  },
  // 设置数据
  [JsBridgeEnum.SetStore](params: SetStoreParams) {
    ipcRenderer.send(JsBridgeEnum.SetStore, params);
  },
  // 打开文件弹框
  [JsBridgeEnum.ShowOpenDialog](params: ShowOpenDialogParrams): Promise<OpenDialogReturnValue> {
    return ipcRenderer.invoke(JsBridgeEnum.ShowOpenDialog, params);
  },
  // 设置窗口是否可点击
  [JsBridgeEnum.SetIgnoreMouseEvents](params: SetIgnoreMouseEventsParams) {
    ipcRenderer.send(JsBridgeEnum.SetIgnoreMouseEvents, params);
  }
};

export default api;
