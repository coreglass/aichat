# 功能更新说明

## 新功能（v2.0）

### 1. 会话管理
- ✅ **新会话按钮**：点击使用默认模型创建新会话
- ✅ **会话列表**：左侧边栏显示所有会话
- ✅ **会话切换**：点击会话可以在主界面切换不同对话
- ✅ **会话删除**：每个会话都有删除按钮
- ✅ **会话持久化**：会话数据保存在本地

### 2. 模型管理
- ✅ **模型设置页面**：进入设置模型和启用
- ✅ **模型列表**：显示所有可用的 AI 模型
- ✅ **启用/禁用模型**：可以启用或禁用特定模型
- ✅ **模型持久化**：模型配置保存在本地
- ✅ **恢复默认**：可以恢复默认模型配置

### 3. 界面改进
- ✅ **重新设计左侧边栏**：
  - 新会话按钮（顶部）
  - 会话列表（中间）
  - 模型设置按钮（左下角）
  - 其他设置（网络设置、版本信息、用户手册、关闭应用）
- ✅ **会话标签页**：新的会话标签页面，支持会话切换
- ✅ **模型选择器**：右上角可以设置已启用的模型

## 页面结构

### 主页面（index.html）
```
左侧边栏
├── Logo
├── 新会话按钮
├── 会话列表（动态）
├── 模型设置按钮
└── 其他设置（网络、版本、手册、关闭）

右侧内容区
└── iframe（conversation.html）
```

### 会话页面（conversation.html）
```
顶部栏
├── 标题：我的会话
└── 模型选择器按钮

会话标签区
└── 会话标签（动态）

内容区
├── 空状态提示
└── 会话面板（model webview）

模型选择弹窗
├── 模型列表（启用）
└── 模型设置按钮
```

### 模型设置页面（model-settings.html）
```
顶部栏
├── 标题：模型设置
└── 关闭按钮

模型列表区
└── 模型列表（支持启用/禁用）

底部操作栏
├── 恢复默认按钮
└── 保存设置按钮
```

## Tauri Commands

### 会话管理
- `create_conversation` - 创建新会话
- `delete_conversation` - 删除会话
- `get_conversations` - 获取所有会话

### 模型管理
- `get_models` - 获取所有模型
- `update_model` - 更新模型状态（启用/禁用）
- `save_models` - 保存模型配置

### 现有功能（保留）
- `open_proxy_dialog` - 打开代理设置
- `set_proxy` - 设置代理
- `clear_proxy` - 清除代理
- `open_version_dialog` - 打开版本信息
- `detach_webview` - 会话分身
- `restore_sidebar` - 恢复侧边栏
- `close_window` - 关闭窗口

## 数据持久化

### 会话数据
- 位置：`%LOCALAPPDATA%\Ai Talk\conversations.json`
- 格式：
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
- 格式：
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

## 使用说明

### 创建新会话
1. 点击左侧边栏的"新会话"按钮
2. 系统自动使用第一个启用的模型创建新会话
3. 会话名称格式：`新会话 HH:MM:SS`

### 切换会话
1. 在会话列表中点击要切换的会话
2. 会话标签页切换到对应的 AI 模型
3. 可以在右上角切换其他模型

### 删除会话
1. 鼠标悬停在会话上
2. 点击出现的"×"按钮
3. 确认删除

### 模型设置
1. 点击左侧边栏的"模型设置"按钮
2. 进入模型设置页面
3. 勾选/取消勾选模型来启用/禁用
4. 点击"保存设置"应用更改
5. 点击"恢复默认"恢复原始配置

## 技术细节

### 前端技术
- HTML5 + CSS3
- JavaScript (ES6+)
- 响应式设计
- 事件驱动的 UI 更新

### 后端技术
- Rust + Tauri 2.x
- JSON 数据持久化
- 事件系统（Emitter/Listener）
- Arc<Mutex<>> 状态管理

### 数据结构
- `Model` - 模型信息（id, name, provider, url, icon, enabled）
- `Conversation` - 会话信息（id, name, model_id, created_at）
- `AppState` - 应用状态（conversations, models, detached_windows, proxy_address）

## 已知问题

### 限制
1. 会话数据保存在本地，不同设备间不共享
2. 删除会话后无法恢复
3. 模型配置影响所有新创建的会话

### 待改进
1. [ ] 会话搜索功能
2. [ ] 会话导出/导入
3. [ ] 会话排序（时间、名称）
4. [ ] 会话分组
5. [ ] 模型自定义排序
6. [ ] 模型分组（按提供商）
7. [ ] 会话图标自定义

## 版本历史

- v1.0.2 - 初始版本（Electron → Tauri 迁移）
- v2.0 - 会话管理和模型设置功能

## 开发说明

### 新增文件
- `conversation.html` - 会话列表页面
- `model-settings.html` - 模型设置页面
- `css/conversation.css` - 会话页面样式
- `css/model-settings.css` - 模型设置页面样式
- `js/conversation.js` - 会话页面逻辑
- `js/model-settings.js` - 模型设置页面逻辑

### 修改文件
- `index.html` - 重新设计主页面和左侧边栏
- `js/renderer-tauri.js` - 添加会话管理逻辑
- `css/style.css` - 添加新 UI 组件样式
- `src-tauri/src/main.rs` - 添加会话和模型管理的 Tauri Commands
- `src-tauri/Cargo.toml` - 添加 chrono 依赖
- `vite.config.js` - 复制新的 HTML 和 CSS 文件

### 移除功能
- ❌ 左侧边栏的模型按钮列表（已移除）
- ❌ 直接的模型选择（改为通过会话页面）
