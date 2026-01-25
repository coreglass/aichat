import { invoke } from '@tauri-apps/api/core';

document.addEventListener('DOMContentLoaded', () => {
  console.log('About page initialized');

  const closeBtn = document.getElementById('close-btn');

  // 关闭
  closeBtn.addEventListener('click', async () => {
    try {
      await invoke('close_window', { label: 'about-window' });
    } catch (error) {
      console.error('Failed to close:', error);
      window.close();
    }
  });
});
