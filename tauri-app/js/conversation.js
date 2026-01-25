import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Conversation page initialized');

  // 状态
  let conversations = [];
  let models = [];
  let currentConversationId = null;

  // DOM 元素
  const convTabs = document.getElementById('conversation-tabs');
  const emptyState = document.getElementById('empty-state');
  const webviewContainer = document.getElementById('webview-container');
  const modelWebview = document.getElementById('model-webview');
  const modelSelectorBtn = document.getElementById('model-selector-btn');
  const currentModelName = document.getElementById('current-model-name');
  const modelModal = document.getElementById('model-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modelList = document.getElementById('model-list');
  const closeModalBtn = document.getElementById('close-modal');
  const openModelSettingsBtn = document.getElementById('open-model-settings-btn');

  // 加载数据
  async function loadData() {
    try {
      [conversations, models] = await Promise.all([
        invoke('get_conversations'),
        invoke('get_models')
      ]);
      console.log('Loaded conversations:', conversations.length);
      console.log('Loaded models:', models.length);
      renderConversationTabs();
      updateCurrentModel();
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('加载数据失败：' + error);
    }
  }

  // 渲染会话标签
  function renderConversationTabs() {
    convTabs.innerHTML = '';

    if (conversations.length === 0) {
      emptyState.style.display = 'flex';
      webviewContainer.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    webviewContainer.style.display = 'flex';

    conversations.forEach((conv, index) => {
      const tab = document.createElement('div');
      tab.className = `conversation-tab ${conv.id === currentConversationId ? 'active' : ''}`;
      tab.innerHTML = `
        <span class="conversation-tab-name">${conv.name}</span>
        <button class="conversation-tab-close" data-id="${conv.id}">✕</button>
      `;

      tab.addEventListener('click', () => selectConversation(conv.id));

      const closeBtn = tab.querySelector('.conversation-tab-close');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conv.id);
      });

      convTabs.appendChild(tab);
    });
  }

  // 选择会话
  async function selectConversation(id) {
    currentConversationId = id;
    const conv = conversations.find(c => c.id === id);
    
    if (conv) {
      const model = models.find(m => m.id === conv.model_id);
      if (model && model.enabled) {
        modelWebview.src = model.url;
        // 保存到本地存储
        localStorage.setItem('currentConversation', JSON.stringify(conv));
        localStorage.setItem('loadModel', JSON.stringify(model));
      } else {
        alert('该会话使用的模型未启用，请在模型设置中启用！');
      }
    }
    
    renderConversationTabs();
    updateCurrentModel();
  }

  // 删除会话
  async function deleteConversation(id) {
    if (confirm('确定要删除这个会话吗？')) {
      try {
        await invoke('delete_conversation', { id });
        conversations = conversations.filter(c => c.id !== id);
        
        if (currentConversationId === id) {
          currentConversationId = null;
          localStorage.removeItem('currentConversation');
          localStorage.removeItem('loadModel');
          modelWebview.src = 'about:blank';
        }
        
        renderConversationTabs();
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        alert('删除失败：' + error);
      }
    }
  }

  // 更新当前模型名称
  function updateCurrentModel() {
    const modelId = localStorage.getItem('loadModel');
    const model = models.find(m => m.id === modelId);
    if (model) {
      currentModelName.textContent = model.name;
    } else {
      currentModelName.textContent = '选择模型';
    }
  }

  // 监听本地存储变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'loadModel') {
      updateCurrentModel();
      // 通知主窗口更新
      localStorage.setItem('updateMainModel', e.newValue);
    }
  });

  // 打开模型选择器
  modelSelectorBtn.addEventListener('click', () => {
    modelModal.style.display = 'flex';
    renderModelList();
  });

  // 关闭模型选择器
  function closeModelModal() {
    modelModal.style.display = 'none';
  }

  closeModalBtn.addEventListener('click', closeModelModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModelModal();
    }
  });

  // 打开模型设置
  openModelSettingsBtn.addEventListener('click', () => {
    window.location.href = 'model-settings.html';
  });

  // 渲染模型列表
  function renderModelList() {
    modelList.innerHTML = '';
    
    models.forEach(model => {
      const item = document.createElement('div');
      item.className = `model-item-modal ${model.enabled ? '' : 'disabled'}`;
      item.innerHTML = `
        <img src="${model.icon}" alt="${model.name}" class="model-icon">
        <div class="model-info-modal">
          <div class="model-name-modal">${model.name}</div>
          <div class="model-provider-modal">${model.provider}</div>
        </div>
        <div class="model-toggle">
          <input type="checkbox" id="toggle-${model.id}" ${model.enabled ? 'checked' : ''}>
          <label for="toggle-${model.id}" class="toggle-slider"></label>
        </div>
      `;
      
      // 切换启用状态
      const toggle = item.querySelector(`#toggle-${model.id}`);
      toggle.addEventListener('change', async () => {
        await invoke('toggle_model', { id: model.id, enabled: toggle.checked });
      });
      
      modelList.appendChild(item);
    });
  }

  // 初始化加载数据
  loadData();
});
