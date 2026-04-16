# 项目上下文与 AI 助手指南 (social-app)

这是一份关于 `social-app` (基于 Bluesky Social App 的 React Native/Expo 跨平台应用) 的上下文和指令文件，以便 AI 助手能够快速了解项目的架构、主要命令以及开发规范。

## 1. 项目概览

- **项目名称**: bsky.app (social-app)
- **平台支持**: iOS, Android, Web
- **核心框架**: React Native, Expo, TypeScript
- **状态管理 / 数据获取**: `@tanstack/react-query`, `@react-native-async-storage/async-storage`
- **主要协议**: 依赖于 `@atproto/api` (Authenticated Transfer Protocol)
- **多语言机制**: React Native Lingui (`@lingui/react`, `@lingui/cli`)

## 2. 核心脚本与命令

开发中常用以下命令 (基于 `yarn`):

- **启动应用**:
  - `yarn start` (启动 Expo 开发客户端)
  - `yarn ios` / `yarn android` / `yarn web` (启动特定平台)
- **多语言相关** (重要):
  - `yarn intl:extract`: 提取项目中的英文字符串。
  - `yarn intl:compile`: 编译 `.po` 文件为代码可用的格式。
  - `yarn intl:pull` / `yarn intl:push`: 与 Crowdin 进行翻译数据的同步交互。
  - *注意*: 每次修改或添加多语言文案后，**必须运行** `yarn intl:compile` 否则界面上不会更新翻译。
- **打包部署**:
  - 依赖 EAS (`eas.json`) 进行构建 (如 `yarn build-ios`, `yarn build-android`, `yarn build-web`)。

## 3. i18n 多语言/本地化指南 (重点关注)

项目具有非常完善的多语言支持，支持包括但不限于 `zh-CN`, `zh-TW`, `en`, `ja`, `ko` 等近 40 种 locale 语言。

- **配置入口**: `lingui.config.js` 以及 `crowdin.yml`。
- **字典存放路径**: `src/locale/locales/{locale}/messages.po`
- **AI 助手代码操作指引**:
  - 若用户要求添加新文案，请注意寻找当前组件使用的 `msg` 宏或者 `<Trans>` 组件，并且提示用户需要提取/编译字典。
  - 尽量避免直接硬编码（Hardcode）中文或英文字符串到 UI 组件中，应遵循项目中已有的 `@lingui/macro` 使用模式。

## 4. 开发约定与最佳实践

- **跨平台兼容**: 始终注意代码对 Native (iOS/Android) 和 Web (react-native-web) 的兼容性。部分特殊依赖只有 Native 支持，需使用 `.web.tsx` 或 `.native.tsx` 进行后缀区分，或进行平台判断。
- **样式与设计**: 遵循基于 `StyleSheet.create`，以及按需引入 `antd` 或自定义设计系统相关的规范。
- **测试**: 使用 Jest 进行测试，存放于 `__tests__` 以及使用 maestro 进行 E2E 测试 (`__e2e__`)。
- **避免过度工程化**: 保持代码结构的简洁，基于现有的 AT Protocol 架构规范继续扩展功能即可。
