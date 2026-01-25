# Ai Talk (Tauri Version)

这是将原始 Electron 版本迁移到 Tauri 框架的版本。

## 项目结构

```
tauri-app/
├── src-tauri/          # Rust 后端代码
│   ├── src/
│   │   ├── main.rs     # Tauri 主程序，处理窗口管理和 IPC
│   │   └── lib.rs
│   ├── Cargo.toml       # Rust 依赖配置
│   ├── tauri.conf.json # Tauri 应用配置
│   └── icons/          # 应用图标
├── index.html          # 主页面
├── proxy.html          # 代理设置窗口
├── about.html          # 关于页面
├── second.html         # 欢迎页面
├── css/               # 样式文件
├── js/                # JavaScript 文件（使用 Tauri API）
├── assets/            # 图片和资源文件
├── package.json        # Node.js 依赖
└── vite.config.js      # Vite 构建配置
```

## 开发环境要求

- Node.js (建议 v18+)
- Rust 工具链 (已通过 rustup 安装)
- npm 或 yarn

## 安装依赖

```bash
cd tauri-app
npm install
```

## 运行开发版本

```bash
npm run tauri:dev
```

## 编译 .exe 文件

```bash
npm run tauri:build
```

编译后的 .exe 文件位于: `src-tauri/target/release/bundle/msi/`

## 主要改动

### 从 Electron 迁移到 Tauri 的关键变化：

1. **后端语言**: JavaScript → Rust
2. **IPC 通信**: `ipcMain/ipcRenderer` → `invoke/listen`
3. **Webview**: `<webview>` → `<iframe>`
4. **窗口管理**: Electron `BrowserWindow` → Tauri `WebviewWindow`
5. **应用体积**: ~100MB+ → ~10MB
6. **启动速度**: 较慢 → 非常快

### 功能说明

- ✅ 16 个 AI 模型入口
- ✅ 网络代理设置（需手动配置系统代理）
- ✅ 会话分身功能
- ✅ 用户手册和关于页面
- ✅ 轻量级启动

### 注意事项

1. **代理设置**: Tauri 不支持像 Electron 那样直接设置会话代理。用户需要在系统设置中配置 HTTP/HTTPS 代理。

2. **iframe 限制**: 某些网站可能限制在 iframe 中加载（X-Frame-Options）。对于这些网站，使用"会话分身"功能打开独立窗口。

3. **图标文件**: 需要为不同平台准备相应尺寸的图标文件。

## 许可证

GPL-3.0
