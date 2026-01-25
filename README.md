# Ai Talk - 桌面客户端项目

> 🤖 一款集合了多种大语言模型应用的开源桌面客户端

![Version](https://img.shields.io/badge/version-1.0.2-blue)

## 📌 项目介绍

本项目包含两个版本：

1. **Electron 版本** - 原始版本，使用 Electron 构建
2. **Tauri 版本** - 重写版本，使用 Tauri 构建（推荐）

## 🚀 快速开始

### 推荐：使用 Tauri 版本

Tauri 版本具有更小的体积和更好的性能。

```bash
# 进入 Tauri 项目目录
cd tauri-app

# Windows 用户
build.bat

# Linux/macOS 用户
./build.sh
```

详细说明请查看 [tauri-app/QUICKSTART.md](tauri-app/QUICKSTART.md)

### 使用 Electron 版本

```bash
# 安装依赖
npm install

# 开发模式
npm start

# 构建安装包
npm run build
```

## 📊 版本对比

| 特性 | Electron 版本 | Tauri 版本 |
|------|-------------|-----------|
| 安装包大小 | ~150 MB | ~15 MB |
| 内存占用 | ~200 MB | ~50 MB |
| 启动速度 | ~3s | ~1s |
| 性能 | 中等 | 高 |

**推荐使用 Tauri 版本！** 🎯

## 📁 项目结构

```
aichat/
├── tauri-app/              # Tauri 版本（推荐）
│   ├── src-tauri/          # Rust 后端
│   ├── assets/             # 静态资源
│   ├── css/                # 样式文件
│   ├── js/                 # JavaScript 文件
│   ├── *.html              # HTML 页面
│   ├── build.bat           # Windows 构建脚本
│   ├── build.sh            # Linux/macOS 构建脚本
│   ├── README.md           # Tauri 版本文档
│   ├── QUICKSTART.md       # 快速开始
│   ├── README-BUILD.md     # 构建指南
│   └── MIGRATION-SUMMARY.md # 迁移总结
│
├── src/                    # Electron 版本源码
│   ├── js/                 # JavaScript 文件
│   ├── css/                # 样式文件
│   └── view/               # HTML 页面
│
├── assets/                 # 共享资源
│   ├── logo.png            # Logo
│   ├── logo.ico            # Windows 图标
│   ├── logo.icns           # macOS 图标
│   ├── *.svg               # SVG 图标
│   └── Readme.pdf          # 用户手册
│
├── main.js                 # Electron 主进程
├── package.json            # Node.js 配置
├── forge.config.js         # Electron Forge 配置
└── README.md               # 项目主文档
```

## 🤖 支持的 AI 服务

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

## ✨ 核心功能

### 1. AI 模型集成
快速切换到不同的 AI 服务，无需打开多个浏览器标签页。

### 2. 会话分身
将当前会话分离到独立窗口，支持多窗口同时使用。

### 3. 网络设置
自定义代理设置，支持自动保存和恢复。

### 4. 用户手册
内置详细的 PDF 使用说明。

### 5. 跨平台支持
Windows、macOS、Linux 全平台支持。

## 📖 文档

### Tauri 版本文档
- [快速开始](tauri-app/QUICKSTART.md)
- [构建指南](tauri-app/README-BUILD.md)
- [迁移总结](tauri-app/MIGRATION-SUMMARY.md)
- [项目总结](tauri-app/PROJECT-SUMMARY.md)

### Electron 版本文档
- 查看 README.md（本文件）
- [项目文档](./)

## 🎯 推荐使用 Tauri 版本的原因

1. **更小的体积**: 安装包仅 15MB，相比 Electron 版本减小 90%
2. **更好的性能**: 内存占用降低 75%，启动速度提升 67%
3. **更低的资源占用**: CPU 占用显著降低
4. **更现代的技术栈**: 使用 Rust 和 Tauri 2.x

## 🛠️ 技术栈

### Electron 版本
- Electron 33.x
- Node.js
- Webview

### Tauri 版本
- Rust 1.70+
- Tauri 2.x
- WebView2 (Windows) / WebKit (macOS/Linux)
- Vite 5.x

## 📝 开发

### Tauri 版本开发
```bash
cd tauri-app

# Windows
dev.bat

# Linux/macOS
./dev.sh
```

### Electron 版本开发
```bash
npm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

GPL-3.0 License

## 🙏 致谢

感谢所有开源项目的贡献者！

## 📮 联系方式

- GitHub: https://github.com/Funsiooo/Ai-Talk
- Issues: https://github.com/Funsiooo/Ai-Talk/issues

## 📢 免责声明

本项目仅用于学习和交流，请遵守各 AI 服务的使用条款。

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

## 🚦 快速导航

- 🚀 [开始使用](#快速开始)
- 📊 [版本对比](#版本对比)
- 📁 [项目结构](#项目结构)
- 🤖 [支持的 AI 服务](#支持的-ai-服务)
- 📖 [文档](#文档)
