import { open } from '@tauri-apps/plugin-shell';
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// App State
let conversations = [];
let currentConversationId = null;
let settings = {
  apiKey: '',
  endpoint: '',
  model: 'glm-4',
  fontSize: 14,
  bgColor: 'dark',
  language: 'zh-CN',
  userAvatar: 'U'
};
let providers = [
  {
    id: 'zhipu',
    name: '智谱AI',
    apiKey: '',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    models: ['glm-4-plus', 'glm-4', 'glm-4-flash', 'glm-4-air', 'glm-4-0520', 'glm-4-alltools', 'glm-4-0111', 'glm-4-long']
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiKey: '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:streamGenerateContent',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash']
  }
];
let streamingAbortController = null;
let currentStreamingMessageId = null;
let pendingUserMessage = null;

// DOM Elements - Chat
const conversationListEl = document.getElementById('conversation-list');
const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const chatTitle = document.getElementById('chat-title');
const charCounter = document.getElementById('char-counter');
const inputWrapper = document.getElementById('input-wrapper');
const resizeHandle = document.getElementById('resize-handle');

// DOM Elements - Navigation
const settingsBtn = document.getElementById('settings-btn');
const providersBtn = document.getElementById('providers-btn');
const aboutBtn = document.getElementById('about-btn');
const translatorBtn = document.getElementById('translator-btn');

// DOM Elements - Settings
const fontSizeSelect = document.getElementById('font-size');
const bgColorSelect = document.getElementById('bg-color');
const languageSelect = document.getElementById('language');
const userAvatarInput = document.getElementById('user-avatar');

// DOM Elements - Providers
const providersList = document.getElementById('providers-list');
const addProviderBtn = document.getElementById('add-provider-btn');

// DOM Elements - Translator
const translatorSource = document.getElementById('translator-source');
const translatorResult = document.getElementById('translator-result');
const translateBtn = document.getElementById('translate-btn');
const copyTranslationBtn = document.getElementById('copy-translation-btn');
const sourceLangSelect = document.getElementById('source-lang');
const targetLangSelect = document.getElementById('target-lang');
const translatorModelSelect = document.getElementById('translator-model');

// DOM Elements - Confirm Dialog
const confirmDialog = document.getElementById('confirm-dialog');
const confirmOkBtn = document.getElementById('confirm-ok');
const confirmCancelBtn = document.getElementById('confirm-cancel');

// Constants
const DEFAULT_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MAX_CHARACTERS = 50000;
const MAX_TRANSLATION_CHARS = 5000;

// Resizable input state
let isResizing = false;
let startY = 0;
let startHeight = 0;

// Initialize
async function init() {
  await loadSettings();
  await loadProviders();
  await loadConversations();
  updateCharCounter();

  if (conversations.length === 0) {
    await createNewConversation();
  } else {
    await selectConversation(conversations[0].id);
  }

  applySettings();
  renderConversationList();
  renderProviders();
  setupEventListeners();
}

// View Navigation
function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view-panel').forEach(view => {
    view.classList.remove('active');
  });

  // Remove active class from all footer buttons
  document.querySelectorAll('.footer-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected view
  document.getElementById(`${viewName}-view`).classList.add('active');

  // Activate corresponding button
  const btn = document.getElementById(`${viewName}-btn`);
  if (btn) {
    btn.classList.add('active');
  }
}

// Settings
async function loadSettings() {
  try {
    const saved = localStorage.getItem('ai-chat-settings');
    if (saved) {
      const loaded = JSON.parse(saved);
      settings = { ...settings, ...loaded };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

function saveSettingsToStorage() {
  localStorage.setItem('ai-chat-settings', JSON.stringify(settings));
}

function applySettings() {
  // Apply font size
  document.body.style.fontSize = settings.fontSize + 'px';

  // Apply background color
  if (settings.bgColor === 'light') {
    document.documentElement.style.setProperty('--bg-primary', '#ffffff');
    document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
    document.documentElement.style.setProperty('--bg-tertiary', '#e8e8e8');
    document.documentElement.style.setProperty('--text-primary', '#1a1a1a');
    document.documentElement.style.setProperty('--text-secondary', '#666666');
    document.documentElement.style.setProperty('--border-color', '#d0d0d0');
  } else {
    document.documentElement.style.setProperty('--bg-primary', '#1e1e1e');
    document.documentElement.style.setProperty('--bg-secondary', '#252526');
    document.documentElement.style.setProperty('--bg-tertiary', '#2d2d2d');
    document.documentElement.style.setProperty('--text-primary', '#e0e0e0');
    document.documentElement.style.setProperty('--text-secondary', '#a0a0a0');
    document.documentElement.style.setProperty('--border-color', '#3d3d3d');
  }

  // Apply to settings UI
  fontSizeSelect.value = settings.fontSize;
  bgColorSelect.value = settings.bgColor;
  languageSelect.value = settings.language;
  userAvatarInput.value = settings.userAvatar || 'U';
}

// Providers
async function loadProviders() {
  try {
    const saved = localStorage.getItem('ai-chat-providers');
    if (saved) {
      providers = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load providers:', error);
  }
}

function saveProviders() {
  localStorage.setItem('ai-chat-providers', JSON.stringify(providers));
}

function renderProviders() {
  providersList.innerHTML = providers.map(provider => `
    <div class="provider-card">
      <div class="provider-card-header">
        <div class="provider-name">${provider.name}</div>
        <div class="provider-actions">
          <button class="btn-secondary" onclick="editProvider('${provider.id}')">编辑</button>
          ${provider.id !== 'zhipu' ? `<button class="btn-secondary" onclick="deleteProvider('${provider.id}')">删除</button>` : ''}
        </div>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
        ${provider.endpoint || '未设置Endpoint'}
      </div>
      <div class="provider-models">
        ${provider.models.map(model => `<span class="model-tag">${model}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

window.editProvider = function(providerId) {
  const provider = providers.find(p => p.id === providerId);
  if (!provider) return;

  const newApiKey = prompt('输入 API Key:', provider.apiKey || '');
  if (newApiKey !== null) {
    provider.apiKey = newApiKey;
  }

  const newEndpoint = prompt('输入 Endpoint:', provider.endpoint || '');
  if (newEndpoint !== null) {
    provider.endpoint = newEndpoint;
  }

  saveProviders();
  renderProviders();
};

window.deleteProvider = function(providerId) {
  if (confirm('确认删除此模型商?')) {
    providers = providers.filter(p => p.id !== providerId);
    saveProviders();
    renderProviders();
  }
};

// Conversations
async function loadConversations() {
  try {
    const saved = localStorage.getItem('ai-chat-conversations');
    if (saved) {
      conversations = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load conversations:', error);
    conversations = [];
  }
}

function saveConversations() {
  localStorage.setItem('ai-chat-conversations', JSON.stringify(conversations));
}

async function createNewConversation() {
  const conversation = {
    id: Date.now().toString(),
    title: '新对话',
    messages: [],
    createdAt: new Date().toISOString()
  };

  conversations.unshift(conversation);
  saveConversations();
  await selectConversation(conversation.id);
  renderConversationList();
}

async function selectConversation(id) {
  currentConversationId = id;
  const conversation = conversations.find(c => c.id === id);

  if (conversation) {
    chatTitle.textContent = conversation.title;
    renderMessages();
    renderConversationList();
  }
}

function deleteConversation(id, event) {
  event.stopPropagation();

  conversations = conversations.filter(c => c.id !== id);
  saveConversations();

  if (currentConversationId === id) {
    if (conversations.length > 0) {
      selectConversation(conversations[0].id);
    } else {
      createNewConversation();
    }
  }

  renderConversationList();
}

// Format timestamp
function formatTimestamp(isoString) {
  const date = new Date(isoString);

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Format token count
function formatTokens(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  return count.toString();
}

// Messages
function renderMessages() {
  const conversation = conversations.find(c => c.id === currentConversationId);

  if (!conversation || conversation.messages.length === 0) {
    messagesEl.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>开始一个新对话</p>
      </div>
    `;
    return;
  }

  messagesEl.innerHTML = conversation.messages.map(msg => {
    let metaHtml = '';

    if (msg.role === 'assistant') {
      const timestamp = msg.timestamp ? formatTimestamp(msg.timestamp) : '';
      const tokens = msg.tokens ? `${formatTokens(msg.tokens.prompt_tokens)} + ${formatTokens(msg.tokens.completion_tokens)} = ${formatTokens(msg.tokens.total_tokens)}` : '';

      metaHtml = `
        <div class="message-meta">
          ${timestamp ? `<span class="message-timestamp">🕐 ${timestamp}</span>` : ''}
          ${tokens ? `<span class="message-tokens">📊 <span>${tokens}</span> tokens</span>` : ''}
          ${msg.streaming ? `<span class="streaming-indicator"><span></span><span></span><span></span></span>` : ''}
        </div>
      `;
    } else if (msg.role === 'user' && msg.timestamp) {
      metaHtml = `
        <div class="message-meta">
          <span class="message-timestamp">🕐 ${formatTimestamp(msg.timestamp)}</span>
        </div>
      `;
    }

    const avatar = msg.role === 'user' ? (settings.userAvatar || 'U') : 'AI';

    return `
      <div class="message ${msg.role}" id="msg-${msg.id}">
        <div class="message-avatar">
          ${avatar}
        </div>
        <div>
          <div class="message-content">${formatMessage(msg.content)}</div>
          ${metaHtml}
        </div>
      </div>
    `;
  }).join('');

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatMessage(content) {
  const contentStr = typeof content === 'string' ? content : String(content);
  const renderer = new marked.Renderer();

  renderer.code = function(code, language) {
    let codeText = '';
    let lang = '';

    if (typeof code === 'string') {
      codeText = code;
    } else if (code && typeof code === 'object') {
      codeText = code.text || code.raw || '';
    } else {
      codeText = String(code || '');
    }

    if (typeof language === 'string') {
      lang = language;
    } else if (language && typeof language === 'object') {
      lang = language.lang || '';
    }

    lang = lang || 'code';

    const escapedCode = codeText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const encodedCode = encodeURIComponent(codeText);

    return `<pre class="code-block"><div class="code-block-header"><span>${lang}</span><button class="code-copy-btn" onclick="copyCodeBlock(this)" data-code="${encodedCode}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>复制</span></button></div><code>${escapedCode}</code></pre>`;
  };

  marked.setOptions({
    renderer: renderer,
    breaks: true,
    gfm: true,
  });

  try {
    const result = marked.parse(contentStr);
    return result;
  } catch (error) {
    console.error('Markdown parse error:', error);
    return contentStr;
  }
}

window.copyCodeBlock = function(button) {
  const code = decodeURIComponent(button.getAttribute('data-code'));

  navigator.clipboard.writeText(code).then(() => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>已复制</span>';
    button.classList.add('copied');

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    button.textContent = '复制失败';
  });
};

function addMessageToConversation(role, content, extra = {}) {
  const conversation = conversations.find(c => c.id === currentConversationId);

  if (conversation) {
    const message = {
      id: extra.id || Date.now().toString(),
      role,
      content,
      timestamp: extra.timestamp || new Date().toISOString(),
      ...extra
    };

    conversation.messages.push(message);

    if (conversation.messages.length === 1 && role === 'user') {
      conversation.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      chatTitle.textContent = conversation.title;
      renderConversationList();
    }

    saveConversations();
    return message;
  }
}

function updateMessageInConversation(messageId, updates) {
  const conversation = conversations.find(c => c.id === currentConversationId);

  if (conversation) {
    const message = conversation.messages.find(m => m.id === messageId);
    if (message) {
      Object.assign(message, updates);
      saveConversations();
      return message;
    }
  }
}

// Update character counter
function updateCharCounter() {
  const currentLength = messageInput.value.length;
  charCounter.textContent = `${currentLength}/${MAX_CHARACTERS}`;

  charCounter.classList.remove('warning', 'error');

  if (currentLength > MAX_CHARACTERS) {
    charCounter.classList.add('error');
    sendBtn.disabled = true;
  } else if (currentLength > MAX_CHARACTERS * 0.9) {
    charCounter.classList.add('warning');
    sendBtn.disabled = false;
  } else {
    sendBtn.disabled = false;
  }
}

// Handle mouse move for resizing
function handleMouseMove(e) {
  if (!isResizing) return;

  const deltaY = startY - e.clientY;
  const newHeight = Math.max(60, Math.min(400, startHeight + deltaY));

  inputWrapper.style.height = newHeight + 'px';
  messageInput.style.height = newHeight + 'px';
}

// Handle mouse up for resizing
function handleMouseUp() {
  isResizing = false;

  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

// API Calls
async function sendMessage() {
  if (streamingAbortController) {
    showConfirmDialog();
    return;
  }

  const content = messageInput.value.trim();

  if (!content) return;

  if (content.length > MAX_CHARACTERS) {
    alert(`消息长度超过限制 (${MAX_CHARACTERS} 字符)`);
    return;
  }

  const currentProvider = providers.find(p => p.models.includes(settings.model));
  if (!currentProvider || !currentProvider.apiKey) {
    alert('请先在模型商设置中配置 API Key');
    switchView('providers');
    return;
  }

  pendingUserMessage = content;

  addMessageToConversation('user', content, {
    timestamp: new Date().toISOString()
  });
  messageInput.value = '';
  updateCharCounter();

  updateSendButtonState(true);

  const assistantMessageId = Date.now().toString() + '-assistant';
  currentStreamingMessageId = assistantMessageId;
  addMessageToConversation('assistant', '', {
    id: assistantMessageId,
    streaming: true,
    timestamp: new Date().toISOString()
  });

  renderMessages();

  streamingAbortController = new AbortController();

  try {
    const conversation = conversations.find(c => c.id === currentConversationId);
    const apiEndpoint = currentProvider.endpoint;

    const apiMessages = conversation.messages
      .filter(m => !m.streaming && m.role !== 'assistant')
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    let fullContent = '';

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentProvider.apiKey}`
      },
      body: JSON.stringify({
        model: settings.model,
        messages: apiMessages,
        stream: true
      }),
      signal: streamingAbortController.signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let usageData = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith(':')) {
          continue;
        }

        if (trimmedLine === 'data: [DONE]') {
          continue;
        }

        if (trimmedLine.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmedLine.slice(6));

            let deltaContent = '';
            if (data.choices && data.choices[0]) {
              const choice = data.choices[0];

              if (choice.delta && choice.delta.content) {
                deltaContent = choice.delta.content;
              }

              if (choice.usage) {
                usageData = {
                  prompt_tokens: choice.usage.prompt_tokens,
                  completion_tokens: choice.usage.completion_tokens,
                  total_tokens: choice.usage.total_tokens
                };
              }
            }

            if (data.usage) {
              usageData = {
                prompt_tokens: data.usage.prompt_tokens,
                completion_tokens: data.usage.completion_tokens,
                total_tokens: data.usage.total_tokens
              };
            }

            if (data.content) {
              deltaContent = data.content;
            }

            if (deltaContent) {
              fullContent += deltaContent;

              updateMessageInConversation(assistantMessageId, {
                content: fullContent
              });

              renderMessages();
            }
          } catch (e) {
            console.warn('Failed to parse SSE data:', trimmedLine, e);
          }
        }
      }
    }

    if (usageData) {
      updateMessageInConversation(assistantMessageId, {
        tokens: usageData
      });
    }

    updateMessageInConversation(assistantMessageId, {
      content: fullContent,
      streaming: false
    });

    renderMessages();

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Streaming stopped by user');
      return;
    }

    console.error('Failed to send message:', error);

    updateMessageInConversation(assistantMessageId, {
      content: `错误: ${error.message}`,
      streaming: false
    });

    renderMessages();
  } finally {
    updateSendButtonState(false);
    messageInput.disabled = false;
    messageInput.focus();
    streamingAbortController = null;
    currentStreamingMessageId = null;
    pendingUserMessage = null;
  }
}

// Stop streaming function
async function stopStreaming() {
  if (streamingAbortController) {
    streamingAbortController.abort();
    streamingAbortController = null;
  }

  if (currentStreamingMessageId) {
    const conversation = conversations.find(c => c.id === currentConversationId);
    if (conversation) {
      conversation.messages = conversation.messages.filter(m => m.id !== currentStreamingMessageId);
      saveConversations();
      renderMessages();
    }
  }

  if (pendingUserMessage) {
    messageInput.value = pendingUserMessage;
    pendingUserMessage = null;
    updateCharCounter();
  }

  updateSendButtonState(false);
  sendBtn.disabled = false;
  messageInput.disabled = false;
  messageInput.focus();
}

// Update send button state
function updateSendButtonState(isStreaming) {
  if (isStreaming) {
    sendBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
      </svg>
    `;
    sendBtn.classList.add('btn-stop');
    messageInput.disabled = true;
  } else {
    sendBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    `;
    sendBtn.classList.remove('btn-stop');
    messageInput.disabled = false;
  }
}

// UI Functions
function renderConversationList() {
  conversationListEl.innerHTML = conversations.map(conv => `
    <div class="conversation-item ${conv.id === currentConversationId ? 'active' : ''}"
         onclick="selectConversation('${conv.id}')">
      <div class="conversation-title">${conv.title}</div>
      <button class="conversation-delete" onclick="deleteConversation('${conv.id}', event)">×</button>
    </div>
  `).join('');
}

function showConfirmDialog() {
  confirmDialog.classList.remove('hidden');
}

function hideConfirmDialog() {
  confirmDialog.classList.add('hidden');
}

// Translation
async function performTranslation() {
  const sourceText = translatorSource.value.trim();

  if (!sourceText) {
    alert('请输入要翻译的文本');
    return;
  }

  if (sourceText.length > MAX_TRANSLATION_CHARS) {
    alert(`文本长度超过限制 (${MAX_TRANSLATION_CHARS} 字符)`);
    return;
  }

  const currentProvider = providers.find(p => p.apiKey && p.models.includes(translatorModelSelect.value));
  if (!currentProvider) {
    alert('请先在模型商设置中配置 API Key');
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = '翻译中...';
  translatorResult.innerHTML = '<span class="streaming-indicator"><span></span><span></span><span></span></span>';

  try {
    const sourceLang = sourceLangSelect.value;
    const targetLang = targetLangSelect.value;

    const prompt = sourceLang === 'auto'
      ? `Translate the following text to ${targetLang}. Only provide the translation, no explanations.\n\n${sourceText}`
      : `Translate the following ${sourceLang} text to ${targetLang}. Only provide the translation, no explanations.\n\n${sourceText}`;

    const response = await fetch(currentProvider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentProvider.apiKey}`
      },
      body: JSON.stringify({
        model: translatorModelSelect.value,
        messages: [{ role: 'user', content: prompt }],
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullTranslation = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
        if (trimmedLine === 'data: [DONE]') continue;

        try {
          const data = JSON.parse(trimmedLine.slice(6));
          let deltaContent = '';

          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            deltaContent = data.choices[0].delta.content;
          }

          if (deltaContent) {
            fullTranslation += deltaContent;
            translatorResult.textContent = fullTranslation;
          }
        } catch (e) {
          // Skip parse errors
        }
      }
    }

    translatorResult.textContent = fullTranslation;
    copyTranslationBtn.style.display = 'block';

  } catch (error) {
    console.error('Translation error:', error);
    translatorResult.textContent = `翻译失败: ${error.message}`;
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = '翻译';
  }
}

// Event Listeners
function setupEventListeners() {
  // Navigation
  settingsBtn.addEventListener('click', () => switchView('settings'));
  providersBtn.addEventListener('click', () => switchView('providers'));
  aboutBtn.addEventListener('click', () => switchView('about'));
  translatorBtn.addEventListener('click', () => switchView('translator'));
  newChatBtn.addEventListener('click', () => {
    switchView('chat');
    createNewConversation();
  });

  // Settings
  fontSizeSelect.addEventListener('change', (e) => {
    settings.fontSize = parseInt(e.target.value);
    saveSettingsToStorage();
    applySettings();
  });

  bgColorSelect.addEventListener('change', (e) => {
    settings.bgColor = e.target.value;
    saveSettingsToStorage();
    applySettings();
  });

  languageSelect.addEventListener('change', (e) => {
    settings.language = e.target.value;
    saveSettingsToStorage();
  });

  userAvatarInput.addEventListener('change', (e) => {
    settings.userAvatar = e.target.value;
    saveSettingsToStorage();
    renderMessages();
  });

  // Chat
  sendBtn.addEventListener('click', sendMessage);

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.altKey) {
        e.preventDefault();
        const start = messageInput.selectionStart;
        const end = messageInput.selectionEnd;
        const value = messageInput.value;

        messageInput.value = value.substring(0, start) + '\n' + value.substring(end);
        messageInput.selectionStart = messageInput.selectionEnd = start + 1;
        updateCharCounter();
      } else if (!e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }
  });

  messageInput.addEventListener('input', () => {
    updateCharCounter();
  });

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startY = e.clientY;
    startHeight = inputWrapper.offsetHeight;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  });

  // Confirm dialog
  confirmCancelBtn.addEventListener('click', hideConfirmDialog);
  confirmOkBtn.addEventListener('click', async () => {
    hideConfirmDialog();
    await stopStreaming();
  });

  confirmDialog.addEventListener('click', (e) => {
    if (e.target === confirmDialog) {
      hideConfirmDialog();
    }
  });

  // Translator
  translateBtn.addEventListener('click', performTranslation);

  translatorSource.addEventListener('input', () => {
    const charCount = translatorSource.value.length;
    const charCountEl = document.querySelector('.char-count');
    charCountEl.textContent = `${charCount}/${MAX_TRANSLATION_CHARS}`;

    if (charCount > MAX_TRANSLATION_CHARS) {
      charCountEl.style.color = '#ff6b6b';
    } else if (charCount > MAX_TRANSLATION_CHARS * 0.9) {
      charCountEl.style.color = '#ffa500';
    } else {
      charCountEl.style.color = 'var(--text-secondary)';
    }
  });

  copyTranslationBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(translatorResult.textContent).then(() => {
      const originalText = copyTranslationBtn.textContent;
      copyTranslationBtn.textContent = '已复制';
      setTimeout(() => {
        copyTranslationBtn.textContent = originalText;
      }, 2000);
    });
  });

  addProviderBtn.addEventListener('click', () => {
    const name = prompt('输入模型商名称:');
    if (!name) return;

    const endpoint = prompt('输入 API Endpoint:');
    if (!endpoint) return;

    const newProvider = {
      id: 'custom_' + Date.now(),
      name,
      apiKey: '',
      endpoint,
      models: []
    };

    providers.push(newProvider);
    saveProviders();
    renderProviders();
  });
}

// Make functions globally available
window.selectConversation = selectConversation;
window.deleteConversation = deleteConversation;

// Start the app
init();
