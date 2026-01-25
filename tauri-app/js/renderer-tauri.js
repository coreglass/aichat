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

  // Get iframe element
  const webview = document.getElementById('webview');
  const sidebar = document.getElementById('sidebar');
  const barContainer = document.getElementById('bar-container');

  // Listen for restore-webview-url event
  listen('restore-webview-url', (event) => {
    sidebar.style.display = 'flex';
    barContainer.style.display = 'none';
    barContainer.innerHTML = '';

    // Restore webview original page
    if (event.payload) {
      webview.setAttribute('src', event.payload);
    }
  });

  // Listen for restore-sidebar event
  listen('restore-sidebar', () => {
    sidebar.style.display = 'flex';
    barContainer.style.display = 'none';
    barContainer.innerHTML = '';
  });

  /**************** 测边栏加载模型事件规则 *****************/
  // Get AI model buttons
  const kimiButton = document.getElementById('kimi');
  const doubaoButton = document.getElementById('doubao');
  const tyqwButton = document.getElementById('tyqw');
  const tenxunButton = document.getElementById('tenxun');
  const openaiButton = document.getElementById('openai');
  const googleButton = document.getElementById('google');
  const wxyyButton = document.getElementById('wxyy');
  const poeButton = document.getElementById('poe');
  const deepseekButton = document.getElementById('deepseek');
  const claudeButton = document.getElementById('claude');

  const manusButton = document.getElementById('manus');
  const grokButton = document.getElementById('grok');
  const copilotButton = document.getElementById('copilot');
  const metaButton = document.getElementById('meta');
  const perplexityButton = document.getElementById('perplexity');
  const deeplButton = document.getElementById('deepl');
  const youdaoButton = document.getElementById('youdaoranslator');
  const sciencepalButton = document.getElementById('sciencepal');
  const bingButton = document.getElementById('bing');


  // Set button click event listeners, load web pages
  deepseekButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://chat.deepseek.com/");
  });

  kimiButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://kimi.moonshot.cn/");
  });

  doubaoButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.doubao.com/");
  });

  tyqwButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.tongyi.com/");
  });

  tenxunButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://yuanbao.tencent.com/chat/");
  });

  openaiButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://chatgpt.com/");
  });

  googleButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://gemini.google.com/");
  });

  wxyyButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://yiyan.baidu.com/");
  });

  poeButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://poe.com/");
  });

  claudeButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://claude.ai/");
  });

  manusButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://manus.im/");
  });

  grokButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://x.ai/grok");
  });

  copilotButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://copilot.microsoft.com/");
  });

  metaButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.meta.ai/");
  });

  perplexityButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.perplexity.ai/");
  });


  deeplButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.deepl.com/");
  });

  youdaoButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://fanyi.youdao.com/#/TextTranslate");
  });

  sciencepalButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://sciencepal.ai/");
  });

  bingButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.bing.com/");
  });



  /**************** 测边栏设置按钮事件规则 *****************/
  // Get "Back to Home" button
  const homeBtn = document.getElementById('home-btn');
  // Get "Network Settings" button
  const setProxyBtn = document.getElementById('set-proxy-btn');
  // Get "User Manual" button
  const manualBtn = document.getElementById('manual-btn');
  // Get "Version Info" button
  const versionBtn = document.getElementById('version-btn');
  // Get session clone button
  const browserButton = document.getElementById('browser-btn');


  // Listen to button click events, load specified html
  homeBtn.addEventListener('click', () => {
    webview.src = 'second.html';
  });

  manualBtn.addEventListener('click', async () => {
    await open('assets/Readme.pdf');
  });

  // Add click event, send openProxyDialog
  setProxyBtn.addEventListener('click', async () => {
    await invoke('open_proxy_dialog');
  });

  // Add click event, send openVersionDialog
  versionBtn.addEventListener('click', async () => {
    await invoke('open_version_dialog');
  });

  browserButton.addEventListener('click', async function () {
    let url = '';

    try {
      url = webview.src;
    } catch (e) {
      url = webview.getAttribute('src') || '';
    }

    if (!url) {
      console.warn("webview 当前没有 URL。");
      return;
    }

    // 1) Detach to new BrowserWindow (session maintained)
    await invoke('detach_webview', { url: url });

    // 2) Clear webview
    webview.src = 'about:blank';
  });

  // Close application button
  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      try {
        await invoke('close_window');
      } catch (error) {
        console.error('关闭失败:', error);
        // Fallback: try to close using window API
        if (window.__TAURI__) {
          await window.__TAURI__.window.close();
        } else {
          // Last resort: use browser close
          window.close();
        }
      }
    });
  }
  });
}

// Setup basic functionality without Tauri API
function setupBasicFunctionality() {
  console.log('Setting up basic functionality without Tauri API...');
  
  // Get iframe element
  const webview = document.getElementById('webview');
  const sidebar = document.getElementById('sidebar');
  const barContainer = document.getElementById('bar-container');
  
  // Get AI model buttons
  const kimiButton = document.getElementById('kimi');
  const doubaoButton = document.getElementById('doubao');
  const tyqwButton = document.getElementById('tyqw');
  const tenxunButton = document.getElementById('tenxun');
  const openaiButton = document.getElementById('openai');
  const googleButton = document.getElementById('google');
  const wxyyButton = document.getElementById('wxyy');
  const poeButton = document.getElementById('poe');
  const deepseekButton = document.getElementById('deepseek');
  const claudeButton = document.getElementById('claude');
  const manusButton = document.getElementById('manus');
  const grokButton = document.getElementById('grok');
  const copilotButton = document.getElementById('copilot');
  const metaButton = document.getElementById('meta');
  const perplexityButton = document.getElementById('perplexity');
  const deeplButton = document.getElementById('deepl');
  const youdaoButton = document.getElementById('youdaoranslator');
  const sciencepalButton = document.getElementById('sciencepal');
  const bingButton = document.getElementById('bing');
  
  // Set button click event listeners, load web pages
  deepseekButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://chat.deepseek.com/");
  });
  
  kimiButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://kimi.moonshot.cn/");
  });
  
  doubaoButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.doubao.com/");
  });
  
  tyqwButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.tongyi.com/");
  });
  
  tenxunButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://yuanbao.tencent.com/chat/");
  });
  
  openaiButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://chatgpt.com/");
  });
  
  googleButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://gemini.google.com/");
  });
  
  wxyyButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://yiyan.baidu.com/");
  });
  
  poeButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://poe.com/");
  });
  
  claudeButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://claude.ai/");
  });
  
  manusButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://manus.im/");
  });
  
  grokButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://x.ai/grok");
  });
  
  copilotButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://copilot.microsoft.com/");
  });
  
  metaButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.meta.ai/");
  });
  
  perplexityButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.perplexity.ai/");
  });
  
  deeplButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.deepl.com/");
  });
  
  youdaoButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://fanyi.youdao.com/#/TextTranslate");
  });
  
  sciencepalButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://sciencepal.ai/");
  });
  
  bingButton.addEventListener('click', function() {
    webview.setAttribute('src', "https://www.bing.com/");
  });
  
  // Get settings buttons
  const homeBtn = document.getElementById('home-btn');
  const setProxyBtn = document.getElementById('set-proxy-btn');
  const manualBtn = document.getElementById('manual-btn');
  const versionBtn = document.getElementById('version-btn');
  const browserButton = document.getElementById('browser-btn');
  const closeBtn = document.getElementById('close-btn');
  
  // Listen to button click events, load specified html
  homeBtn.addEventListener('click', () => {
    webview.src = 'second.html';
  });
  
  manualBtn.addEventListener('click', async () => {
    alert('由于 Tauri API 不可用，无法打开用户手册。\n请使用 Tauri 构建的应用以获得完整功能。');
  });
  
  // Add click event, show error message
  setProxyBtn.addEventListener('click', async () => {
    alert('由于 Tauri API 不可用，无法打开网络设置。\n请使用 Tauri 构建的应用以获得完整功能。');
  });
  
  // Add click event, show error message
  versionBtn.addEventListener('click', async () => {
    alert('由于 Tauri API 不可用，无法打开版本信息。\n请使用 Tauri 构建的应用以获得完整功能。');
  });
  
  browserButton.addEventListener('click', async function () {
    alert('由于 Tauri API 不可用，无法使用会话分身功能。\n请使用 Tauri 构建的应用以获得完整功能。');
  });
  
  // Close application button
  if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      if (window.__TAURI__) {
        await window.__TAURI__.window.close();
      } else {
        window.close();
      }
    });
  }
  
  console.log('Basic functionality setup complete.');
}
