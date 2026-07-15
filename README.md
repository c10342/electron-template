# Electron Template

基于 **Electron 31 + Vue 3 + TypeScript** 的跨平台桌面应用模板，使用 electron-vite 统一构建主进程、预加载脚本和渲染进程，并内置多窗口、IPC、系统托盘、持久化、国际化、日志、HTTP 和自动更新等基础能力。

当前项目仍处于模板阶段：主窗口和托盘菜单仅有演示 UI，语言资源为空，应用标识和更新服务器地址也仍是占位值。

## 技术栈

| 类别   | 技术                                           | 用途                     |
| ------ | ---------------------------------------------- | ------------------------ |
| 桌面端 | Electron 31                                    | 窗口、托盘和系统原生能力 |
| 渲染层 | Vue 3 + TypeScript                             | 桌面界面                 |
| 构建   | electron-vite 2 + Vite 5                       | 三类进程统一开发与构建   |
| UI     | Element Plus                                   | 自动按需导入的组件库     |
| 状态   | Pinia + electron-store                         | UI 状态与本地持久化      |
| 国际化 | i18next + vue-i18n                             | 主进程和渲染进程多语言   |
| 网络   | Axios                                          | HTTP 客户端封装          |
| 日志   | electron-log                                   | 文件、终端和跨进程日志   |
| 更新   | electron-updater                               | 安装包自动更新           |
| 工程化 | ESLint、Prettier、Stylelint、Husky、commitlint | 代码和提交规范           |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

`package.json` 暂未通过 `engines` 强制版本，以上要求来自项目约定。

### 安装与开发

```bash
npm install
npm run dev
```

### 检查与构建

```bash
npm run typecheck       # 主进程/预加载 + 渲染进程类型检查
npm run build           # 类型检查后构建
npm run build:unpack    # 构建并生成未封装应用目录
npm run build:win       # Windows NSIS 安装包
npm run build:mac       # macOS DMG
npm run build:linux     # AppImage、snap、deb
```

> 当前基线已通过 `npm run typecheck`。项目暂未配置测试框架或 `test` 脚本。

## 项目结构

```text
electron-template/
├─ build/                         # 安装包图标、macOS entitlement 等构建资源
├─ resources/                     # 打包后通过 asarUnpack 解包的运行时资源
├─ src/
│  ├─ main/                       # Electron 主进程
│  │  ├─ index.ts                 # 应用入口和模块初始化
│  │  ├─ window.ts                # 窗口工厂、事件广播和崩溃处理
│  │  ├─ bridge.ts                # ipcMain 处理器
│  │  ├─ tray.ts                  # 托盘和自定义托盘菜单窗口
│  │  ├─ store.ts                 # electron-store 持久化
│  │  ├─ logger.ts                # 主进程日志
│  │  ├─ updater.ts               # 自动更新生命周期
│  │  ├─ singleInstance.ts        # 单实例锁
│  │  └─ i18n/                    # i18next 初始化及主进程语言包
│  ├─ preload/
│  │  ├─ index.ts                 # 通过 contextBridge 注入 API
│  │  ├─ api.ts                   # 渲染进程可调用的白名单 API
│  │  └─ index.d.ts               # window.electronAPI 类型声明
│  ├─ renderer/
│  │  ├─ pages/
│  │  │  ├─ main/                 # 主窗口页面
│  │  │  └─ trayMenu/             # 自定义托盘右键菜单页面
│  │  ├─ i18n/                    # vue-i18n 初始化及渲染层语言包
│  │  ├─ stores/                  # Pinia stores
│  │  ├─ hooks/                   # IPC、Window、DOM hooks
│  │  ├─ utils/                   # Vue 应用工厂、HTTP 和日志
│  │  └─ assets/styles/           # 全局 SCSS
│  └─ share/                      # 各进程共享的枚举、类型和配置
├─ electron.vite.config.ts        # electron-vite、多页面和自动导入配置
├─ electron-builder.yml           # 多平台打包和发布配置
├─ package.json
├─ package-lock.json
└─ AGENTS.md                      # 面向开发代理的完整项目协作说明
```

`out/`、`dist/` 和 `node_modules/` 是生成物或依赖目录，不应手工修改。

## 架构说明

### Electron 三层结构

```text
Vue 渲染进程
    │ window.electronAPI
    ▼
Preload 白名单桥接
    │ ipcRenderer / IPC
    ▼
Electron 主进程
```

- **主进程**：负责窗口、托盘、对话框、剪贴板、通知、屏幕、存储和更新等系统能力。
- **预加载脚本**：只暴露经过封装的 `window.electronAPI`，不向页面暴露原始 `ipcRenderer`。
- **渲染进程**：运行 Vue 页面，通过桥接层请求原生能力。
- **共享模块**：保存通道枚举、跨进程类型、语言枚举和默认配置。

所有窗口由 `src/main/window.ts` 的 `createWindow(name, options?, params?)` 创建。开发环境加载 `/pages/<name>/index.html`，生产环境加载构建后的同名页面，因此窗口名必须与页面目录名一致。

### 多页面与窗口

`electron.vite.config.ts` 会自动扫描 `src/renderer/pages/` 的直接子目录。每个页面至少包含：

```text
src/renderer/pages/<页面名>/
├─ index.html
├─ main.ts
└─ App.vue
```

当前有两个页面：

- `main`：900 × 670 的主窗口。
- `trayMenu`：透明、无边框、失焦隐藏的托盘菜单窗口。

页面入口应使用 `@renderer/utils` 中的异步 `createApp(App)`。该工厂会初始化日志、Pinia、应用信息和 vue-i18n，并注册 Vue 全局错误处理器。

### IPC 通信

IPC 通道定义在 `src/share/enum.ts` 的 `BridgeEnum` 中，主进程广播事件定义在 `GlobalEventEnum` 中。当前能力包括：

- 窗口最大化、最小化、还原、关闭及状态查询。
- 打开/保存对话框。
- 语言读取、切换和跨窗口同步。
- 类型化的持久化读写。
- 剪贴板、系统通知、外部链接和本地路径。
- 屏幕信息、应用版本、运行平台。
- 托盘菜单尺寸同步。

示例：

```typescript
const lang = await window.electronAPI.getStore("lang");
await window.electronAPI.setStore("lang", "en-US");

const result = await window.electronAPI.openDialog({
  modal: true,
  properties: ["openFile"]
});

const removeListener = window.electronAPI.onWindowMaximize(() => {
  // 同步页面窗口状态
});

// Vue 组件卸载时调用
removeListener();
```

新增 IPC 时需要同步修改：

1. `src/share/enum.ts`：通道枚举。
2. `src/share/type.ts`：参数和返回值类型。
3. `src/main/bridge.ts`：主进程处理器。
4. `src/preload/api.ts`：渲染进程白名单方法。

### 系统托盘

托盘右键菜单使用 Vue 窗口实现，而不是 Electron 原生 `Menu`。菜单内容通过 `ResizeObserver` 监听尺寸，经过 300 ms debounce 后用 IPC 通知主进程调整窗口大小和位置。托盘双击显示并聚焦主窗口，菜单失焦后自动隐藏。

### 状态与国际化

- Pinia 管理渲染进程状态，当前保存应用版本和平台。
- electron-store 管理持久化数据，schema 位于 `src/share/type.ts`，当前只有 `lang`。
- 支持 `zh-CN`、`zh-TW`、`en-US`，默认 `zh-CN`。
- 主进程使用 i18next，渲染进程使用 vue-i18n；切换语言后由主进程广播给所有窗口。
- 主进程与渲染进程的语言包分别位于各自的 `i18n/modules/`，目前内容为空。

### 日志

主进程和渲染进程都使用 electron-log：

- 文件记录 `info` 及以上级别，按 `YYYY-MM-DD.log` 命名，单文件上限 10 MiB。
- 控制台输出 `debug` 及以上级别。
- 渲染进程日志通过 IPC 汇入主进程文件。
- 两端都捕获未处理异常和 Promise rejection。
- 主进程启动时记录应用、Electron、Chrome、Node 和操作系统版本。

### HTTP

`src/renderer/utils/http.ts` 封装了 `HttpClient`：

- 默认 `baseURL` 为 `VITE_API_URL`。
- 默认超时 10 秒，并使用 JSON。
- 统一记录请求、响应及业务错误。
- 响应包含 `code` 时，仅 `0` 和 `200` 被视为成功。

```typescript
import { http } from "@renderer/utils";

const response = await http.get("/users", { page: 1 });
```

## 环境变量与路径别名

项目使用 `.env`、`.env.development`、`.env.production`。当前三个文件中的 API 地址均为：

```dotenv
VITE_API_URL=http://localhost:3000
```

| 前缀             | 使用范围           |
| ---------------- | ------------------ |
| `MAIN_VITE_`     | 主进程             |
| `PRELOAD_VITE_`  | 预加载脚本         |
| `RENDERER_VITE_` | 渲染进程           |
| `VITE_`          | 项目约定的共享变量 |

| 别名          | 路径             | 范围                     |
| ------------- | ---------------- | ------------------------ |
| `@share/*`    | `src/share/*`    | 主进程、预加载、渲染进程 |
| `@renderer/*` | `src/renderer/*` | 渲染进程                 |

## NPM Scripts

| 命令                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | 启动开发模式并监听文件变化          |
| `npm run start`        | 预览已构建产物                      |
| `npm run typecheck`    | Node 侧和 Web 侧 TypeScript 检查    |
| `npm run build`        | 类型检查后构建                      |
| `npm run lint`         | ESLint 检查并自动修复，会修改文件   |
| `npm run format`       | Prettier 格式化整个项目，会修改文件 |
| `npm run build:unpack` | 构建未封装应用目录                  |
| `npm run build:win`    | 构建 Windows 安装包                 |
| `npm run build:mac`    | 构建 macOS 安装包                   |
| `npm run build:linux`  | 构建 Linux 安装包                   |
| `npm run commit`       | Commitizen 交互式提交               |

项目目前没有测试框架或 `test` 脚本。

## 开发规范

- UTF-8、2 空格缩进。
- Prettier：双引号、分号、100 字符行宽、不保留尾逗号。
- TypeScript、JavaScript、Vue 使用 ESLint；CSS/SCSS 使用 Stylelint。
- 提交信息遵循 Conventional Commits，可用 `npm run commit` 生成。
- pre-commit 运行 lint-staged，commit-msg 运行 commitlint。

允许的提交类型：`build`、`ci`、`docs`、`examples`、`feat`、`fix`、`perf`、`refactor`、`style`、`test`、`revert`、`chore`。

Element Plus 已配置自动导入：

```vue
<template>
  <el-button type="primary" @click="ElMessage.success('完成')">按钮</el-button>
</template>
```

## 打包与自动更新

打包配置位于 `electron-builder.yml`：

- Windows：NSIS，始终创建桌面快捷方式。
- macOS：DMG，当前未启用 notarize。
- Linux：AppImage、snap、deb。
- Electron 和 electron-builder 二进制使用 npmmirror 镜像。

以下值仍是模板占位配置，正式发布前必须替换：

- `appId: com.electron.app`
- `productName: electron-template`
- Windows 可执行文件名 `electron-template`
- `publish.url: https://example.com/auto-updates`

`initUpdater()` 当前只注册更新事件，没有调用 `checkForUpdate()`，所以应用启动后不会主动检查更新。若以后触发检查，现有策略会自动下载，并在下载完成后立即退出安装；开发模式还启用了 `forceDevUpdateConfig`。

## 协作说明

更完整的架构约定、修改规则和基线信息参见 [AGENTS.md](AGENTS.md)。阅读项目时以实际源码和该文件为准。
