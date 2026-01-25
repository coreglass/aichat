# Ai Talk - Tauri 版本

> 一个集合了多种大语言模型应用的开源桌面客户端

![Version](https://img.shields.io/badge/version-1.0.2-blue)
![License](https://img.shields.io/badge/license-GPL--3.0-green)

## ✨ 特性

- 🚀 **轻量级** - 基于 Tauri 2.x 构建，安装包仅 ~15MB
- 🎯 **多模型支持** - 集成 18+ AI 服务
- 💬 **会话管理** - 支持创建、切换、删除会话
- ⚙️ **模型管理** - 可启用/禁用特定模型
- 🌐 **代理支持** - 自定义网络代理设置
- 📖 **跨平台** - Windows、macOS、Linux

## 🎯 功能说明

### 1. 会话管理

**创建新会话**
- 点击左侧"新会话"按钮
- 自动使用第一个启用的模型
- 会话名称格式：`新会话 HH:MM:SS`

**切换会话**
- 在会话列表中点击任意会话
- 会话标签页切换到对应的 AI 模型
- 当前选中的会话会高亮显示

**删除会话**
- 鼠标悬停在会话上
- 点击"×"按钮删除
- 确认删除后自动恢复到可用状态

### 2. 模型管理

**模型设置页面**
- 点击左侧"模型设置"按钮进入
- 显示所有可用的 AI 模型
- 勾选/取消勾选来启用或禁用模型
- 点击"保存设置"应用更改
- 点击"恢复默认"恢复原始配置

**模型选择器**
- 在会话页面右上角点击"选择模型"
- 弹窗显示所有启用的模型
- 点击模型直接应用到当前会话

### 3. 其他功能

**网络设置**
- 支持设置 HTTP/HTTPS 代理
- 代理地址格式：`http://127.0.0.1:7890`
- 设置后需要重启应用生效

**关于程序**
- 显示版本信息
- GitHub 项目地址和问题反馈链接
- 许可协议和作者信息

**用户手册**
- 内置 PDF 使用手册

## 📦 支持的 AI 服务

| 服务 | 提供商 | 说明 |
|------|--------|------|
| DeepSeek | 深度求索 | AI 对话与搜索 |
| 通义千问 | 阿里 | AI 文本生成 |
| 豆包 | 字节跳动 | AI 对话与搜索 |
| 元宝 | 腾讯 | AI 对话与搜索 |
| Kimi | 月之暗面 | AI 对话 |
| ChatGPT | OpenAI | AI 对话 |
| Google Gemini | Google | AI 对话与搜索 |
| Claude | Anthropic | AI 对话 |
| Poe | Quora | 多 AI 模型平台 |
| Manus | 蝴蝶效应 | AI 工具 |
| Grok | xAI | AI 对话 |
| Meta AI | Meta | AI 对话 |
| Perplexity | Perplexity | AI 搜索与对话 |
| Copilot | Microsoft | AI 对话 |
| 文心一言 | 百度 | AI 对话 |
| DeepL | DeepL | 翻译 |
| 有道翻译 | 网易 | 翻译 |
| Sciencepal | Sciencepal | AI 工具 |
| Bing | Microsoft | 搜索引擎 |

## 🚀 快速开始

### 前置要求

- **Rust** (1.70+)
- **Node.js** (18+)
- **npm** 或 **yarn**
- **WebView2** (Windows)
- **WebKitGTK** (Linux)
- **Xcode Command Line Tools** (macOS)

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run tauri:dev
```

### 构建生产版本

#### Windows
```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/nsis/`

#### Linux
```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/appimage/`

#### macOS
```bash
npm run tauri:build
```

构建产物位于：`src-tauri/target/release/bundle/dmg/`

## 📁 项目结构

```
tauri-app/
├── src-tauri/              # Rust 后端代码
│   ├── src/
│   │   └── main.rs          # 主程序逻辑
│   ├── Cargo.toml             # Rust 依赖配置
│   └── tauri.conf.json        # Tauri 配置
├── assets/                   # 静态资源
│   ├── logo.png              # Logo
│   ├── *.ico                # 图标文件
│   ├── *.png                # 图标文件
│   ├── *.svg                # SVG 图标
│   └── Readme.pdf            # 用户手册
├── css/                      # 样式文件
│   ├── style.css             # 主页面样式
│   ├── conversation.css       # 会话列表样式
│   ├── model-settings.css     # 模型设置样式
│   ├── proxy.css             # 代理设置样式
│   └── about.css             # 关于页面样式
├── js/                       # JavaScript 文件
│   ├── main.js                # 主页面逻辑
│   ├── conversation.js        # 会话列表逻辑
│   ├── model-settings.js      # 模型设置逻辑
│   ├── proxy.js              # 代理设置逻辑
│   └── about.js               # 关于页面逻辑
├── index.html                 # 主页面
├── conversation.html           # 会话列表页面
├── model-settings.html         # 模型设置页面
├── proxy.html                # 代理设置页面
├── about.html                # 关于页面
├── package.json               # Node.js 配置
└── vite.config.js             # Vite 构建配置
```

## 🔧 开发

### 技术栈

- **后端**: Rust + Tauri 2.x
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **构建工具**: Vite 5.x
- **WebView**: WebView2 (Windows) / WebKit (macOS/Linux)

### Tauri Commands

#### 会话管理
- `get_conversations` - 获取所有会话
- `create_conversation` - 创建新会话
- `delete_conversation` - 删除会话
- `update_conversation_model` - 更新会话的模型

#### 模型管理
- `get_models` - 获取所有模型
- `toggle_model` - 切换模型启用状态
- `save_models` - 保存模型配置

#### 网络
- `open_proxy_dialog` - 打开代理设置弹窗
- `set_proxy` - 设置代理
- `clear_proxy` - 清除代理

#### 其他
- `open_about_dialog` - 打开关于程序弹窗
- `open_manual` - 打开用户手册
- `close_window` - 关闭窗口

## 📊 数据存储

### 会话数据
- 位置：`%LOCALAPPDATA%\Ai Talk\conversations.json`
- 格式：JSON 数组
- 结构：
  ```json
  [
    {
      "id": "conv-1737123456",
      "name": "新会话 23:45:12",
      "model_id": "deepseek",
      "created_at": "2025-01-25 23:45:12"
    }
  ]
  ```

### 模型数据
- 位置：`%LOCALAPPDATA%\Ai Talk\models.json`
- 格式：JSON 数组
- 结构：
  ```json
  [
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "provider": "深度求索",
      "url": "https://chat.deepseek.com/",
      "icon": "assets/deepseek.svg",
      "enabled": true
    }
  ]
  ```

## 🎨 界面设计

### 配色方案

- **主色调**: #2c3e50（深蓝色）
- **次要色**: #667eea（紫色）
- **背景色**: #f5f5f5（浅灰色）
- **文本色**: #333（深灰色）
- **边框色**: #e9ecef（浅灰色）
- **成功色**: #4caf50（绿色）
- **警告色**: #f093fb（橙色）
- **错误色**: #e74c3c（红色）

### 响应式设计
- **桌面端**: 1260×840（最小 800×600）
- **移动端**: 支持触控和手势操作
- **滚动条**: 自定义样式

## 🐛 常见问题

### 编译相关

**Q: 构建时提示找不到 tauri 依赖？**
A: 运行 `npm install` 安装依赖。

**Q: 编译时出现所有权错误？**
A: 检查 Rust 代码中的 `mut` 和借用规则。

**Q: 构建很慢？**
A: 首次编译需要下载依赖，后续会快很多。

### 功能相关

**Q: 按钮点击没有反应？**
A: 检查浏览器控制台（F12）是否有错误信息。
A: 确认 JavaScript 文件是否正确加载。

**Q: 模型列表不显示？**
A: 确认 `src-tauri/src/main.rs` 中的 `get_default_models()` 函数是否返回正确的模型数据。

**Q: 会话数据不保存？**
A: 检查是否有写入权限到 `%LOCALAPPDATA%\Ai Talk\` 目录。

**Q: 模型设置不生效？**
A: 点击"保存设置"后检查是否真的保存到了 `models.json` 文件。

## 📝 更新日志

### v2.0.2 (2025-01-25)

#### 新增
- ✨ 完全重新设计的用户界面
- ✨ 会话管理系统（创建、切换、删除）
- ✨ 模型管理系统（启用/禁用）
- ✨ 改进的页面布局和交互
- ✨ 数据持久化（JSON 文件）
- ✨ 模型选择器（在会话页面）

#### 优化
- ⚡ 代码质量提升
- 🐛 修复了之前的编译错误
- 📚 改进错误处理和用户提示
- 🎨 优化了构建流程和文件组织

#### 待实现
- [ ] 会话搜索功能
- [ ] 会话导出/导入
- [ ] 会话分组
- [ ] 模型自定义排序
- [ ] 模型分组
- [ ] 主题切换（深色/浅色模式）
- [ ] 快捷键支持
- [ ] 拖拽上传
- [ ] 通知功能
- [ ] 自动更新

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

### 贡献指南

- 代码风格：遵循 Rust 官方代码风格
- 提交信息：清晰描述你的更改
- 测试：确保新功能经过测试
- 文档：更新相关文档和更新日志

## 📄 许可证

GPL-3.0 License

Copyright © 2025 Funsiooo

## 🙏 致谢

- [Tauri](https://tauri.app/) - 轻量级桌面应用框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- 原项目作者 - 提供灵感和功能参考

## 📮 联系方式

- GitHub: https://github.com/Funsiooo/Ai-Talk
- Issues: https://github.com/Funsiooo/Ai-Talk/issues

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
