// Wait for Tauri API to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Tauri API to load (it may take a moment)
  const waitForTauri = (callback, maxAttempts = 50, interval = 200) => {
    let attempts = 0;
    
    const checkTauri = () => {
      attempts++;
      if (window.__TAURI__) {
        console.log('Tauri API loaded successfully!');
        callback();
      } else if (attempts < maxAttempts) {
        console.log(`Waiting for Tauri API... (${attempts}/${maxAttempts})`);
        setTimeout(checkTauri, interval);
      } else {
        console.error('Tauri API not available after waiting.');
        alert('应用初始化失败：Tauri API 不可用。\n\n如果您看到此错误，请尝试：\n1. 确保使用 Tauri 构建的应用（不是直接在浏览器中打开）\n2. 检查 tauri.conf.json 配置是否正确\n3. 按 F12 打开开发者工具查看详细错误\n\n点击确定后将继续尝试加载...');
        
        // Try to continue without Tauri API for basic functionality
        setTimeout(() => {
          console.log('Attempting to initialize without Tauri API...');
          setupBasicFunctionality();
        }, 1000);
      }
    };
    
    checkTauri();
  };

  waitForTauri(() => {
    
    // Import Tauri API
    const { invoke } = window.__TAURI__.core;
    const { listen } = window.__TAURI__.event;
    const { open } = window.__TAURI__.shell;

    // DOM Elements
    const newConversationBtn = document.getElementById('new-conversation-btn');
    const modelSettingsBtn = document.getElementById('model-settings-btn');
    const networkSettingsBtn = document.getElementById('network-settings-btn');
    const versionInfoBtn = document.getElementById('version-info-btn');
    const manualBtn = document.getElementById('manual-btn');
    const closeAppBtn = document.getElementById('close-app-btn');

    // New conversation button
    newConversationBtn.addEventListener('click', async () => {
      try {
        // Get enabled models
        const models = await invoke('get_models');
        const defaultModel = models.find(m => m.enabled);
        
        if (defaultModel) {
          // Create new conversation with default model
          const conversation = await invoke('create_conversation', {
            name: `新会话 ${new Date().toLocaleTimeString()}`,
            modelId: defaultModel.id
          });
          
          // Switch to new conversation in sidebar
          addConversationToSidebar(conversation);
          alert(`已创建新会话：${conversation.name}`);
        } else {
          alert('请先在模型设置中启用至少一个模型！');
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
        alert('创建会话失败：' + error);
      }
    });

    // Model settings button
    modelSettingsBtn.addEventListener('click', async () => {
      try {
        await invoke('open_version_dialog');
        window.location.href = 'model-settings.html';
      } catch (error) {
        console.error('Failed to open model settings:', error);
        alert('打开模型设置失败：' + error);
      }
    });

    // Network settings button
    networkSettingsBtn.addEventListener('click', async () => {
      try {
        await invoke('open_proxy_dialog');
      } catch (error) {
        console.error('Failed to open network settings:', error);
        alert('打开网络设置失败：' + error);
      }
    });

    // Version info button
    versionInfoBtn.addEventListener('click', async () => {
      try {
        await invoke('open_version_dialog');
      } catch (error) {
        console.error('Failed to open version info:', error);
        alert('打开版本信息失败：' + error);
      }
    });

    // Manual button
    manualBtn.addEventListener('click', async () => {
      try {
        await open('assets/Readme.pdf');
      } catch (error) {
        console.error('Failed to open manual:', error);
        alert('打开用户手册失败：' + error);
      }
    });

    // Close app button
    closeAppBtn.addEventListener('click', async () => {
      try {
        await invoke('close_window');
      } catch (error) {
        console.error('Failed to close app:', error);
        // Fallback
        if (window.__TAURI__) {
          await window.__TAURI__.window.close();
        } else {
          window.close();
        }
      }
    });

    // Listen for conversation updates
    listen('conversation-created', (event) => {
      addConversationToSidebar(event.payload);
    });

    listen('conversation-deleted', (event) => {
      removeConversationFromSidebar(event.payload);
    });

    // Load existing conversations to sidebar
    loadConversationsToSidebar();
  });

  // Add conversation to sidebar
  function addConversationToSidebar(conversation) {
    const conversationList = document.getElementById('conversation-list');
    if (!conversationList) return;

    const item = document.createElement('div');
    item.className = 'conversation-item';
    item.dataset.id = conversation.id;
    item.innerHTML = `
      <div class="conversation-name">${conversation.name}</div>
      <button class="conversation-delete-btn" data-id="${conversation.id}">×</button>
    `;

    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('conversation-delete-btn')) {
        switchConversation(conversation.id);
      }
    });

    // Delete button
    const deleteBtn = item.querySelector('.conversation-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteConversation(conversation.id);
    });

    conversationList.appendChild(item);
  }

  // Remove conversation from sidebar
  function removeConversationFromSidebar(id) {
    const conversationList = document.getElementById('conversation-list');
    if (!conversationList) return;

    const item = conversationList.querySelector(`[data-id="${id}"]`);
    if (item) {
      item.remove();
    }
  }

  // Switch conversation
  async function switchConversation(id) {
    try {
      const conversations = await invoke('get_conversations');
      const conv = conversations.find(c => c.id === id);
      
      if (conv) {
        const models = await invoke('get_models');
        const model = models.find(m => m.id === conv.model_id);
        
        if (model) {
          // Navigate to conversation page
          const webview = document.getElementById('webview');
          webview.src = 'conversation.html';
          
          // Store current conversation ID in localStorage
          localStorage.setItem('currentConversationId', id);
        }
      }
    } catch (error) {
      console.error('Failed to switch conversation:', error);
      alert('切换会话失败：' + error);
    }
  }

  // Delete conversation
  async function deleteConversation(id) {
    if (confirm('确定要删除这个会话吗？')) {
      try {
        await invoke('delete_conversation', { id });
        alert('会话已删除');
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        alert('删除会话失败：' + error);
      }
    }
  }

  // Load conversations to sidebar
  async function loadConversationsToSidebar() {
    try {
      const conversations = await invoke('get_conversations');
      conversations.forEach(conv => addConversationToSidebar(conv));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }
}

// Setup basic functionality without Tauri API
function setupBasicFunctionality() {
  console.log('Setting up basic functionality without Tauri API...');
  
  const newConversationBtn = document.getElementById('new-conversation-btn');
  const modelSettingsBtn = document.getElementById('model-settings-btn');
  const networkSettingsBtn = document.getElementById('network-settings-btn');
  const versionInfoBtn = document.getElementById('version-info-btn');
  const manualBtn = document.getElementById('manual-btn');
  const closeAppBtn = document.getElementById('close-app-btn');

  newConversationBtn.addEventListener('click', () => {
    alert('由于 Tauri API 不可用，无法创建新会话。\n请使用 Tauri 构建的应用以获得完整功能。');
  });

  modelSettingsBtn.addEventListener('click', () => {
    window.location.href = 'model-settings.html';
  });

  networkSettingsBtn.addEventListener('click', () => {
    alert('由于 Tauri API 不可用，无法打开网络设置。\n请使用 Tauri 构建的应用以获得完整功能。');
  });

  versionInfoBtn.addEventListener('click', () => {
    alert('由于 Tauri API 不可用，无法打开版本信息。\n请使用 Tauri 构建的应用以获得完整功能。');
  });

  manualBtn.addEventListener('click', () => {
    alert('由于 Tauri API 不可用，无法打开用户手册。\n请使用 Tauri 构建的应用以获得完整功能。');
  });

  closeAppBtn.addEventListener('click', () => {
    if (window.__TAURI__) {
      window.__TAURI__.window.close();
    } else {
      window.close();
    }
  });
  
  console.log('Basic functionality setup complete.');
}
