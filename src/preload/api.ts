import { GlobalEventEnum, bridgeEnum } from "@share/enum";
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
  [bridgeEnum.SetWinPosition](params: SetWinPositionParams) {
    ipcRenderer.send(bridgeEnum.SetWinPosition, params);
  },
  // 获取窗口位置
  [bridgeEnum.GetWinPosition](): Promise<GetWinPositionRespond> {
    return ipcRenderer.invoke(bridgeEnum.GetWinPosition);
  },
  // 最小化窗口
  [bridgeEnum.MinimizeWin]() {
    ipcRenderer.send(bridgeEnum.MinimizeWin);
  },
  //   关闭窗口
  [bridgeEnum.CloseWin]() {
    ipcRenderer.send(bridgeEnum.CloseWin);
  },
  // 最大化窗口
  [bridgeEnum.MaximizeWin]() {
    ipcRenderer.send(bridgeEnum.MaximizeWin);
  },
  // 还原窗口
  [bridgeEnum.UnmaximizeWin]() {
    ipcRenderer.send(bridgeEnum.UnmaximizeWin);
  },
  // 显示窗口
  [bridgeEnum.ShowWin]() {
    ipcRenderer.send(bridgeEnum.ShowWin);
  },
  // 隐藏窗口
  [bridgeEnum.HideWin]() {
    ipcRenderer.send(bridgeEnum.HideWin);
  },
  // 根据Url使用对应的软件打开
  [bridgeEnum.OpenUrl](params: OpenUrlParams) {
    ipcRenderer.send(bridgeEnum.OpenUrl, params);
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
  [bridgeEnum.GetEnvInfo](): Promise<GetEnvInfoRespond> {
    return ipcRenderer.invoke(bridgeEnum.GetEnvInfo);
  },
  // 显示消息弹框
  [bridgeEnum.ShowMessageBox](params: ShowMessageBoxParams): Promise<ShowMessageBoxRespond> {
    return ipcRenderer.invoke(bridgeEnum.ShowMessageBox, params);
  },
  // 获取相关路径
  [bridgeEnum.GetPath](type: GetPathType): Promise<string> {
    return ipcRenderer.invoke(bridgeEnum.GetPath, type);
  },
  // 获取数据
  [bridgeEnum.GetStore](key: keyof StoreState): Promise<any | null> {
    return ipcRenderer.invoke(bridgeEnum.GetStore, key);
  },
  // 设置数据
  [bridgeEnum.SetStore](params: SetStoreParams) {
    ipcRenderer.send(bridgeEnum.SetStore, params);
  },
  // 打开文件弹框
  [bridgeEnum.ShowOpenDialog](params: ShowOpenDialogParrams): Promise<OpenDialogReturnValue> {
    return ipcRenderer.invoke(bridgeEnum.ShowOpenDialog, params);
  },
  // 设置窗口是否可点击
  [bridgeEnum.SetIgnoreMouseEvents](params: SetIgnoreMouseEventsParams) {
    ipcRenderer.send(bridgeEnum.SetIgnoreMouseEvents, params);
  }
};

export default api;
