import { BrowserWindow, nativeImage, screen, Tray } from "electron";
import icon from "../../resources/icon.png?asset";
import { createWindow } from "./window";

let tray: Tray | null = null;
let menuWin: BrowserWindow | null = null;

function getTrayIcon(): Electron.NativeImage {
  const image = nativeImage.createFromPath(icon);
  if (process.platform === "darwin") {
    return image.resize({ width: 16, height: 16 });
  }
  return image;
}

function createTrayMenuWindow() {
  menuWin = createWindow(
    "trayMenu",
    {
      width: 1,
      height: 1,
      show: false,
      frame: false,
      transparent: true,
      resizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      focusable: true,
      hasShadow: false
    },
    {
      disabledReadyToShow: true
    }
  );
  menuWin.on("blur", () => {
    if (menuWin && !menuWin.isDestroyed()) {
      menuWin.hide();
    }
  });
}

function positionMenu(): void {
  if (!tray || !menuWin) return;
  const trayBounds = tray.getBounds();
  const winBounds = menuWin.getBounds();
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const workArea = display.workArea;

  let x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  let y = Math.round(trayBounds.y + trayBounds.height + 4);

  if (x + winBounds.width > workArea.x + workArea.width) {
    x = workArea.x + workArea.width - winBounds.width;
  }
  if (x < workArea.x) {
    x = workArea.x;
  }
  if (y + winBounds.height > workArea.y + workArea.height) {
    y = trayBounds.y - winBounds.height - 4;
  }

  menuWin.setPosition(x, y, false);
}

export const createTray = (mainWin?: BrowserWindow | null): void => {
  tray = new Tray(getTrayIcon());
  tray.setToolTip("Electron Player");
  // 以下右键菜单采用的是自定义窗口。也可以使用electron提供的Menu类来创建系统原生的菜单
  createTrayMenuWindow();
  tray.on("right-click", () => {
    if (!menuWin) return;
    positionMenu();
    menuWin.show();
    menuWin.focus();
  });

  tray.on("double-click", () => {
    mainWin?.show();
    mainWin?.focus();
  });
};

/**
 * 根据菜单页面的宽度和高度调整托盘菜单窗口大小
 * @param width 宽度
 * @param height 高度
 */
export const resizeTrayMenu = (width: number, height: number): void => {
  if (menuWin && !menuWin.isDestroyed()) {
    menuWin.setContentSize(width, height);
    positionMenu();
  }
};
