# Electron Template

基于 **Electron + Vue 3 + TypeScript** 的桌面应用项目模板，使用 [electron-vite](https://electron-vite.org/) 作为构建工具，集成了开箱即用的工程化配置。

## 技术栈

| 类别 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | Electron 31 | 桌面应用框架 |
| 前端 | Vue 3 + TypeScript | 渲染进程 UI |
| 构建 | electron-vite + Vite 5 | 主进程/预加载/渲染进程统一构建 |
| UI | Element Plus | 组件库（自动按需导入） |
| 状态管理 | Pinia | Vue 官方状态管理 |
| 样式 | SCSS | CSS 预处理器 |
| HTTP | Axios | 网络请求 |
| 国际化 | i18next + vue-i18n | 主进程 + 渲染进程多语言支持 |
| 持久化 | electron-store | 本地数据存储 |
| 日志 | electron-log | 主进程 + 渲染进程日志 |
| 自动更新 | electron-updater | 应用自动更新 |
| 代码规范 | ESLint + Prettier + Stylelint | 代码格式化与静态检查 |
| Git 规范 | Husky + lint-staged + commitlint + cz | 提交规范与钩子 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建打包

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# 仅构建不打包（调试用）
npm run build:unpack
```

## 项目结构

```
electron-template/
├── .husky/                        # Git hooks
│   ├── commit-msg                 # commitlint 钩子
│   └── pre-commit                 # lint-staged 钩子
├── .vscode/                       # VSCode 配置
├── build/                         # 构建资源（应用图标等）
│   ├── entitlements.mac.plist     # macOS 权限声明
│   ├── icon.icns                  # macOS 图标
│   ├── icon.ico                   # Windows 图标
│   └── icon.png                   # 通用图标
├── resources/                     # 打包资源（通过 asarUnpack 解包）
│   └── icon.png
├── src/
│   ├── main/                      # 🔵 主进程
│   │   ├── index.ts               # 主进程入口
│   │   ├── window.ts              # 窗口创建与管理
│   │   ├── bridge.ts              # IPC 通信桥接（处理渲染进程请求）
│   │   ├── store.ts               # 持久化存储（electron-store）
│   │   ├── logger.ts              # 日志系统初始化
│   │   ├── tray.ts                # 系统托盘
│   │   ├── updater.ts             # 自动更新
│   │   ├── singleInstance.ts      # 单实例锁
│   │   └── i18n.ts                # 主进程国际化
│   ├── preload/                   # 🟡 预加载脚本
│   │   ├── index.ts               # contextBridge 注入
│   │   ├── api.ts                 # 暴露给渲染进程的 API
│   │   └── index.d.ts             # 类型声明
│   ├── renderer/                  # 🟢 渲染进程（Vue 3）
│   │   ├── assets/styles/         # 全局样式
│   │   │   ├── index.scss         # 样式入口
│   │   │   ├── reset.scss         # CSS Reset
│   │   │   └── var.scss           # CSS 变量
│   │   ├── hooks/                 # Vue Composables
│   │   │   ├── useDom.ts          # DOM 相关（ResizeObserver）
│   │   │   └── useEvent.ts        # 事件相关（IPC / Window 事件）
│   │   ├── locales/               # vue-i18n 初始化
│   │   │   └── index.ts
│   │   ├── pages/                 # 多页面入口
│   │   │   ├── main/              # 主窗口
│   │   │   │   ├── App.vue
│   │   │   │   ├── index.html
│   │   │   │   └── main.ts
│   │   │   └── trayMenu/          # 托盘菜单窗口
│   │   │       ├── App.vue
│   │   │       ├── index.html
│   │   │       └── main.ts
│   │   ├── stores/                # Pinia 状态管理
│   │   │   ├── app.ts             # 应用状态
│   │   │   └── index.ts
│   │   ├── utils/                 # 工具函数
│   │   │   ├── createApp.ts       # Vue 应用工厂
│   │   │   ├── http.ts            # Axios 封装
│   │   │   ├── logger.ts          # 渲染进程日志
│   │   │   └── index.ts
│   │   └── env.d.ts               # 环境变量类型声明
│   └── share/                     # 🔄 主进程/渲染进程共享
│       ├── enum.ts                # 枚举（BridgeEnum、GlobalEventEnum、LangEnum）
│       ├── type.ts                # 类型定义（StoreSchema、NotificationParams 等）
│       ├── config.ts              # 共享配置
│       └── locales/               # 翻译文件
│           ├── zh-CN.ts
│           ├── zh-TW.ts
│           └── en.ts
├── .czrc                          # commitizen 配置
├── .editorconfig                  # 编辑器配置
├── .env                           # 通用环境变量
├── .env.development               # 开发环境变量
├── .env.production                # 生产环境变量
├── .eslintrc.cjs                  # ESLint 配置
├── .prettierrc.yaml               # Prettier 配置
├── .stylelintrc.js                # Stylelint 配置
├── commitlint.config.js           # commitlint 配置
├── electron-builder.yml           # electron-builder 打包配置
├── electron.vite.config.ts        # electron-vite 构建配置
├── lint-staged.config.js          # lint-staged 配置
├── package.json
├── tsconfig.json                  # TypeScript 项目引用入口
├── tsconfig.node.json             # 主进程/预加载 TS 配置
└── tsconfig.web.json              # 渲染进程 TS 配置
```

## 核心架构说明

### 三进程架构

项目遵循 Electron 的标准三进程模型：

```
┌─────────────┐     IPC     ┌─────────────┐     contextBridge     ┌─────────────┐
│  主进程 Main │ ◄────────► │  预加载脚本  │ ◄──────────────────► │ 渲染进程 Vue │
│  (Node.js)   │            │  (Preload)   │                      │  (Chromium)  │
└─────────────┘            └─────────────┘                      └─────────────┘
     @share                      @share                              @share + @renderer
```

- **主进程**（`src/main/`）：运行在 Node.js 环境，管理窗口、系统托盘、文件系统、原生 API 等
- **预加载脚本**（`src/preload/`）：安全桥接层，通过 `contextBridge` 将选定的 API 暴露给渲染进程
- **渲染进程**（`src/renderer/`）：运行在 Chromium 环境，使用 Vue 3 构建 UI
- **共享模块**（`src/share/`）：主进程与渲染进程共用的枚举、类型、配置和翻译文件

### IPC 通信机制

IPC 通信是本模板的核心设计之一，遵循以下约定：

1. **枚举驱动**：所有 IPC 通道名称定义在 [enum.ts](src/share/enum.ts) 的 `BridgeEnum` 中，确保主进程和渲染进程使用一致的通道名
2. **预加载桥接**：渲染进程不直接使用 `ipcRenderer`，而是通过 [preload/api.ts](src/preload/api.ts) 封装的方法调用
3. **全局类型安全**：[preload/index.d.ts](src/preload/index.d.ts) 将 API 声明到 `window.electronAPI`，渲染进程中可直接使用且具有完整类型提示

在渲染进程中使用示例：

```typescript
// 读取持久化数据
const locale = await window.electronAPI.getStore("locale")

// 写入持久化数据
await window.electronAPI.setStore("locale", "en")

// 调用系统对话框
const result = await window.electronAPI.openDialog({ modal: true })

// 监听主进程广播事件
window.electronAPI.ipcOn("window:maximize", () => { /* ... */ })
```

新增 IPC 通道的步骤：

1. 在 [share/enum.ts](src/share/enum.ts) 的 `BridgeEnum` 中添加枚举值
2. 在 [share/type.ts](src/share/type.ts) 中定义相关参数/返回值类型（如需要）
3. 在 [main/bridge.ts](src/main/bridge.ts) 中注册 `ipcMain` 处理器
4. 在 [preload/api.ts](src/preload/api.ts) 中封装对应的调用方法

### 多页面（多窗口）

项目支持多页面架构，通过 `electron.vite.config.ts` 自动扫描 `src/renderer/pages/` 目录：

- 每个子目录为一个独立的页面/窗口，需包含 `index.html`、`main.ts`、`App.vue`
- 已内置两个页面：
  - `main`：应用主窗口
  - `trayMenu`：系统托盘右键菜单窗口

新增页面只需在 `src/renderer/pages/` 下创建新目录并包含上述三个文件即可，构建配置会自动识别。

### 窗口管理

[window.ts](src/main/window.ts) 提供统一的窗口创建函数 `createWindow(name, options?, params?)`：

- 自动根据开发/生产环境加载对应的 URL 或文件
- 内置窗口状态事件广播（最大化、最小化、还原）
- 内置渲染进程崩溃恢复机制
- 阻止 `window.open`，改为系统浏览器打开

### 状态管理

采用双层状态管理：

- **Pinia**（`src/renderer/stores/`）：管理渲染进程的响应式 UI 状态
- **electron-store**（`src/main/store.ts`）：管理需要持久化的数据（如语言偏好）

`StoreSchema` 定义在 [share/type.ts](src/share/type.ts) 中，确保类型一致。

### 国际化（i18n）

采用双层国际化方案：

- **主进程**（`src/main/i18n.ts`）：使用 `i18next`，用于系统原生 UI（如托盘提示、通知等）
- **渲染进程**（`src/renderer/locales/`）：使用 `vue-i18n`，用于页面 UI
- **翻译文件**共享于 `src/share/locales/`，支持简体中文、繁体中文、英文

切换语言时，渲染进程通过 IPC 通知主进程，主进程再广播给所有窗口同步更新。

### 日志系统

基于 `electron-log`，主进程和渲染进程均支持日志：

- **主进程**（`src/main/logger.ts`）：记录到文件（按日期命名），控制台输出 debug 级别
- **渲染进程**（`src/renderer/utils/logger.ts`）：通过 IPC 将日志转发到主进程统一处理
- 应用启动时自动记录版本、系统环境等关键信息

### HTTP 请求

[http.ts](src/renderer/utils/http.ts) 基于 Axios 封装了 `HttpClient` 类：

- 自动读取 `VITE_API_URL` 环境变量作为 `baseURL`
- 内置请求/响应拦截器，统一错误处理和日志记录
- 默认导出 `http` 实例，可直接使用 `http.get()` / `http.post()`

### 自动更新

[updater.ts](src/main/updater.ts) 基于 `electron-updater` 实现自动更新：

- 支持自动下载和安装
- 更新服务器地址配置在 `electron-builder.yml` 的 `publish` 字段和 `dev-app-update.yml` 中
- 完整的更新生命周期日志

## 路径别名

| 别名 | 路径 | 可用范围 |
| --- | --- | --- |
| `@renderer` | `src/renderer` | 渲染进程 |
| `@share` | `src/share` | 所有进程 |

## 环境变量

环境变量通过 `.env`、`.env.development`、`.env.production` 文件配置，前缀决定变量的可用范围：

| 前缀 | 可用范围 | 示例 |
| --- | --- | --- |
| `MAIN_VITE_` | 仅主进程 | `MAIN_VITE_KEY=123` |
| `PRELOAD_VITE_` | 仅预加载脚本 | `PRELOAD_VITE_KEY=123` |
| `RENDERER_VITE_` | 仅渲染进程 | `RENDERER_VITE_KEY=123` |
| `VITE_` | 所有进程共用 | `VITE_API_URL=http://localhost:3000` |

在代码中通过 `import.meta.env.VITE_XXX` 访问。

## NPM Scripts

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发模式（监听文件变化自动重载） |
| `npm run build` | 类型检查 + 构建 |
| `npm run build:win` | 构建 + 打包 Windows 安装程序 |
| `npm run build:mac` | 构建 + 打包 macOS 安装程序 |
| `npm run build:linux` | 构建 + 打包 Linux 安装程序 |
| `npm run build:unpack` | 构建 + 打包为目录（调试用） |
| `npm run start` | 预览构建产物 |
| `npm run lint` | ESLint 检查并自动修复 |
| `npm run format` | Prettier 格式化 |
| `npm run typecheck` | TypeScript 类型检查（主进程 + 渲染进程） |
| `npm run commit` | 使用 commitizen 交互式提交 |

## 开发规范

### 代码风格

| 工具 | 配置文件 | 说明 |
| --- | --- | --- |
| ESLint | `.eslintrc.cjs` | JS/TS/Vue 代码检查 |
| Prettier | `.prettierrc.yaml` | 代码格式化（双引号、分号、100 字符行宽） |
| Stylelint | `.stylelintrc.js` | CSS/SCSS 代码检查（属性排序） |
| EditorConfig | `.editorconfig` | 编辑器统一配置（UTF-8、2 空格缩进、LF 换行） |

### Git 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 交互式提交（推荐）
npm run commit

# 或手动遵循格式
git commit -m "feat: 新增xxx功能"
```

提交类型：

| 类型 | 说明 |
| --- | --- |
| `feat` | 新增功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响逻辑） |
| `refactor` | 重构代码 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建系统变更 |
| `ci` | CI/CD 配置变更 |
| `chore` | 其他日常事务 |
| `revert` | 回滚提交 |

### Git Hooks

- **pre-commit**：提交前自动运行 lint-staged，对暂存文件执行 Prettier + ESLint + Stylelint
- **commit-msg**：提交信息格式校验（commitlint）

### Element Plus 自动导入

项目配置了 `unplugin-auto-import` 和 `unplugin-vue-components`，Element Plus 组件和 API 无需手动导入：

```vue
<template>
  <el-button type="primary">按钮</el-button>
</template>

<script setup lang="ts">
// 无需 import ElMessage，直接使用
ElMessage.success("操作成功")
</script>
```

## 打包配置

打包配置位于 `electron-builder.yml`，主要配置项：

- **appId**：`com.electron.app`（需修改为你的应用 ID）
- **productName**：`electron-template`（需修改为你的应用名称）
- **Windows**：使用 NSIS 安装程序，自动创建桌面快捷方式
- **macOS**：支持 DMG 打包，需配置 `entitlements.mac.plist`
- **Linux**：支持 AppImage / snap / deb 格式
- **自动更新**：使用 `generic` provider，需修改 `publish.url` 为实际更新服务器地址
- **Electron 镜像**：默认使用 `npmmirror.com` 加速下载

## IDE 推荐

- [VSCode](https://code.visualvisualstudio.com/) + 以下扩展：
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
