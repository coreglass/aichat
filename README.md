# AI Chat Client

一个现代化的AI聊天客户端，支持多种大模型和自定义API endpoint。

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Tauri](https://img.shields.io/badge/Tauri-2.1.0-FFC131)
![Rust](https://img.shields.io/badge/Rust-1.74+-orange)

## ✨ 主要功能

### 🤖 多模型支持
- **智谱AI**: GLM-4系列模型（GLM-4-Plus、GLM-4、GLM-4-Flash、GLM-4-Air等）
- **Gemini**: Gemini 2.0 Flash、Gemini 1.5 Pro、Gemini 1.5 Flash
- **自定义模型商**: 支持添加任意兼容OpenAI格式的API endpoint

### 💬 聊天功能
- 实时流式输出，无需等待完整响应
- 完整的Markdown渲染支持
- 代码高亮和一键复制
- 对话历史管理
- Token使用统计
- 精确的时间戳显示
- 停止生成功能（带确认对话框）

### 🎨 界面定制
- 字体大小调节（小/中/大/特大）
- 深色/浅色主题切换
- 自定义用户头像
- 界面语言选择（简体中文/English）
- 可拖动调整输入框高度

### 🌐 翻译助手
- 支持多种语言互译
- AI自动检测源语言
- 流式翻译输出
- 可选择翻译使用的模型
- 支持的语言：中文、英语、日语、韩语、法语、德语、西班牙语

### ⌨️ 输入增强
- Alt+Enter 插入换行
- 字符计数器（聊天: 50000字符，翻译: 5000字符）
- 可拖动调整输入框大小

## 🛠️ 技术栈

- **前端框架**: Tauri 2.x
- **后端语言**: Rust
- **构建工具**: Vite
- **JavaScript**: Vanilla ES6+
- **Markdown渲染**: Marked.js
- **数据存储**: localStorage

## 📦 安装与运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run tauri dev
```

### 生产构建

```bash
# 构建可执行文件
npm run tauri build
```

构建完成后，可执行文件位于：
- Windows: `src-tauri/target/release/ai-chat-client.exe`
- 安装包位于 `src-tauri/target/release/bundle/` 目录

## 🚀 快速开始

1. **启动应用**
   - 双击运行 `ai-chat-client.exe`
   - 或使用命令行：`./src-tauri/target/release/ai-chat-client.exe`

2. **配置API**
   - 点击左下角"模型商"按钮
   - 编辑智谱AI或其他模型商的API Key
   - （可选）修改自定义Endpoint

3. **开始聊天**
   - 点击"+ 新建对话"创建对话
   - 在输入框输入消息，按Enter发送
   - 使用Alt+Enter插入换行

4. **使用翻译**
   - 点击左下角"翻译"按钮
   - 输入待翻译文本
   - 选择源语言和目标语言
   - 点击"翻译"按钮

## 📸 界面预览

### 主界面
- 左侧边栏：对话列表
- 主区域：消息显示和输入框
- 右下角：发送/停止按钮

### 功能页面
- **设置**: 界面个性化设置
- **模型商**: API配置管理
- **关于**: 程序信息
- **翻译助手**: 文本翻译工具

## ⚙️ 配置说明

### 智谱AI配置
- API Key: 从[智谱AI开放平台](https://open.bigmodel.cn/)获取
- Endpoint: `https://open.bigmodel.cn/api/paas/v4/chat/completions`

### Gemini配置
- API Key: 从[Google AI Studio](https://aistudio.google.com/)获取
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent`

### 自定义模型商
点击"添加模型商"按钮，输入：
- 模型商名称
- API Endpoint
- API Key（编辑时设置）

## 🎯 使用技巧

1. **停止生成**: 点击红色停止按钮可中断AI回复，问题会恢复到输入框
2. **调整输入框**: 拖动输入框顶部横条可调整高度
3. **复制代码**: 点击代码块右上角的复制按钮
4. **多行输入**: 使用Alt+Enter在输入框中换行
5. **切换主题**: 在设置中选择深色或浅色主题

## 📝 数据存储

所有数据保存在本地localStorage：
- 对话历史
- API配置
- 用户设置
- 模型商配置

## 🔐 隐私说明

- 所有数据仅存储在本地
- API请求直接发送到配置的endpoint
- 不经过任何中间服务器

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

如有问题或建议，请提交Issue。

---

**享受与AI的对话！** 🎉
