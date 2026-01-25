# Ai Talk - Tauri 版本

## 项目简介

Ai Talk 是一个使用 Tauri 构建的桌面客户端，集成了多个大语言模型应用。相比 Electron 版本，Tauri 版本具有更小的体积和更好的性能。

## 功能特性

- 🤖 **集成多种 AI 服务**
  - DeepSeek（深度求索）
  - 通义千问（阿里）
  - 豆包（字节）
  - 元宝（腾讯）
  - Kimi（月之暗面）
  - ChatGPT（OpenAI）
  - Google Gemini
  - Claude（Anthropic）
  - Poe
  - Manus（蝴蝶效应）
  - Grok（xAI）
  - Meta AI
  - Perplexity
  - Copilot（Microsoft）
  - 文心一言（百度）
  - DeepL 翻译
  - 有道翻译
  - Bing 搜索

- 🌐 **网络设置**
  - 支持设置 HTTP/HTTPS 代理
  - 代理设置自动保存

- 💻 **会话分身**
  - 将当前会话分离到独立窗口
  - 保持会话状态
  - 关闭分身窗口后自动恢复

- 📖 **用户手册**
  - 内置 PDF 用户手册

- ℹ️ **关于程序**
  - 显示版本信息
  - 项目地址和问题反馈链接

## 环境要求

### 必需工具

- **Rust** (1.70+)
  ```bash
  # Windows: 从 https://www.rust-lang.org/tools/install 下载安装
  # 或使用 rustup:
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

- **Node.js** (18+)
  ```bash
  # 从 https://nodejs.org/ 下载安装
  ```

- **WebView2** (Windows)
  - Windows 11 已内置
  - Windows 10: https://developer.microsoft.com/microsoft-edge/webview2/

- **WebKitGTK** (Linux)
  ```bash
  sudo apt install libwebkit2gtk-4.1-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
  ```

### 可选工具

- **Tauri CLI**
  ```bash
  cargo install tauri-cli --version "^2.0.0"
  ```

## 安装依赖

```bash
cd tauri-app
npm install
```

## 开发模式

运行开发模式（热重载）：

```bash
npm run tauri:dev
```

或直接使用：

```bash
npm run dev          # 启动前端开发服务器
npm run tauri dev    # 在另一个终端启动 Tauri 开发模式
```

## 构建生产版本

### Windows 构建

```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/nsis/`

### macOS 构建

```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/dmg/`

### Linux 构建

```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/appimage/` 或 `deb/`

## 项目结构

```
tauri-app/
├── src-tauri/          # Rust 后端代码
│   ├── src/
│   │   └── main.rs    # 主程序逻辑
│   ├── Cargo.toml     # Rust 依赖
│   └── tauri.conf.json # Tauri 配置
├── assets/             # 静态资源文件
│   ├── logo.png       # Logo
│   ├── logo.ico       # Windows 图标
│   ├── logo.icns      # macOS 图标
│   └── Readme.pdf     # 用户手册
├── css/                # 样式文件
│   ├── style.css      # 主样式
│   ├── second.css     # 主页样式
│   ├── proxy.css      # 代理设置样式
│   └── version.css    # 版本信息样式
├── js/                 # JavaScript 文件
│   └── renderer-tauri.js  # 渲染进程逻辑
├── index.html          # 主页面
├── second.html         # 欢迎页面
├── proxy.html          # 代理设置页面
├── about.html          # 关于页面
├── package.json        # Node.js 依赖
└── vite.config.js      # Vite 构建配置
```

## 配置说明

### 窗口配置

编辑 `src-tauri/tauri.conf.json`：

```json
{
  "app": {
    "windows": [
      {
        "title": "Ai Talk",
        "width": 1260,
        "height": 840,
        "resizable": true,
        "fullscreen": false,
        "center": true,
        "decorations": true,
        "alwaysOnTop": false,
        "skipTaskbar": false
      }
    ]
  }
}
```

### 代理配置

代理设置保存在系统用户数据目录：
- Windows: `%LOCALAPPDATA%\Ai Talk\proxy_settings.txt`
- macOS: `~/Library/Application Support/Ai Talk/proxy_settings.txt`
- Linux: `~/.local/share/Ai Talk/proxy_settings.txt`

## 技术栈

- **后端**: Rust + Tauri 2.x
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **构建工具**: Vite 5.x
- **WebView**: WebView2 (Windows) / WebKit (macOS/Linux)

## 常见问题

### 构建失败

1. 确保 Rust 和 Node.js 版本正确
2. 运行 `cargo clean` 清理构建缓存
3. 删除 `node_modules` 重新安装依赖：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 代理设置不生效

1. 重启应用使代理设置生效
2. 检查代理地址格式是否正确（如 `http://127.0.0.1:7890`）
3. 某些网站可能需要在系统级别设置代理

### 开发模式下页面空白

1. 检查控制台错误信息（F12）
2. 确保前端开发服务器正在运行（`npm run dev`）
3. 检查端口 5173 是否被占用

### 图标不显示

确保 `assets/` 目录下的图标文件存在，并且路径正确。

## 性能优化建议

1. **使用发布模式构建**：`npm run tauri:build` 而不是 `npm run tauri:dev`
2. **启用 LTO**：在 `Cargo.toml` 中添加：
   ```toml
   [profile.release]
   lto = true
  codegen-units = 1
   ```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

GPL-3.0 License

## 致谢

感谢所有开源项目的贡献者！

## 联系方式

- GitHub: https://github.com/Funsiooo/Ai-Talk
- Issues: https://github.com/Funsiooo/Ai-Talk/issues

---

**注意**: 本项目仅用于学习和交流，请遵守各 AI 服务的使用条款。
