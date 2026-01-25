import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/shell';

document.addEventListener('DOMContentLoaded', () => {
  console.log('App initialized');

  // 状态
  let conversations = [];
  let models = [];
  let currentConversationId = null;

  // DOM 元素
  const newConvBtn = document.getElementById('new-conversation-btn');
  const convList = document.getElementById('conversation-list');
  const modelSettingsBtn = document.getElementById('model-settings-btn');
  const networkBtn = document.getElementById('network-btn');
  const aboutBtn = document.getElementById('about-btn');
  const manualBtn = document.getElementById('manual-btn');
  const closeBtn = document.getElementById('close-btn');

  // 加载数据
  async function loadData() {
    try {
      [conversations, models] = await Promise.all([
        invoke('get_conversations'),
        invoke('get_models')
      ]);
      console.log('Loaded conversations:', conversations.length);
      console.log('Loaded models:', models.length);
      renderConversationList();
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('加载数据失败：' + error);
    }
  }

  // 渲染会话列表
  function renderConversationList() {
    convList.innerHTML = '';

    if (conversations.length === 0) {
      convList.innerHTML = `
        <div class="empty-state">
          <img src="assets/dialogue.svg" alt="空" class="empty-icon">
          <p class="empty-text">还没有会话，点击"新会话"按钮创建一个</p>
        </div>
      `;
      return;
    }

    conversations.forEach(conv => {
      const item = document.createElement('div');
      item.className = `conversation-item ${conv.id === currentConversationId ? 'active' : ''}`;
      item.innerHTML = `
        <span class="conversation-name">${conv.name}</span>
        <span class="conversation-time">${conv.created_at.split(' ')[1] || conv.created_at}</span>
        <button class="delete-conv-btn" data-id="${conv.id}">✕</button>
      `;

      item.addEventListener('click', () => selectConversation(conv.id));

      const deleteBtn = item.querySelector('.delete-conv-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conv.id);
      });

      convList.appendChild(item);
    });
  }

  // 选择会话
  async function selectConversation(id) {
    currentConversationId = id;
    const conv = conversations.find(c => c.id === id);
    
    if (conv) {
      const model = models.find(m => m.id === conv.model_id);
      if (model && model.enabled) {
        // 发送消息到 conversation.html
        localStorage.setItem('currentConversation', JSON.stringify(conv));
        localStorage.setItem('loadModel', JSON.stringify(model));
      }
    }
    
    renderConversationList();
  }

  // 删除会话
  async function deleteConversation(id) {
    if (confirm('确定要删除这个会话吗？')) {
      try {
        await invoke('delete_conversation', { id });
        conversations = conversations.filter(c => c.id !== id);
        
        // 删除当前会话，清空 storage
        if (currentConversationId === id) {
          currentConversationId = null;
          localStorage.removeItem('currentConversation');
          localStorage.removeItem('loadModel');
        }
        
        renderConversationList();
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        alert('删除失败：' + error);
      }
    }
  }

  // 新会话
  newConvBtn.addEventListener('click', async () => {
    try {
      const enabledModel = models.find(m => m.enabled);
      
      if (!enabledModel) {
        alert('请先在模型设置中启用至少一个模型！');
        return;
      }
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      const conv = await invoke('create_conversation', {
        name: `新会话 ${timeStr}`,
        model_id: enabledModel.id
      });
      
      conversations.push(conv);
      currentConversationId = conv.id;
      renderConversationList();
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('创建会话失败：' + error);
    }
  });

  // 模型设置
  modelSettingsBtn.addEventListener('click', async () => {
    window.location.href = 'model-settings.html';
  });

  // 网络设置
  networkBtn.addEventListener('click', async () => {
    await invoke('open_proxy_dialog');
  });

  // 关于程序
  aboutBtn.addEventListener('click', async () => {
    await invoke('open_about_dialog');
  });

  // 用户手册
  manualBtn.addEventListener('click', async () => {
    await open('assets/Readme.pdf');
  });

  // 关闭应用
  closeBtn.addEventListener('click', async () => {
    try {
      await invoke('close_window', { label: 'main' });
    } catch (error) {
      console.error('Failed to close:', error);
      window.close();
    }
  });

  // 监听来自会话页面的消息
  listen('load-model', (event) => {
    const modelId = event.payload;
    localStorage.setItem('loadModel', JSON.stringify(models.find(m => m.id === modelId)));
  });

  // 初始化加载数据
  loadData();
});
