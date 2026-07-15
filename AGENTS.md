# 项目协作指南

## 1. 项目定位

这是一个桌面应用模板，而不是已经完成的业务产品。它以 Electron 为宿主、Vue 3 为渲染层，使用 TypeScript 编写主进程、预加载脚本和页面代码，并通过 electron-vite 统一开发与构建。

当前 UI 主要用于验证模板能力：主窗口只展示一个 Element Plus 按钮，托盘菜单只展示固定尺寸的“右键菜单”。多语言资源目前都是空对象，自动更新地址、应用 ID、产品名等也仍是示例值。

## 2. 技术栈与依赖管理

- 桌面端：Electron 31、electron-vite 2、electron-builder 24。
- 渲染层：Vue 3、TypeScript、Vite 5、Element Plus、Pinia、SCSS。
- 基础能力：Axios、electron-store、electron-log、electron-updater。
- 国际化：主进程使用 i18next，渲染进程使用 vue-i18n。
- 工程规范：ESLint、Prettier、Stylelint、Husky、lint-staged、commitlint、Commitizen。
- 使用 npm 管理依赖，锁文件为 `package-lock.json`。README 声明 Node.js >= 18、npm >= 9，但 `package.json` 没有通过 `engines` 强制限制版本。

## 3. 目录职责

```text
src/
├─ main/                 Electron 主进程
│  ├─ index.ts           应用启动和各模块初始化
│  ├─ window.ts          通用窗口工厂、窗口事件广播和崩溃处理
│  ├─ bridge.ts          ipcMain 处理器
│  ├─ tray.ts            托盘及自定义托盘菜单窗口
│  ├─ store.ts           electron-store 持久化
│  ├─ logger.ts          主进程日志初始化
│  ├─ updater.ts         electron-updater 生命周期
│  ├─ singleInstance.ts  单实例锁
│  └─ i18n/              当前应保留的主进程多语言实现与资源
├─ preload/              安全桥接层，向 window.electronAPI 暴露白名单 API
├─ renderer/             Vue 渲染进程
│  ├─ pages/             多页面入口；当前有 main 和 trayMenu
│  ├─ i18n/              vue-i18n 初始化及渲染层语言包
│  ├─ stores/            Pinia store
│  ├─ hooks/             IPC/Window 事件和 ResizeObserver hooks
│  ├─ utils/             Vue 应用工厂、HTTP、日志等工具
│  └─ assets/styles/     reset、全局变量及样式入口
└─ share/                各进程共享的枚举、类型、默认配置和日志辅助函数
```

其他重要位置：

- `electron.vite.config.ts`：三类进程的 Vite 配置、路径别名、多页面扫描、Element Plus 自动导入。
- `electron-builder.yml`：Windows/macOS/Linux 打包与自动更新发布配置。
- `build/`：安装包图标和 macOS entitlement 等构建资源。
- `resources/`：运行时资源；打包时通过 `asarUnpack` 解包。
- `out/`、`dist/`、`node_modules/`：生成物或依赖，不应手工修改，也不要纳入项目分析结论。

## 4. 启动与运行链路

主进程入口是 `src/main/index.ts`，构建后入口为 `out/main/index.js`。应用启动顺序如下：

1. 在 `app.whenReady()` 之前申请单实例锁；第二个实例启动时，显示并聚焦已有主窗口。
2. Electron ready 后设置 AppUserModelId，并启用开发快捷键管理。
3. 依次初始化日志、持久化存储、主进程国际化、IPC、自动更新监听器。
4. 创建名为 `main` 的主窗口，再创建系统托盘及名为 `trayMenu` 的无边框窗口。
5. 非 macOS 平台在所有窗口关闭后退出；macOS 遵循常规 activate 行为。

`createWindow(name, options?, params?)` 是统一窗口工厂。开发环境加载 `${ELECTRON_RENDERER_URL}/pages/${name}/index.html`，生产环境加载 `out/renderer/pages/${name}/index.html`。因此窗口名必须与 `src/renderer/pages/` 下的页面目录名完全一致。

窗口默认 900×670、先隐藏后在 `ready-to-show` 显示、自动隐藏菜单栏。Linux 显式设置图标。所有窗口共用预加载脚本；`sandbox` 当前设为 `false`。新窗口请求会被拒绝并交给系统浏览器打开。渲染进程崩溃时会提示重新加载或关闭。

## 5. 渲染页面约定

`electron.vite.config.ts` 会扫描 `src/renderer/pages/` 的每个直接子目录，并把其中的 `index.html` 注册成 Rollup 输入。新增页面时至少创建：

```text
src/renderer/pages/<页面名>/
├─ index.html
├─ main.ts
└─ App.vue
```

页面入口应通过 `@renderer/utils` 导出的异步 `createApp(App)` 创建应用，不要直接调用 Vue 的 `createApp`。公共工厂会按顺序完成：

1. 初始化渲染进程日志。
2. 安装 Pinia，并通过 IPC 读取应用版本和平台。
3. 初始化 vue-i18n 并监听跨窗口语言变化。
4. 注册 Vue 全局错误处理器。

Element Plus 组件和可自动导入 API 已由插件按需引入。全局样式从 `src/renderer/assets/styles/index.scss` 进入。全局 reset 会让 `html`、`body`、`#app` 占满窗口、隐藏溢出、禁止文本选择；页面若需要滚动或选中文本，应显式覆盖。

托盘右键菜单不是 Electron 原生 `Menu`，而是透明、无边框的 Vue 窗口。其内容尺寸通过 `ResizeObserver`、300 ms debounce 和 `trayMenuResize` IPC 回传主进程，主进程再调整窗口并按任务栏位置重新定位。托盘双击会显示主窗口，菜单窗口失焦会隐藏。

## 6. IPC 设计与修改规则

渲染进程不得直接导入或调用 Electron 主进程 API，应使用 `window.electronAPI`。调用链为：

```text
Vue 页面 → preload/api.ts → ipcRenderer → main/bridge.ts → Electron/业务能力
```

IPC 通道统一定义在 `src/share/enum.ts` 的 `BridgeEnum` 中；主进程向窗口广播的事件定义在 `GlobalEventEnum` 中。当前桥接能力包括：

- 窗口最大化、最小化、还原、关闭和最大化状态查询。
- 打开/保存对话框；`modal: true` 时绑定当前窗口。
- 语言读取与切换，以及向所有窗口广播语言变化。
- 类型化的持久化读取和写入。
- 剪贴板读写、系统通知、外部 URL/本地路径打开。
- 屏幕信息、应用版本、平台信息。
- 托盘菜单窗口尺寸同步。

新增或修改 IPC 时同步维护以下位置：

1. 在 `src/share/enum.ts` 增加或调整通道枚举。
2. 在 `src/share/type.ts` 定义跨进程参数、返回值和持久化 schema。
3. 在 `src/main/bridge.ts` 注册 `ipcMain.on` 或 `ipcMain.handle`。
4. 在 `src/preload/api.ts` 暴露最小必要 API；`src/preload/index.d.ts` 会通过 `typeof api` 自动获得类型。
5. 若是主进程广播事件，在 preload 中提供返回“取消监听函数”的专用订阅方法，并在 Vue 组件卸载时清理。

不要把原始 `ipcRenderer`、事件对象或不受约束的通道发送能力暴露给渲染进程。

## 7. 状态、国际化、日志与网络

### 状态与持久化

- Pinia 只管理渲染层响应式状态。当前 `app` store 保存 `appVersion` 和 `platform`。
- electron-store 管理持久化配置。schema 在 `StoreSchema` 中维护，当前只有 `lang`。
- 增加持久化字段时，应同时更新 `StoreSchema` 和 `initStore()` 的默认值，再通过 preload 暴露的泛型 get/set 使用。

### 国际化

- 支持 `zh-CN`、`zh-TW`、`en-US`，默认 `zh-CN`。
- 主进程语言保存在 electron-store，使用 i18next；渲染进程启动时从主进程读取语言，使用 vue-i18n。
- 页面切换语言时调用 `changeLang()`；主进程持久化后向所有窗口广播 `langChanged`，以保持多窗口同步。
- 主进程与渲染进程的语言资源目前分别放在各自 `i18n/modules/` 下，两个目录都要同步维护相同语言及 key。

### 日志

- 主进程和渲染进程都使用 electron-log，并通过 `src/share/logger.ts` 序列化 Error 等非普通对象。
- 文件日志记录 `info` 及以上级别，单文件上限 10 MiB，按 `YYYY-MM-DD.log` 命名；控制台输出 `debug` 及以上级别。
- 渲染日志通过 IPC 汇入主进程文件。两端都启用了未捕获异常/Promise rejection 捕获。
- 排查问题优先使用项目 logger，不要只写 `console.log`。

### HTTP

- `src/renderer/utils/http.ts` 提供默认 `http` 实例和可复用 `HttpClient`。
- 默认 base URL 为 `import.meta.env.VITE_API_URL`，超时 10 秒，JSON 请求。
- 响应若包含 `code` 且不是 `0` 或 `200`，会作为业务错误拒绝；调用方仍需捕获异常并处理用户态反馈。

## 8. 环境变量与路径别名

当前 `.env`、`.env.development`、`.env.production` 都把 `VITE_API_URL` 设置为 `http://localhost:3000`。按 electron-vite 约定：

- `MAIN_VITE_`：主进程。
- `PRELOAD_VITE_`：预加载脚本。
- `RENDERER_VITE_`：渲染进程。
- `VITE_`：项目约定为各进程共用；新增变量时还要补充相应 TypeScript 声明。

可用别名：

- `@share/*` → `src/share/*`，主进程、预加载和渲染进程均可用。
- `@renderer/*` → `src/renderer/*`，只在渲染进程使用。

共享目录只能放各目标环境都能安全解析的代码。若共享类型需要 Electron 类型，优先使用 `import type`，避免把仅用于类型的运行时依赖带入渲染包。

## 9. 常用命令与验证要求

```bash
npm install             # 安装依赖；postinstall 会安装原生应用依赖
npm run dev             # 开发模式并监听文件变化
npm run typecheck       # 依次检查 Node 侧和 Web 侧类型
npm run lint            # ESLint 检查并自动修复，会修改文件
npm run format          # Prettier 格式化整个项目，会修改文件
npm run build           # 类型检查后执行 electron-vite build
npm run start           # 预览已构建产物
npm run build:unpack    # 构建未封装目录，便于调试
npm run build:win       # Windows NSIS 安装包
npm run build:mac       # macOS DMG
npm run build:linux     # AppImage、snap、deb
npm run commit          # Commitizen 交互式提交
```

当前没有测试框架或 `test` 脚本。修改后至少运行与改动相关的 typecheck；涉及构建配置、页面入口或打包资源时运行 `npm run build`，必要时再运行对应平台的打包命令。由于 `lint` 和 `format` 都会写文件，运行前先检查工作区，避免改动无关文件。

## 10. 代码与提交规范

- UTF-8、2 空格缩进；EditorConfig 期望 LF 和文件末尾换行。
- Prettier 使用双引号、分号、100 字符行宽、不保留尾逗号；其 `endOfLine` 配置为 `auto`。
- Vue、TypeScript、JavaScript 由 ESLint 检查；CSS/SCSS 由 Stylelint 检查。
- 可使用 `any`，Vue 组件名不强制多单词，非必填 prop 不强制默认值，但新增代码仍应优先使用明确类型。
- 提交信息遵循 Conventional Commits。允许的 type 为：`build`、`ci`、`docs`、`examples`、`feat`、`fix`、`perf`、`refactor`、`style`、`test`、`revert`、`chore`。
- pre-commit 会对暂存代码运行 lint-staged；commit-msg 会运行 commitlint。

## 11. 打包与发布注意事项

- `electron-builder.yml` 当前的 `appId: com.electron.app`、`productName: electron-template`、Windows 可执行文件名以及 `publish.url: https://example.com/auto-updates` 都是模板占位值，正式产品必须替换。
- Windows 使用 NSIS，并始终创建桌面快捷方式；macOS 未启用 notarize；Linux 同时配置 AppImage、snap 和 deb。
- Electron 和 electron-builder 二进制使用 npmmirror 镜像。
- `initUpdater()` 目前只注册监听器，没有调用 `checkForUpdate()`，因此应用启动后不会主动发起检查。
- 更新器配置了自动下载和下载完成后立即 `quitAndInstall()`，且 `forceDevUpdateConfig = true`。调整更新策略时需同时检查 `src/main/updater.ts`、`electron-builder.yml` 和 `dev-app-update.yml`。


