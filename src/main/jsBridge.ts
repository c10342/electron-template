// 主/渲染进程通信
import { JsBridgeEnum } from "@share/enum";
import {
  SetWinPositionParams,
  OpenUrlParams,
  ShowMessageBoxParams,
  GetPathType,
  SetStoreParams,
  ShowOpenDialogParrams,
  SetIgnoreMouseEventsParams
} from "@share/type";
import { BrowserWindow, app, dialog, ipcMain, shell } from "electron";
import os from "os";
import { store } from "./store";

// jsBridge
export const initJsBridge = () => {
  // 设置窗口位置
  ipcMain.on(JsBridgeEnum.SetWinPosition, (event, params: SetWinPositionParams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) {
      return;
    }
    const rect = win.getBounds();
    win.setBounds({
      ...rect,
      x: params.x,
      y: params.y
    });
  });
  // 获取窗口位置
  ipcMain.handle(JsBridgeEnum.GetWinPosition, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) {
      return null;
    }
    const pos = win.getPosition();
    return {
      x: pos[0],
      y: pos[1]
    };
  });
  // 最小化窗口
  ipcMain.on(JsBridgeEnum.MinimizeWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.minimize();
  });
  // 最大化窗口
  ipcMain.on(JsBridgeEnum.MaximizeWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.maximize();
  });
  // 还原窗口
  ipcMain.on(JsBridgeEnum.UnmaximizeWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.unmaximize();
  });
  // 关闭窗口
  ipcMain.on(JsBridgeEnum.CloseWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });
  // 显示窗口
  ipcMain.on(JsBridgeEnum.ShowWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.show();
  });
  // 隐藏窗口
  ipcMain.on(JsBridgeEnum.HideWin, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.hide();
  });
  // 根据Url使用对应的软件打开
  ipcMain.on(JsBridgeEnum.OpenUrl, (_event, params: OpenUrlParams) => {
    shell.openExternal(params.url);
  });
  // 获取软件信息
  ipcMain.handle(JsBridgeEnum.GetEnvInfo, () => {
    return {
      versions: {
        ...process.versions
      },
      os: {
        arch: os.arch(),
        release: os.release(),
        name: process.env.OS
      }
    };
  });
  // 显示消息弹框
  ipcMain.handle(JsBridgeEnum.ShowMessageBox, (event, params: ShowMessageBoxParams) => {
    if (params.modal) {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (win) {
        return dialog.showMessageBox(win, params);
      }
    }
    return dialog.showMessageBox(params);
  });
  // 获取相关路径
  ipcMain.handle(JsBridgeEnum.GetPath, (_event, type: GetPathType) => {
    return app.getPath(type);
  });
  // 设置数据
  ipcMain.on(JsBridgeEnum.SetStore, (_event, params: SetStoreParams) => {
    store?.set(params.key, params.value);
  });
  // 获取数据
  ipcMain.handle(JsBridgeEnum.GetStore, (_event, key: string) => {
    return store?.get(key);
  });
  // 打开文件弹框
  ipcMain.handle(JsBridgeEnum.ShowOpenDialog, (event, params: ShowOpenDialogParrams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (params.modal && win) {
      return dialog.showOpenDialog(win, params);
    }
    return dialog.showOpenDialog(params);
  });
  // 设置窗口是否可点击
  ipcMain.on(JsBridgeEnum.SetIgnoreMouseEvents, (event, params: SetIgnoreMouseEventsParams) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) {
      return;
    }

    return win.setIgnoreMouseEvents(params.ignore, params);
  });
};
