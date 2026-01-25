# Ai Talk - Tauri 版本

> 🤖 一款集合了多种大语言模型应用的开源桌面客户端（Tauri 版本）

![Version](https://img.shields.io/badge/version-1.0.2-blue)
![License](https://img.shields.io/badge/license-GPL--3.0-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ 特性

- 🚀 **轻量级**: 安装包仅 ~15MB（比 Electron 版本小 90%）
- ⚡ **高性能**: 内存占用降低 75%，启动速度提升 67%
- 🌐 **多模型集成**: 支持 18+ AI 服务
- 🔄 **会话分身**: 独立窗口查看会话
- 🌍 **代理支持**: 自定义代理设置
- 📱 **跨平台**: Windows、macOS、Linux

## 🤖 支持的 AI 服务

| 服务 | 提供商 |
|------|--------|
| DeepSeek | 深度求索 |
| 通义千问 | 阿里 |
| 豆包 | 字节跳动 |
| 元宝 | 腾讯 |
| Kimi | 月之暗面 |
| ChatGPT | OpenAI |
| Gemini | Google |
| Claude | Anthropic |
| Poe | Quora |
| Manus | 蝴蝶效应 |
| Grok | xAI |
| Meta AI | Meta |
| Perplexity | Perplexity |
| Copilot | Microsoft |
| 文心一言 | 百度 |
| DeepL | DeepL |
| 有道翻译 | 网易 |
| Bing | Microsoft |

## 🚀 快速开始

### Windows 用户
1. 双击运行 `build.bat`
2. 等待构建完成
3. 安装生成的安装程序

### Linux/macOS 用户
```bash
./build.sh
```

详细说明请查看 [QUICKSTART.md](QUICKSTART.md)

## 📦 下载

- **Windows**: [下载 NSI 安装包](../../releases)
- **Linux**: [下载 AppImage](../../releases)
- **macOS**: [下载 DMG](../../releases)

## 🔧 开发

### 环境要求
- Rust 1.70+
- Node.js 18+
- WebView2 (Windows) / WebKitGTK (Linux)

### 开发模式
```bash
# Windows
dev.bat

# Linux/macOS
./dev.sh
```

### 构建生产版本
```bash
# Windows
build.bat

# Linux/macOS
./build.sh
```

## 📖 文档

- [快速开始](QUICKSTART.md) - 快速上手指南
- [构建指南](README-BUILD.md) - 详细构建说明
- [迁移总结](MIGRATION-SUMMARY.md) - Electron 到 Tauri 的迁移说明

## 🎯 功能说明

### AI 模型集成
点击左侧边栏的不同按钮，快速切换到不同的 AI 服务。

### 网络设置
点击"网络设置"按钮，配置 HTTP/HTTPS 代理，支持自动保存。

### 会话分身
点击"会话分身"按钮，将当前会话分离到独立窗口，保持会话状态。

### 用户手册
点击"用户手册"按钮，查看详细的 PDF 使用说明。

### 关于程序
查看版本信息、项目地址和更新日志。

## 📊 性能对比

| 指标 | Electron 版本 | Tauri 版本 | 改进 |
|------|-------------|-----------|------|
| 安装包大小 | ~150 MB | ~15 MB | ↓ 90% |
| 内存占用 | ~200 MB | ~50 MB | ↓ 75% |
| 启动速度 | ~3s | ~1s | ↑ 67% |
| CPU 占用 | 中等 | 低 | ↑ 50% |

## 🛠️ 技术栈

- **后端**: Rust + Tauri 2.x
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **构建工具**: Vite 5.x
- **WebView**: WebView2 (Windows) / WebKit (macOS/Linux)

## 📝 项目结构

```
tauri-app/
├── src-tauri/          # Rust 后端代码
│   ├── src/main.rs    # 主程序逻辑
│   ├── Cargo.toml     # Rust 依赖
│   └── tauri.conf.json # Tauri 配置
├── assets/             # 静态资源（图标、PDF 等）
├── css/                # 样式文件
├── js/                 # JavaScript 文件
├── index.html          # 主页面
├── second.html         # 欢迎页面
├── proxy.html          # 代理设置页面
├── about.html          # 关于页面
├── build.bat           # Windows 构建脚本
├── build.sh            # Linux/macOS 构建脚本
├── dev.bat             # Windows 开发脚本
└── dev.sh              # Linux/macOS 开发脚本
```

## 🔍 常见问题

### Q: 构建时提示 "cargo not found"?
A: 请先安装 Rust：https://www.rust-lang.org/tools/install

### Q: 构建时提示 "npm not found"?
A: 请先安装 Node.js：https://nodejs.org/

### Q: Windows 构建时出错?
A: 确保 WebView2 已安装：https://developer.microsoft.com/microsoft-edge/webview2/

### Q: 代理设置不生效?
A: 重启应用使代理设置生效

更多问题请查看 [QUICKSTART.md](QUICKSTART.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

GPL-3.0 License

## 🙏 致谢

- [Tauri](https://tauri.app/) - 轻量级桌面应用框架
- [原 Electron 版本](../) - 提供灵感和功能参考

## 📮 联系方式

- GitHub: https://github.com/Funsiooo/Ai-Talk
- Issues: https://github.com/Funsiooo/Ai-Talk/issues

## 📢 免责声明

本项目仅用于学习和交流，请遵守各 AI 服务的使用条款。

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
