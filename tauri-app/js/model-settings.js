import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Model settings page initialized');

  // 状态
  let models = [];

  // DOM 元素
  const modelList = document.getElementById('model-list');
  const resetBtn = document.getElementById('reset-btn');
  const saveBtn = document.getElementById('save-btn');
  const closeBtn = document.getElementById('close-btn');

  // 加载数据
  async function loadData() {
    try {
      models = await invoke('get_models');
      console.log('Loaded models:', models.length);
      renderModelList();
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('加载数据失败：' + error);
    }
  }

  // 渲染模型列表
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
          <label class="toggle-switch">
            <input type="checkbox" id="model-${model.id}" ${model.enabled ? 'checked' : ''}>
            <div class="toggle-slider"></div>
          </label>
        </div>
      `;
      
      // 切换启用状态
      const checkbox = item.querySelector(`#model-${model.id}`);
      checkbox.addEventListener('change', () => {
        model.enabled = checkbox.checked;
      });
      
      modelList.appendChild(item);
    });
  }

  // 恢复默认
  resetBtn.addEventListener('click', async () => {
    if (confirm('确定要恢复默认设置吗？')) {
      try {
        // 重新加载默认模型
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset:', error);
        alert('恢复失败：' + error);
      }
    }
  });

  // 保存设置
  saveBtn.addEventListener('click', async () => {
    try {
      await invoke('save_models', { models });
      alert('模型设置已保存！');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('保存失败：' + error);
    }
  });

  // 关闭
  closeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // 初始化加载数据
  loadData();
});
