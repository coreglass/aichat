document.addEventListener('DOMContentLoaded', function() {
  // Wait for Tauri API
  const waitForTauri = (callback, maxAttempts = 50, interval = 200) => {
    let attempts = 0;
    
    const checkTauri = () => {
      attempts++;
      if (window.__TAURI__) {
        console.log('Tauri API loaded!');
        callback();
      } else if (attempts < maxAttempts) {
        setTimeout(checkTauri, interval);
      }
    };
    
    checkTauri();
  };

  waitForTauri(() => {
    const { invoke } = window.__TAURI__.core;
    const { open } = window.__TAURI__.shell;
    
    // State
    let conversations = [];
    let models = [];
    let currentConversationId = null;
    let currentModelId = 'deepseek'; // 默认模型

    // DOM Elements
    const conversationTabs = document.getElementById('conversation-tabs');
    const conversationContent = document.getElementById('conversation-content');
    const emptyState = document.getElementById('empty-state');
    const conversationPanel = document.getElementById('conversation-panel');
    const modelWebview = document.getElementById('model-webview');
    const modelSelectorBtn = document.getElementById('model-selector-btn');
    const currentModelName = document.getElementById('current-model-name');
    const modelSelectorModal = document.getElementById('model-selector-modal');
    const closeModelModalBtn = document.getElementById('close-model-modal');
    const modelList = document.getElementById('model-list');
    const openModelSettingsBtn = document.getElementById('open-model-settings-btn');

    // Load initial data
    async function loadData() {
      try {
        conversations = await invoke('get_conversations');
        models = await invoke('get_models');
        
        // Find enabled default model
        const defaultModel = models.find(m => m.enabled && m.id === currentModelId);
        if (defaultModel) {
          currentModelName.textContent = defaultModel.name;
        } else if (models.length > 0 && models[0].enabled) {
          currentModelId = models[0].id;
          currentModelName.textContent = models[0].name;
        }
        
        renderConversationList();
        renderModelList();
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }

    // Render conversation tabs
    function renderConversationList() {
      conversationTabs.innerHTML = '';
      
      if (conversations.length === 0) {
        emptyState.style.display = 'flex';
        conversationPanel.style.display = 'none';
        return;
      }
      
      emptyState.style.display = 'none';
      conversationPanel.style.display = 'flex';
      
      conversations.forEach(conv => {
        const tab = document.createElement('div');
        tab.className = `conversation-tab ${conv.id === currentConversationId ? 'active' : ''}`;
        tab.innerHTML = `
          <span class="conversation-name">${conv.name}</span>
          <button class="delete-btn" data-id="${conv.id}">×</button>
        `;
        
        tab.addEventListener('click', () => selectConversation(conv.id));
        conversationTabs.appendChild(tab);
      });
    }

    // Render model list in modal
    function renderModelList() {
      modelList.innerHTML = '';
      
      models.forEach(model => {
        const item = document.createElement('div');
        item.className = `model-item ${model.enabled ? '' : 'disabled'}`;
        item.innerHTML = `
          <img src="${model.icon}" alt="${model.name}" class="model-icon">
          <div class="model-item-info">
            <div class="model-item-name">${model.name}</div>
            <div class="model-item-provider">${model.provider}</div>
          </div>
        `;
        
        if (model.enabled) {
          item.addEventListener('click', () => selectModel(model));
        }
        
        modelList.appendChild(item);
      });
    }

    // Select conversation
    function selectConversation(id) {
      currentConversationId = id;
      const conv = conversations.find(c => c.id === id);
      
      if (conv) {
        const model = models.find(m => m.id === conv.model_id);
        if (model) {
          currentModelId = model.id;
          currentModelName.textContent = model.name;
          modelWebview.src = model.url;
        }
      }
      
      renderConversationList();
    }

    // Select model
    function selectModel(model) {
      currentModelId = model.id;
      currentModelName.textContent = model.name;
      closeModelSelectorModal();
      
      if (currentConversationId) {
        const conv = conversations.find(c => c.id === currentConversationId);
        if (conv) {
          conv.model_id = model.id;
          // Update in backend
          invoke('get_conversations').then(allConvs => {
            const index = allConvs.findIndex(c => c.id === currentConversationId);
            if (index !== -1) {
              allConvs[index] = conv;
              // Save (we need a save_conversations command)
            }
          });
        } else {
          modelWebview.src = model.url;
        }
      } else {
        modelWebview.src = model.url;
      }
    }

    // Open model selector modal
    function openModelSelectorModal() {
      modelSelectorModal.style.display = 'flex';
      renderModelList();
    }

    // Close model selector modal
    function closeModelSelectorModal() {
      modelSelectorModal.style.display = 'none';
    }

    // Event Listeners
    modelSelectorBtn.addEventListener('click', openModelSelectorModal);
    closeModelModalBtn.addEventListener('click', closeModelSelectorModal);
    openModelSettingsBtn.addEventListener('click', () => {
      invoke('open_version_dialog').then(() => {
        window.location.href = 'model-settings.html';
      });
    });

    // Click outside modal to close
    modelSelectorModal.addEventListener('click', (e) => {
      if (e.target === modelSelectorModal) {
        closeModelSelectorModal();
      }
    });

    // Load initial data
    loadData();
  });
});
