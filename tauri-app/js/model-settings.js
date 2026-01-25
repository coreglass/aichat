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
    
    // State
    let models = [];
    let originalModels = [];

    // DOM Elements
    const modelList = document.getElementById('model-list');
    const closeBtn = document.getElementById('close-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');

    // Load models
    async function loadModels() {
      try {
        models = await invoke('get_models');
        originalModels = JSON.parse(JSON.stringify(models));
        renderModelList();
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    }

    // Render model list
    function renderModelList() {
      modelList.innerHTML = '';
      
      models.forEach(model => {
        const item = document.createElement('div');
        item.className = `model-item ${model.enabled ? '' : 'disabled'}`;
        item.innerHTML = `
          <img src="${model.icon}" alt="${model.name}" class="model-icon">
          <div class="model-info">
            <div class="model-name">${model.name}</div>
            <div class="model-provider">${model.provider}</div>
          </div>
          <div class="model-toggle">
            <input type="checkbox" id="toggle-${model.id}" ${model.enabled ? 'checked' : ''}>
            <label for="toggle-${model.id}" class="toggle-label"></label>
          </div>
        `;
        
        // Toggle enabled/disabled
        const toggle = item.querySelector('input');
        toggle.addEventListener('change', () => {
          updateModel(model.id, toggle.checked);
        });
        
        modelList.appendChild(item);
      });
    }

    // Update model status
    async function updateModel(id, enabled) {
      try {
        await invoke('update_model', { id, enabled });
        const index = models.findIndex(m => m.id === id);
        if (index !== -1) {
          models[index].enabled = enabled;
          renderModelList();
        }
      } catch (error) {
        console.error('Failed to update model:', error);
      }
    }

    // Save all models
    async function saveModels() {
      try {
        await invoke('save_models', { models });
        alert('模型设置已保存！');
      } catch (error) {
        console.error('Failed to save models:', error);
        alert('保存失败：' + error);
      }
    }

    // Reset to default
    async function resetModels() {
      if (confirm('确定要恢复默认设置吗？')) {
        try {
          // Load default models
          const defaultModels = await invoke('get_models');
          // This will give us the defaults
          await invoke('save_models', { models: defaultModels });
          // Reload
          await loadModels();
          alert('已恢复默认设置！');
        } catch (error) {
          console.error('Failed to reset models:', error);
          alert('恢复失败：' + error);
        }
      }
    }

    // Event Listeners
    closeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    saveBtn.addEventListener('click', saveModels);
    resetBtn.addEventListener('click', resetModels);

    // Load initial data
    loadModels();
  });
});
