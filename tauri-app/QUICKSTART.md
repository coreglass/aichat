# Ai Talk - Tauri 版本快速开始

## 🚀 一键构建

### Windows 用户
双击运行 `build.bat` 文件，按照提示操作即可。

### Linux/macOS 用户
在终端中运行：
```bash
./build.sh
```

## 📋 前置要求

在构建之前，确保已安装：

### 1. 安装 Rust
```bash
# Windows: 下载安装 https://www.rust-lang.org/tools/install
# Linux/macOS:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. 安装 Node.js
```bash
# 从 https://nodejs.org/ 下载并安装推荐版本（建议 18.x 或更高）
```

### 3. 其他依赖
**Windows:**
- WebView2（Windows 11 已内置，Windows 10 需安装）

**Linux:**
```bash
sudo apt install libwebkit2gtk-4.1-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

## 🎯 开发模式

### Windows
双击运行 `dev.bat`

### Linux/macOS
```bash
./dev.sh
```

或手动运行：
```bash
npm run tauri:dev
```

## 📦 构建产物位置

构建成功后，安装程序位于：

- **Windows**: `src-tauri/target/release/bundle/nsis/Ai Talk_1.0.2_x64-setup.exe`
- **Linux**: `src-tauri/target/release/bundle/appimage/ai-talk_1.0.2_amd64.AppImage`
- **macOS**: `src-tauri/target/release/bundle/dmg/Ai Talk_1.0.2_x64.dmg`

## 🔧 常见问题

### Q: 构建时提示 "cargo not found"
A: 请先安装 Rust：https://www.rust-lang.org/tools/install

### Q: 构建时提示 "npm not found"
A: 请先安装 Node.js：https://nodejs.org/

### Q: Windows 构建时出错
A: 确保 WebView2 已安装：https://developer.microsoft.com/microsoft-edge/webview2/

### Q: Linux 构建时出错
A: 安装依赖：
```bash
sudo apt install libwebkit2gtk-4.1-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

### Q: 构建很慢
A: 首次构建需要下载依赖，后续构建会快很多。可以使用 `cargo clean` 清理缓存后重新构建。

## 📖 功能说明

1. **AI 模型集成**: 点击左侧边栏的不同按钮，加载对应的 AI 服务
2. **网络设置**: 点击"网络设置"按钮，配置代理（需要重启应用生效）
3. **会话分身**: 点击"会话分身"按钮，将当前会话分离到独立窗口
4. **用户手册**: 点击"用户手册"按钮，查看 PDF 手册
5. **关于程序**: 查看版本信息和项目地址

## 🎨 自定义配置

### 修改窗口大小
编辑 `src-tauri/tauri.conf.json`：
```json
{
  "app": {
    "windows": [{
      "width": 1260,
      "height": 840
    }]
  }
}
```

### 添加新的 AI 服务
编辑 `index.html` 和 `js/renderer-tauri.js`，添加新的按钮和事件监听器。

## 📝 更多信息

查看完整文档：[README-BUILD.md](README-BUILD.md)

## 🙏 致谢

- [Tauri](https://tauri.app/) - 轻量级桌面应用框架
- 原始项目：[Electron 版本 Ai Talk](https://github.com/Funsiooo/Ai-Talk)
