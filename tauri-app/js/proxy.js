import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/shell';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Proxy page initialized');

  const proxyAddressInput = document.getElementById('proxy-address');
  const setProxyBtn = document.getElementById('set-proxy-btn');
  const clearProxyBtn = document.getElementById('clear-proxy-btn');
  const closeBtn = document.getElementById('close-btn');

  // 设置代理
  setProxyBtn.addEventListener('click', async () => {
    const address = proxyAddressInput.value.trim();
    
    if (address) {
      try {
        await invoke('set_proxy', { address });
        alert('代理已设置！\n\n请重启应用使设置生效。');
        await invoke('close_window', { label: 'proxy-window' });
      } catch (error) {
        console.error('Failed to set proxy:', error);
        alert('设置代理失败：' + error);
      }
    } else {
      alert('请输入代理地址！');
    }
  });

  // 清除代理
  clearProxyBtn.addEventListener('click', async () => {
    if (confirm('确定要清除代理设置吗？')) {
      try {
        await invoke('clear_proxy');
        alert('代理已清除！\n\n请重启应用使设置生效。');
        await invoke('close_window', { label: 'proxy-window' });
      } catch (error) {
        console.error('Failed to clear proxy:', error);
        alert('清除代理失败：' + error);
      }
    }
  });

  // 关闭
  closeBtn.addEventListener('click', async () => {
    try {
      await invoke('close_window', { label: 'proxy-window' });
    } catch (error) {
      console.error('Failed to close:', error);
      window.close();
    }
  });

  // 聚焦输入框
  proxyAddressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      setProxyBtn.click();
    }
  });
});
